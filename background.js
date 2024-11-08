function formatPrice(price) {
    if (price >= 1e6) {
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
  
      chrome.storage.sync.get("currency", (storageData) => {
        const currency = storageData.currency || "USD";
        const bitcoinPrice = currency === "EUR" 
          ? Math.round(data.bitcoin.eur) 
          : Math.round(data.bitcoin.usd);
        
        const formattedPrice = formatPrice(bitcoinPrice);
        chrome.action.setBadgeText({ text: formattedPrice });
        chrome.action.setBadgeBackgroundColor({ color: "#FF8C00" });
        chrome.action.setTitle({ title: `Bitcoin Price: ${bitcoinPrice} ${currency}` });
      });
    } catch (error) {
      console.error("Fiyat alınırken hata oluştu:", error);
    }
  }
  
  function updateInterval(newInterval) {
    // Mevcut alarmı iptal et ve yeni interval ile oluştur
    chrome.alarms.clear("updatePrice", () => {
      chrome.alarms.create("updatePrice", { periodInMinutes: newInterval });
    });
  }
  
  // İlk başlatmada güncellemeyi ayarla
  chrome.storage.sync.get("interval", (data) => {
    const interval = data.interval || 5; // Varsayılan interval 5 dakika
    updateInterval(interval);
    fetchBitcoinPrice();
  });
  
  // Alarm tetiklendiğinde fiyatı güncelle
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "updatePrice") {
      fetchBitcoinPrice();
    }
  });
  
  // popup.js'den gelen mesajları dinle
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "updatePrice") {
      fetchBitcoinPrice();
    } else if (message.action === "updateInterval") {
      updateInterval(message.interval);
    }
  });
  