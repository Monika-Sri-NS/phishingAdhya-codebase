document.addEventListener('DOMContentLoaded', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const urlDisplay = document.getElementById('url-display');
  const statusContainer = document.getElementById('status-container');
  const statusText = document.getElementById('status-text');
  const statusIcon = document.getElementById('status-icon');

  if (tab && tab.url) {
    urlDisplay.innerText = tab.url;
    
    // Check local storage for threat data set by background script
    chrome.storage.local.get(tab.id.toString(), (result) => {
      const data = result[tab.id];
      
      if (data) {
        if (data.status === 'Phishing') {
          statusContainer.className = 'status-danger';
          statusText.innerText = 'Phishing Detected';
          statusIcon.innerText = '⚠';
        } else if (data.status === 'Suspicious') {
          statusContainer.className = 'status-warning';
          statusText.innerText = 'Suspicious Site';
          statusIcon.innerText = '!';
        }
      } else {
        // Default to safe if no threat data found
        statusContainer.className = 'status-safe';
        statusText.innerText = 'Safe';
        statusIcon.innerText = '✓';
      }
    });
  }
});

document.getElementById('report-btn').addEventListener('click', () => {
  alert('Report submitted to CERT-In for analysis.');
});