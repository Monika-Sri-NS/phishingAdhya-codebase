const classifyUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();

    // ✅ TRUSTED DOMAINS (STRICT CHECK)
    const trustedSites = [
      'google.com',
      'www.google.com',
      'github.com',
      'www.github.com',
      'microsoft.com',
      'apple.com',
      'amazon.com',
      'facebook.com'
    ];

    if (trustedSites.includes(hostname)) {
      return 'Safe';
    }

    // 🚨 STRONG PHISHING KEYWORDS
    const phishingKeywords = [
      'bank-login',
      'verify-account',
      'secure-update',
      'free-money',
      'crypto-giveaway',
      'update-password'
    ];

    if (phishingKeywords.some(k => url.includes(k))) {
      return 'Phishing';
    }

    // ⚠ SUSPICIOUS KEYWORDS
    const suspiciousKeywords = [
      'login',
      'secure',
      'account',
      'update'
    ];

    if (suspiciousKeywords.some(k => url.includes(k))) {
      return 'Suspicious';
    }

    // 🚨 MALWARE
    if (
      url.includes('malware') ||
      url.includes('virus') ||
      url.includes('trojan')
    ) {
      return 'Phishing';
    }

    return 'Safe';

  } catch (err) {
    return 'Safe';
  }
};

module.exports = { classifyUrl };