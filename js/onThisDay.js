// js/onthisday.js - Wikipedia "Tarihte Bugün" API İşleyici (Hata Düzeltmeli)

document.addEventListener("DOMContentLoaded", function () {
  // DOM (HTML) yüklendiğinde verileri çek
  getOnThisDayData();
});

/**
 * Wikimedia API'sinden "Tarihte Bugün" verilerini çeker.
 */
async function getOnThisDayData() {
  const resultsContainer = document.getElementById(
    "onthisday-results-container"
  );
  const dateDisplay = document.getElementById("onthisday-date");

  // Yükleniyor... mesajı
  if (resultsContainer) {
    resultsContainer.innerHTML =
      '<p class="text-center text-muted">Tarih verileri yükleniyor...</p>';
  }

  // 1. Bugünün tarihini al (Örn: 10. ay, 23. gün)
  const today = new Date();
  const month = today.getMonth() + 1; // getMonth() 0-11 arasıdır
  const day = today.getDate();

  // 2. Tarihi başlıkta göster (Örn: 23 Ekim)
  if (dateDisplay) {
    const monthName = getMonthNameTR(month);
    dateDisplay.textContent = `${day} ${monthName} Tarihinde Yaşananlar`;
  }

  // 3. API Adresi (Türkçe Wikipedia, tüm olaylar, güncel ay/gün)
  const API_URL = `https://api.wikimedia.org/feed/v1/wikipedia/tr/onthisday/all/${month}/${day}`;

  try {
    // 4. API'ye istek at
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(
        "Wikimedia API verisi alınamadı. Ağ bağlantınızı kontrol edin."
      );
    }

    const data = await response.json();

    // 5. Gelen veriyi HTML'e dönüştür
    displayEvents(data, resultsContainer);
  } catch (error) {
    // 6. Hata yönetimi
    console.error("Tarihte Bugün hatası:", error);
    if (resultsContainer) {
      resultsContainer.innerHTML = `<div class="alert alert-warning">Veriler yüklenirken bir hata oluştu: ${error.message}</div>`;
    }
  }
}

/**
 * GÜNCELLENMİŞ FONKSİYON:
 * Gelen veriyi işler ve şık timeline HTML'ine dönüştürür.
 * @param {object} data - Wikimedia API'sinden gelen JSON verisi
 * @param {HTMLElement} container - Sonuçların ekleneceği HTML elementi
 */
function displayEvents(data, container) {
  container.innerHTML = ""; // Yükleniyor... mesajını temizle

  // Biz sadece "Olaylar" (events) kısmını alacağız.
  const events = data.events;

  if (!events || events.length === 0) {
    container.innerHTML =
      '<p class="text-center text-muted">Bugün için listelenecek önemli bir olay bulunamadı.</p>';
    return;
  }

  // Olayları CSS'teki timeline yapısına göre formatla
  events.forEach((event) => {
    let wikiLinkHTML = ""; // Link için boş bir değişken tanımla

    // --- HATA DÜZELTMESİ BURADA ---
    // Sadece event.pages dizisi varsa VE içi doluysa link oluştur
    if (event.pages && event.pages.length > 0) {
      // Güvenle [0] indeksine eriş
      const wikiPage = event.pages[0];
      const wikiLink = wikiPage.content_urls.desktop.page;
      const wikiTitle = wikiPage.title; // Örn: "Birleşmiş Milletler"

      // Link HTML'ini doldur
      wikiLinkHTML = `
                <a href="${wikiLink}" target="_blank" class="text-decoration-none small">
                    ${wikiTitle} (Devamını Oku) 
                    <i class="bi bi-box-arrow-up-right ms-1"></i>
                </a>
            `;
    }
    // Eğer 'if' bloğu çalışmazsa, 'wikiLinkHTML' boş kalır ve link eklenmez.
    // --- DÜZELTME SONU ---

    const itemHTML = `
            <div class="timeline-item">
                <div class="timeline-year">${event.year}</div>
                <div class="timeline-content">
                    <p>${event.text}</p>
                    ${wikiLinkHTML} 
                </div>
            </div>
        `;

    container.innerHTML += itemHTML;
  });
}

/**
 * Ay indeksini (1-12) Türkçe ay adına dönüştürür.
 * @param {number} monthIndex - (1 = Ocak, 12 = Aralık)
 * @returns {string} - Türkçe Ay Adı
 */
function getMonthNameTR(monthIndex) {
  const months = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];
  return months[monthIndex - 1]; // Dizi 0'dan başladığı için -1
}
