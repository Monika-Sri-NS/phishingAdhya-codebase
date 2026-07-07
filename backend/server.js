const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const db = require('./db');
const { classifyUrl } = require('./detector');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// --- API ROUTES ---

// 0. Health Check
app.get('/api/health', (req, res) => {
  const dbStatus = db.getState() ? 'connected' : 'disconnected';
  res.json({ status: 'ok', database: dbStatus });
});

// 1. Get All Threats
app.get('/api/threats', (req, res) => {
  const threats = db.get('threats').value();
  res.json(threats);
});

// 2. Check URL (FIXED)
app.post('/api/check-url', (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const status = classifyUrl(url);
  const severity =
    status === 'Phishing'
      ? 'High'
      : status === 'Suspicious'
      ? 'Medium'
      : 'Low';

  const existing = db.get('threats').find({ url }).value();

  if (existing) {
    db.get('threats')
      .find({ url })
      .assign({ status, severity })
      .write();
  } else if (status !== 'Safe') {
    db.get('threats').push({
      id: Date.now(),
      url,
      status,
      detectedAt: new Date().toISOString(),
      severity,
      target: 'Unknown'
    }).write();
  }

  res.json({ status, severity });
});

// 3. Takedown Request
app.post('/api/takedown', (req, res) => {
  const { threatId } = req.body;
  const threat = db.get('threats').find({ id: threatId }).value();

  if (!threat) return res.status(404).json({ error: 'Threat not found' });

  db.get('threats')
    .find({ id: threatId })
    .assign({ status: 'Takedown Requested' })
    .write();

  db.get('takedowns').push({
    id: Date.now(),
    threatId,
    requestedAt: new Date().toISOString(),
    status: 'Pending'
  }).write();

  res.json({ success: true, message: 'Takedown request sent successfully' });
});

// 4. User Profile
app.get('/api/profile', (req, res) => {
  const profile = db.get('userProfile').value();
  res.json(profile);
});

app.put('/api/profile', (req, res) => {
  const updatedProfile = req.body;
  db.set('userProfile', updatedProfile).write();
  res.json({ success: true, profile: updatedProfile });
});

// 5. Certifications
app.get('/api/certifications', (req, res) => {
  const certs = db.get('certifications').value();
  res.json(certs);
});

app.post('/api/certifications', (req, res) => {
  const newCert = { id: Date.now(), ...req.body, status: 'Pending' };
  db.get('certifications').push(newCert).write();
  res.json(newCert);
});

// 6. Alerts
app.get('/api/alerts', (req, res) => {
  const highSeverityThreats = db.get('threats')
    .filter(t => t.severity === 'High' || t.severity === 'Critical')
    .value()
    .map(t => ({
      id: t.id,
      message: `High severity threat detected: ${t.url}`,
      severity: t.severity,
      timestamp: t.detectedAt,
      status: 'Active',
      source: 'Detector'
    }));

  const systemAlerts = [
    {
      id: 999,
      message: 'System scan completed successfully',
      severity: 'Low',
      timestamp: new Date().toISOString(),
      status: 'Resolved',
      source: 'System'
    }
  ];

  res.json([...highSeverityThreats, ...systemAlerts]);
});

// 7. Logs
app.get('/api/logs', (req, res) => {
  const threats = db.get('threats').value();

  const logs = threats.map(t => ({
    id: t.id,
    timestamp: t.detectedAt,
    level: t.severity,
    message: `${t.status} detected for ${t.url}`,
    source: 'Detector'
  }));

  res.json(logs);
});

// 8. Reports
app.get('/api/reports', (req, res) => {
  const reports = [
    { id: 101, title: 'Weekly Phishing Summary', date: '2023-10-25', type: 'PDF', size: '2.4 MB' },
    { id: 102, title: 'Incident Report #4492', date: '2023-10-24', type: 'CSV', size: '156 KB' }
  ];
  res.json(reports);
});

app.listen(PORT, () => {
  console.log(`Phishing Detection Backend running on http://localhost:${PORT}`);
});