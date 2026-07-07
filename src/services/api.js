// Real API Service connecting to Node.js Backend with Mock Fallback
const API_BASE_URL = 'http://localhost:3001/api';

// Mock Data for Fallback
const MOCK_THREATS = [
  { id: 1, url: 'http://paypal-secure-login.com', status: 'Phishing', detectedAt: '2023-10-27T10:30:00Z', severity: 'High', source: 'Crawler' },
  { id: 2, url: 'http://verify-bank-account.net', status: 'Suspicious', detectedAt: '2023-10-27T09:15:00Z', severity: 'Medium', source: 'User Report' },
  { id: 3, url: 'http://free-crypto-giveaway.org', status: 'Phishing', detectedAt: '2023-10-26T14:20:00Z', severity: 'Critical', source: 'Extension' },
  { id: 4, url: 'http://amazon-order-update.info', status: 'Takedown Requested', detectedAt: '2023-10-25T11:00:00Z', severity: 'High', source: 'Crawler' },
  { id: 5, url: 'http://netflix-payment-failed.com', status: 'Phishing', detectedAt: '2023-10-25T08:45:00Z', severity: 'Medium', source: 'Crawler' },
  { id: 6, url: 'http://secure-login-apple.com', status: 'Active', detectedAt: '2023-10-28T09:00:00Z', severity: 'High', source: 'Crawler' },
  { id: 7, url: 'http://microsoft-update-security.net', status: 'Suspicious', detectedAt: '2023-10-28T10:15:00Z', severity: 'Low', source: 'User Report' },
];

const MOCK_ALERTS = [
  { id: 1, message: 'High volume of traffic from unknown IP', severity: 'High', timestamp: '2023-10-27 10:30:00', status: 'Active', source: 'Network Monitor' },
  { id: 2, message: 'Database backup failed', severity: 'Critical', timestamp: '2023-10-27 09:15:00', status: 'Active', source: 'Database' },
  { id: 3, message: 'New admin user created', severity: 'Medium', timestamp: '2023-10-26 14:20:00', status: 'Resolved', source: 'User Management' },
  { id: 4, url: 'http://malicious-site.com', message: 'Phishing site detected', severity: 'Critical', timestamp: '2023-10-28 11:00:00', status: 'Active', source: 'Detector' }
];

const MOCK_LOGS = [
  { id: 1, timestamp: '2023-10-27 10:00:00', level: 'CRITICAL', message: 'Phishing detected on finance-login.com', source: 'Detector Engine' },
  { id: 2, timestamp: '2023-10-27 09:45:12', level: 'INFO', message: 'System health check passed', source: 'System Monitor' },
  { id: 3, timestamp: '2023-10-27 09:30:00', level: 'WARNING', message: 'High latency on crawler node 4', source: 'Network Monitor' },
  { id: 4, timestamp: '2023-10-27 09:15:00', level: 'INFO', message: 'Database backup completed successfully', source: 'Database' },
  { id: 5, timestamp: '2023-10-27 08:55:22', level: 'ERROR', message: 'Failed to connect to external threat feed', source: 'Feed Connector' },
];

const MOCK_REPORTS = [
  { id: 101, title: 'Weekly Phishing Summary', date: '2023-10-25', type: 'PDF', size: '2.4 MB' },
  { id: 102, title: 'Incident Report #4492', date: '2023-10-24', type: 'CSV', size: '156 KB' },
  { id: 103, title: 'Domain Takedown Status', date: '2023-10-22', type: 'PDF', size: '1.1 MB' },
  { id: 104, title: 'Monthly Security Audit', date: '2023-10-01', type: 'PDF', size: '5.6 MB' },
];

const MOCK_CERTS = [
  { id: 1, name: 'ISO 27001', status: 'Connected', expiry: '2024-12-31', icon: 'Shield' },
  { id: 2, name: 'SOC 2 Type II', status: 'Pending', expiry: '2024-06-30', icon: 'FileCheck' },
  { id: 3, name: 'GDPR Compliance', status: 'Expired', expiry: '2023-09-15', icon: 'Globe' },
];

