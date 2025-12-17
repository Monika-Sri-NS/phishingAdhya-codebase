// Mock Detection Logic
// In a real system, this would use ML models, heuristic analysis, and threat intelligence feeds.

const classifyUrl = (url) => {
  const lowerUrl = url.toLowerCase();
  
  // Simulate detection based on keywords
  if (lowerUrl.includes('bank') || lowerUrl.includes('login') || lowerUrl.includes('secure') || lowerUrl.includes('account')) {
    // Random chance to be phishing for demo purposes if it looks sensitive
    return Math.random() > 0.3 ? 'Phishing' : 'Suspicious';
  }
  
  if (lowerUrl.includes('malware') || lowerUrl.includes('virus') || lowerUrl.includes('trojan')) {
    return 'Phishing';
  }

  if (lowerUrl.includes('google') || lowerUrl.includes('microsoft') || lowerUrl.includes('apple')) {
     // Typosquatting simulation (very basic)
     return 'Safe'; 
  }

  // Default to Safe or Suspicious randomly
  return Math.random() > 0.8 ? 'Suspicious' : 'Safe';
};

module.exports = { classifyUrl };