const API_URL = 'http://localhost:3001/api/check-url';

console.log("🔥 Background Loaded");

// Prevent duplicate alerts per tab
const alertedTabs = new Set();

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {

  // Only run when URL exists
  if (!tab.url) return;

  // Skip internal browser pages
  if (
    tab.url.startsWith('chrome://') ||
    tab.url.startsWith('edge://') ||
    tab.url.startsWith('about:')
  ) return;

  // Avoid running multiple times unnecessarily
  if (changeInfo.status !== 'complete') return;

  try {
    console.log("Checking:", tab.url);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: tab.url })
    });

    const data = await response.json();

    console.log("Result:", data);

    // Only alert once per tab
    if (alertedTabs.has(tabId)) return;

    if (data.status === 'Phishing' || data.status === 'Suspicious') {

      chrome.scripting.executeScript({
        target: { tabId: tabId, allFrames: false },
        func: (status) => {

          alert("🚨 WARNING: This site is " + status);

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
          div.innerText = `WARNING: This site is ${status}`;

          document.body.prepend(div);

        },
        args: [data.status]
      }).catch(() => {
        // Ignore injection errors (error pages etc.)
      });

      // Mark this tab as alerted
      alertedTabs.add(tabId);

      // Badge
      chrome.action.setBadgeText({ text: '!', tabId });
      chrome.action.setBadgeBackgroundColor({ color: '#FF0000', tabId });

    } else {
      chrome.action.setBadgeText({ text: '', tabId });
    }

  } catch (err) {
    console.error("ERROR:", err);
  }
});

// Clear alert state when tab is closed or refreshed
chrome.tabs.onRemoved.addListener((tabId) => {
  alertedTabs.delete(tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'loading') {
    alertedTabs.delete(tabId);
  }
});