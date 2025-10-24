// js/weather.js - Hava Durumu API İşleyici

document.addEventListener("DOMContentLoaded", function () {
  const citySelect = document.getElementById("city-select");

  // Dropdown menüsünde bir değişiklik olduğunda
  if (citySelect) {
    citySelect.addEventListener("change", function () {
      const city = this.value;
      // API'den hava durumu verisini çek
      getWeather(city);
    });
  }
});

/**
 * OpenWeatherMap API'sinden hava durumu verilerini çeker.
 * @param {string} city - Seçilen il (Örn: "Istanbul")
 */
async function getWeather(city) {
  // -----------------------------------------------------------------
  // !!! API ANAHTARI GEREKLİ !!!
  // https://openweathermap.org/ adresinden ücretsiz kayıt olup
  // kendi API anahtarınızı alın ve '...ANAHTAR...' yazan yere yapıştırın.
  const API_KEY = "5231a2079ea778ae1d311b7cf2b03989";
  // -----------------------------------------------------------------

  // API Adresi (5 günlük / 3 saatlik tahmin, metrik birimler, Türkçe dil)
  const API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=tr`;

  const resultsContainer = document.getElementById("weather-results-container");
  resultsContainer.innerHTML =
    '<p class="text-center text-white-50">Hava durumu yükleniyor...</p>';

  try {
    // API'ye istek at
    const response = await fetch(API_URL);

    // Eğer istek başarısızsa (örn: API anahtarı yanlış veya şehir bulunamadı)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Hatası: ${errorData.message}`);
    }

    // Gelen JSON verisini işle
    const data = await response.json();
    // Veriyi HTML'e dönüştür
    displayWeather(data);
  } catch (error) {
    // Hata olursa kullanıcıya göster
    console.error("Hava durumu alınırken hata:", error);
    displayError(error.message);
  }
}

/**
 * API'den gelen veriyi işler ve HTML'e dönüştürür.
 * @param {object} data - OpenWeatherMap API'sinden gelen JSON verisi
 */
function displayWeather(data) {
  const resultsContainer = document.getElementById("weather-results-container");
  resultsContainer.innerHTML = ""; // Önceki sonuçları temizle

  // API 3 saatlik dilimler halinde veri verir.
  // İlk 8 dilimi (sonraki 24 saat) alıyoruz.
  const hourlyForecasts = data.list.slice(0, 8);

  hourlyForecasts.forEach((forecast) => {
    // Zamanı formatlama (Örn: 1678886400 -> "18:00")
    const dateTime = new Date(forecast.dt * 1000);
    const hour = dateTime.getHours().toString().padStart(2, "0");

    // Verileri alma
    const temp = Math.round(forecast.main.temp); // Sıcaklığı yuvarla
    const icon = forecast.weather[0].icon;
    const description = forecast.weather[0].description;

    // OpenWeatherMap ikon adresi
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    // CSS'te tasarladığımız .weather-card yapısını oluştur
    const cardHTML = `
            <div class="col-6 col-md-3 col-lg-3">
                <div class="weather-card">
                    <h5 class="saat">${hour}:00</h5>
                    <img src="${iconUrl}" alt="${description}">
                    <div class="temp">${temp}°C</div>
                    <p class="mb-0 small text-white-50 text-capitalize">${description}</p>
                </div>
            </div>
        `;
    // Oluşturulan kartı konteynere ekle
    resultsContainer.innerHTML += cardHTML;
  });
}

/**
 * API hatası durumunda kullanıcıyı bilgilendirir.
 * @param {string} message - Gösterilecek hata mesajı
 */
function displayError(message) {
  const resultsContainer = document.getElementById("weather-results-container");
  resultsContainer.innerHTML = `
        <div class="col-12">
            <div class="alert alert-danger" role="alert">
                <strong>Hata!</strong> ${message}
                <br>
                (API anahtarınızı kontrol ettiniz mi?)
            </div>
        </div>
    `;
}