const MOCK_PROFILE = {
  name: 'Admin User',
  email: 'admin@secure-org.com',
  phone: '+1 (555) 123-4567',
  organization: 'Secure Corp',
  role: 'Administrator',
  avatar: null
};

export const ApiService = {
  // Health Check
  checkHealth: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) throw new Error('Backend unhealthy');
      return await response.json();
    } catch (error) {
      console.warn('API Error (checkHealth): Backend unreachable', error);
      return { status: 'offline', database: 'disconnected' };
    }
  },

  // Threats
  getThreats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/threats`);
      if (!response.ok) throw new Error('Failed to fetch threats');
      return await response.json();
    } catch (error) {
      console.warn('API Error (getThreats): Using mock data', error);
      return MOCK_THREATS;
    }
  },

  // Dashboard Stats (Aggregated from threats)
  getDashboardStats: async () => {
    try {
      const threats = await ApiService.getThreats();
      return {
        activeThreats: threats.filter(t => t.status === 'Phishing' || t.status === 'Active').length,
        suspicious: threats.filter(t => t.status === 'Suspicious').length,
        takedowns: threats.filter(t => t.status === 'Takedown Requested').length,
        avgResponseTime: '12m'
      };
    } catch (error) {
      console.warn('API Error (getDashboardStats): Using mock data', error);
      return { activeThreats: 12, suspicious: 5, takedowns: 3, avgResponseTime: '12m' };
    }
  },

  // Phishing Trends
  getPhishingTrends: async () => {
    // Always mock for now as backend aggregation might be complex
    return [
      { name: 'Mon', value: 12 },
      { name: 'Tue', value: 19 },
      { name: 'Wed', value: 15 },
      { name: 'Thu', value: 25 },
      { name: 'Fri', value: 32 },
      { name: 'Sat', value: 20 },
      { name: 'Sun', value: 10 },
    ];
  },

  // Reports
  getReports: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reports`);
      if (!response.ok) throw new Error('Failed to fetch reports');
      return await response.json();
    } catch (error) {
      console.warn('API Error (getReports): Using mock data', error);
      return MOCK_REPORTS;
    }
  },

  // Alerts - FIXED: Added missing method
  getAlerts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts`);
      if (!response.ok) throw new Error('Failed to fetch alerts');
      return await response.json();
    } catch (error) {
      console.warn('API Error (getAlerts): Using mock data', error);
      return MOCK_ALERTS;
    }
  },

  // Logs
// Logs
getLogs: async () => {
  const response = await fetch('http://localhost:3001/api/logs');

  if (!response.ok) {
    throw new Error('Failed to fetch logs');
  }

  return await response.json();
},

// User Profile
getUserProfile: async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return await response.json();
  } catch (error) {
    console.warn('API Error (getUserProfile): Using mock data', error);
    return MOCK_PROFILE;
  }
},

  updateUserProfile: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.warn('API Error (updateUserProfile): Mocking success', error);
      return { ...MOCK_PROFILE, ...data };
    }
  },

  // Certifications
  getCertifications: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/certifications`);
      if (!response.ok) throw new Error('Failed to fetch certifications');
      return await response.json();
    } catch (error) {
      console.warn('API Error (getCertifications): Using mock data', error);
      return MOCK_CERTS;
    }
  },

  addCertification: async (certData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/certifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(certData)
      });
      return await response.json();
    } catch (error) {
      console.warn('API Error (addCertification): Mocking success', error);
      return { id: Date.now(), ...certData, status: 'Pending' };
    }
  },

  // Takedown
  requestTakedown: async (threatId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/takedown`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threatId })
      });
      return await response.json();
    } catch (error) {
      console.warn('API Error (requestTakedown): Mocking success', error);
      return { success: true, message: 'Takedown requested successfully' };
    }
  }
};