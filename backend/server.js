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
  // Simple check to see if DB is accessible
  const dbStatus = db.getState() ? 'connected' : 'disconnected';
  res.json({ status: 'ok', database: dbStatus });
});

// 1. Get All Threats
app.get('/api/threats', (req, res) => {
  const threats = db.get('threats').value();
  res.json(threats);
});

// 2. Check a URL (Used by Extension)
app.post('/api/check-url', (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  // Check if already in DB
  const existing = db.get('threats').find({ url }).value();
  if (existing) {
    return res.json({ status: existing.status, severity: existing.severity });
  }

  // If not, classify it
  const status = classifyUrl(url);
  const severity = status === 'Phishing' ? 'High' : (status === 'Suspicious' ? 'Medium' : 'Low');

  // Save to DB if not safe
  if (status !== 'Safe') {
    const newThreat = {
      id: Date.now(),
      url,
      status,
      detectedAt: new Date().toISOString(),
      severity,
      target: 'Unknown'
    };
    db.get('threats').push(newThreat).write();
  }

  res.json({ status, severity });
});

// 3. Takedown Request
app.post('/api/takedown', (req, res) => {
  const { threatId } = req.body;
  const threat = db.get('threats').find({ id: threatId }).value();
  
  if (!threat) return res.status(404).json({ error: 'Threat not found' });

  // Update status
  db.get('threats')
    .find({ id: threatId })
    .assign({ status: 'Takedown Requested' })
    .write();

  // Log takedown
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

// 6. Alerts (New Endpoint)
app.get('/api/alerts', (req, res) => {
  // In a real app, this would fetch from a dedicated alerts table
  // For now, we can generate alerts based on threats or return a static list
  // Let's return a mix of static alerts and high-severity threats
  
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
    { id: 999, message: 'System scan completed successfully', severity: 'Low', timestamp: new Date().toISOString(), status: 'Resolved', source: 'System' }
  ];

  res.json([...highSeverityThreats, ...systemAlerts]);
});

// 7. Logs
app.get('/api/logs', (req, res) => {
    // Mock logs for now
    const logs = [
        { id: 1, timestamp: new Date().toISOString(), level: 'INFO', message: 'Server started', source: 'System' },
        { id: 2, timestamp: new Date().toISOString(), level: 'INFO', message: 'Database connected', source: 'Database' }
    ];
    res.json(logs);
});

// 8. Reports
app.get('/api/reports', (req, res) => {
    // Mock reports
    const reports = [
        { id: 101, title: 'Weekly Phishing Summary', date: '2023-10-25', type: 'PDF', size: '2.4 MB' },
        { id: 102, title: 'Incident Report #4492', date: '2023-10-24', type: 'CSV', size: '156 KB' }
    ];
    res.json(reports);
});

app.listen(PORT, () => {
  console.log(`Phishing Detection Backend running on http://localhost:${PORT}`);
});