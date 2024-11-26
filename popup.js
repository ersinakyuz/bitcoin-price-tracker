// Save the selected currency and update the price
document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get("currency", (data) => {
      document.getElementById(data.currency === "EUR" ? "eur" : "usd").checked = true;
    });
  
    document.querySelectorAll("input[name='currency']").forEach((radio) => {
      radio.addEventListener("change", (event) => {
        const currency = event.target.value;
        chrome.storage.sync.set({ currency }, () => {
          // Signal the background service worker to update the price
          chrome.runtime.sendMessage({ action: "updatePrice" });
        });
      });
    });
  });
  
  // Function to replace elements with i18n messages
function localizeHtmlPage() {
  document.querySelectorAll('[data-i18n]').forEach(elem => {
      const messageKey = elem.getAttribute('data-i18n');
      elem.textContent = chrome.i18n.getMessage(messageKey);
  });
}

// Call the function to localize the popup
localizeHtmlPage();


// NSFW Mode
document.getElementById('nsfwMode').addEventListener('change', function () {
  const nsfwEnabled = this.checked;
  chrome.storage.sync.set({ nsfwMode: nsfwEnabled }, function () {
      console.log('NSFW mode is now', nsfwEnabled ? 'enabled' : 'disabled');
  });
});

// Load option state when page loads
window.addEventListener('load', function () {
  chrome.storage.sync.get('nsfwMode', function (data) {
      document.getElementById('nsfwMode').checked = data.nsfwMode || false;
  });
});


// Change popup title
window.addEventListener('load', function () {
  chrome.storage.sync.get('nsfwMode', function (data) {
      if (data.nsfwMode) {
          document.getElementById('title').textContent = 'CPU Utilization';
      } else {
          document.getElementById('title').textContent = 'Bitcoin Price';
      }
  });
});

