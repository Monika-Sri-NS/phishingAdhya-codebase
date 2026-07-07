document.addEventListener('DOMContentLoaded', async () => {

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const urlDisplay = document.getElementById('url-display');
  const statusContainer = document.getElementById('status-container');
  const statusText = document.getElementById('status-text');
  const statusIcon = document.getElementById('status-icon');

  if (tab && tab.url) {

    urlDisplay.innerText = tab.url;

    try {
      const res = await fetch('http://localhost:3001/api/check-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: tab.url })
      });

      const data = await res.json();

      // 🔥 CORRECT COLOR + ICON MAPPING
      if (data.status === 'Safe') {
        statusContainer.className = 'status-safe';
        statusText.innerText = 'Safe';
        statusIcon.innerText = '✓';
      } 
      else if (data.status === 'Suspicious') {
        statusContainer.className = 'status-warning';
        statusText.innerText = 'Suspicious';
        statusIcon.innerText = '⚠';
      } 
      else if (data.status === 'Phishing') {
        statusContainer.className = 'status-danger';
        statusText.innerText = 'Phishing';
        statusIcon.innerText = '🚨';
      }

    } catch (err) {
      console.error(err);
      statusContainer.className = 'status-warning';
      statusText.innerText = "Error";
      statusIcon.innerText = '⚠';
    }
  }
});