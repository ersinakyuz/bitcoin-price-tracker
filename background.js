function formatPrice(price, nsfwMode) {
  if (nsfwMode) {
      return (price / 1e3).toFixed(1) + "%"; // Percentega for NSFW mode
  } else if (price >= 1e6) {
      return (price / 1e6).toFixed(1) + "M";
  } else if (price >= 1e3) {
      return (price / 1e3).toFixed(1) + "K";
  } else {
      return price.toString();
  }
}

async function fetchBitcoinPrice() {
  try {
      const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur");
      const data = await response.json();

      chrome.storage.sync.get(["currency", "nsfwMode"], (storageData) => {
          const currency = storageData.currency || "USD";
          const nsfwMode = storageData.nsfwMode || false; // by default NSFW disabled

          const bitcoinPrice = currency === "EUR"
              ? Math.round(data.bitcoin.eur)
              : Math.round(data.bitcoin.usd);

          const formattedPrice = formatPrice(bitcoinPrice, nsfwMode);
          chrome.action.setBadgeText({ text: formattedPrice });
          chrome.action.setBadgeBackgroundColor({ color: "#FF8C00" });
          chrome.action.setTitle({ title: nsfwMode ? 'CPU Utilization' : `Bitcoin Price: ${bitcoinPrice} ${currency}` });
      });
  } catch (error) {
      console.error("Error getting price:", error);
  }
}
  
  function updateInterval(newInterval) {
    // Cancel the current alarm and create a new interval
    chrome.alarms.clear("updatePrice", () => {
      chrome.alarms.create("updatePrice", { periodInMinutes: newInterval });
    });
  }
  
  // Set update on first startup
  chrome.storage.sync.get("interval", (data) => {
    const interval = data.interval || 5; // Varsayılan interval 5 dakika
    updateInterval(interval);
    fetchBitcoinPrice();
  });
  
  // Update price when alarm is triggered
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "updatePrice") {
      fetchBitcoinPrice();
    }
  });
  
  // listen to messages from popup.js
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "updatePrice") {
      fetchBitcoinPrice();
    } else if (message.action === "updateInterval") {
      updateInterval(message.interval);
    }
  });
  

  // NSFW Mode Changes

  function updateIconAndTitle(nsfwMode) {
    if (nsfwMode) {
        chrome.action.setIcon({ path: 'cpu.png' });
        chrome.action.setTitle({ title: 'CPU Utilization' });
    } else {
        chrome.action.setIcon({ path: 'icon.png' });
        chrome.action.setTitle({ title: 'Bitcoin Price' });
    }
}

// Check NSFW mode and update icon/text
chrome.storage.sync.get('nsfwMode', function (data) {
  updateIconAndTitle(data.nsfwMode);
});

// Update when the user changes their settings
chrome.storage.onChanged.addListener(function (changes) {
  if (changes.nsfwMode) {
      updateIconAndTitle(changes.nsfwMode.newValue);
      fetchBitcoinPrice(); 

  }
});

