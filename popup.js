// Seçili para birimini kaydet ve fiyatı güncelle
document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get("currency", (data) => {
      document.getElementById(data.currency === "EUR" ? "eur" : "usd").checked = true;
    });
  
    document.querySelectorAll("input[name='currency']").forEach((radio) => {
      radio.addEventListener("change", (event) => {
        const currency = event.target.value;
        chrome.storage.sync.set({ currency }, () => {
          // Arka planda çalışan service worker'a fiyatı güncellemesi için sinyal gönder
          chrome.runtime.sendMessage({ action: "updatePrice" });
        });
      });
    });
  });
  