const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

// Set some defaults (required if your JSON file is empty)
db.defaults({ 
  threats: [
    { id: 1, url: "http://malicious-bank-login.com", status: "Phishing", detectedAt: "2023-10-27T10:00:00Z", severity: "High", target: "FinanceDept" },
    { id: 2, url: "http://suspicious-link.net", status: "Suspicious", detectedAt: "2023-10-27T11:30:00Z", severity: "Medium", target: "General" },
    { id: 3, url: "http://safe-site.org", status: "Safe", detectedAt: "2023-10-26T09:15:00Z", severity: "Low", target: "None" }
  ],
  reports: [],
  takedowns: [],
  userProfile: {
    name: "Admin User",
    email: "admin@cse.gov.in",
    phone: "+91 9876543210",
    organization: "National Cyber Security Agency",
    role: "Senior Analyst",
    avatar: "https://i.pravatar.cc/150?u=admin"
  },
  certifications: [
    { id: 1, name: "ISO 27001", status: "Connected", expiry: "2024-12-31", icon: "Shield" },
    { id: 2, name: "SOC 2 Type II", status: "Pending", expiry: "2024-06-30", icon: "FileCheck" },
    { id: 3, name: "GDPR Compliance", status: "Expired", expiry: "2023-01-01", icon: "Globe" }
  ]
}).write();

module.exports = db;