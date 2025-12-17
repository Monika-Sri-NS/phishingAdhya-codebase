// Background Service Worker

const API_URL = 'http://localhost:3001/api/check-url';

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    checkUrl(tab.url, tabId);
  }
});

async function checkUrl(url, tabId) {
  // Skip internal browser pages
  if (url.startsWith('chrome://') || url.startsWith('edge://') || url.startsWith('about:')) return;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });

    const data = await response.json();

    if (data.status === 'Phishing' || data.status === 'Suspicious') {
      // Store threat info for the popup
      chrome.storage.local.set({ [tabId]: data });
      
      // Change icon to alert
      chrome.action.setBadgeText({ text: '!', tabId });
      chrome.action.setBadgeBackgroundColor({ color: '#FF0000', tabId });

      // Optional: Inject a warning banner (simplified for this demo)
      chrome.scripting.executeScript({
        target: { tabId },
        function: showWarning,
        args: [data.status]
      });
    } else {
      chrome.action.setBadgeText({ text: '', tabId });
      chrome.storage.local.remove(tabId.toString());
    }
  } catch (error) {
    console.error('Error checking URL:', error);
  }
}

function showWarning(status) {
  const div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.top = '0';
  div.style.left = '0';
  div.style.width = '100%';
  div.style.backgroundColor = status === 'Phishing' ? '#ef4444' : '#f59e0b';
  div.style.color = 'white';
  div.style.textAlign = 'center';
  div.style.padding = '10px';
  div.style.zIndex = '999999';
  div.style.fontWeight = 'bold';
  div.style.fontFamily = 'sans-serif';
  div.innerText = `WARNING: This site is flagged as ${status}. Proceed with caution.`;
  document.body.prepend(div);
}