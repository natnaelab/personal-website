function renderLocalTime() {
  const line = document.getElementById('local-time');

  if (!line) {
    return;
  }

  const now = new Date();
  const timeIn = (timeZone) => now.toLocaleTimeString('en-GB', { timeZone, hour: '2-digit', minute: '2-digit' });
  const addis = timeIn('Africa/Addis_Ababa');
  const visitor = timeIn(undefined);

  line.textContent = addis === visitor
    ? `It’s ${addis} in Addis Ababa right now.`
    : `It’s ${addis} in Addis Ababa right now, ${visitor} where you are.`;
  line.hidden = false;
}

function loadAnalytics() {
  if (
    document.querySelector('script[data-website-id="ab0efb14-d7ce-4317-933c-cf2fbb7ddbde"]') ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  ) {
    return;
  }

  const analyticsScript = document.createElement('script');
  analyticsScript.src = 'https://cloud.umami.is/script.js';
  analyticsScript.defer = true;
  analyticsScript.dataset.websiteId = 'ab0efb14-d7ce-4317-933c-cf2fbb7ddbde';
  document.head.appendChild(analyticsScript);
}

renderLocalTime();
window.setInterval(renderLocalTime, 30000);

if ('requestIdleCallback' in window) {
  window.requestIdleCallback(loadAnalytics, { timeout: 2000 });
} else {
  window.addEventListener('load', () => window.setTimeout(loadAnalytics, 1000), { once: true });
}
