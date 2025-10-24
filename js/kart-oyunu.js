// js/kart-oyunu.js - Futbolcu Kart Oyunu Mantığı (Yerel Placeholder ile)

document.addEventListener("DOMContentLoaded", () => {
  const dealButton = document.getElementById("deal-button");
  const cardDisplayArea = document.getElementById("card-display-area");

  // --- Dosya Yolu ve API Bilgileri ---
  const PLAYER_LIST_URL = "futbolcular.txt"; // txt dosyasının web sunucusundaki yolu!
  // !!! GÜVENLİK UYARISI: API ANAHTARINI BURAYA ASLA GÖMMEYİN! BU SADECE ÖRNEKTİR!
  const GEMINI_API_KEY = "AIzaSyCVznpC77RsF-tex7dPv5gAsB2nPfcxl5k"; // KENDİ ANAHTARINIZ (GÜVENSİZ YÖNTEM!)
  const GEMINI_API_ENDPOINT =
    "https://varsayimsal-gemini-image-api.googleapis.com/v1/generateImage";
  // ------------------------------------

  const CARDS_TO_DEAL = 8;
  const GOLD_CARDS_COUNT = 3;

  // GÜNCELLENDİ: Placeholder URL'yi yerel dosya yoluyla değiştirin
  // img klasörünüzde 'oyuncu-siluet.png' adında bir dosya olduğundan emin olun!
  const PLACEHOLDER_IMAGE_URL = "../img/oyuncuKart.104Z.png"; // Örnek yol, gerekirse değiştirin

  let allPlayerNames = []; // Tüm futbolcu listesini tutacak

  // --- Olay Dinleyicisi ---
  dealButton.addEventListener("click", dealCards);

  // --- Fonksiyonlar ---

  // 1. Asenkron: Futbolcu listesini txt dosyasından yükle
  async function loadPlayerNames() {
    if (allPlayerNames.length > 0) return true;
    try {
      const response = await fetch(PLAYER_LIST_URL);
      if (!response.ok)
        throw new Error(
          `HTTP hatası! Durum: ${response.status} (${PLAYER_LIST_URL})`
        );
      const text = await response.text();
      allPlayerNames = text
        .split("\n")
        .map((name) => name.trim())
        .filter((name) => name.length > 0);
      console.log(`${allPlayerNames.length} futbolcu ismi yüklendi.`);
      return true;
    } catch (error) {
      console.error("Futbolcu listesi yüklenirken hata:", error);
      cardDisplayArea.innerHTML = `<p class="text-danger text-center col-12">Hata: Futbolcu listesi (${PLAYER_LIST_URL}) yüklenemedi.</p>`;
      return false;
    }
  }

  // 2. Asenkron: Gemini API'den (varsayımsal) resim al
  async function getPlayerImage(playerName) {
    if (
      !GEMINI_API_KEY ||
      GEMINI_API_KEY === "AIzaSyCVznpC77RsF-tex7dPv5gAsB2nPfcxl5k"
    ) {
      // API anahtarı yoksa veya ayarlanmamışsa direkt placeholder döndür
      return PLACEHOLDER_IMAGE_URL;
    }

    try {
      console.log(`Resim isteniyor: ${playerName}`);
      const response = await fetch(GEMINI_API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GEMINI_API_KEY, // !!! GÜVENSİZ !!!
        },
        body: JSON.stringify({
          prompt: `${playerName}, professional football player, realistic portrait`,
          size: "300x400",
        }),
      });

      if (!response.ok) {
        let errorDetails = `HTTP hatası! Durum: ${response.status}`;
        try {
          const errorJson = await response.json();
          errorDetails += ` - ${
            errorJson.error?.message || response.statusText
          }`;
        } catch (e) {
          /* no-op */
        }
        throw new Error(errorDetails);
      }
      const data = await response.json();

      if (data && data.imageUrl) {
        console.log(`Resim alındı: ${playerName}`);
        return data.imageUrl;
      } else {
        console.warn(
          "API cevabında 'imageUrl' bulunamadı. Placeholder kullanılacak.",
          data
        );
        return PLACEHOLDER_IMAGE_URL;
      }
    } catch (error) {
      console.error(`Gemini API hatası (${playerName}):`, error);
      return PLACEHOLDER_IMAGE_URL; // Hata durumunda placeholder döndür
    }
  }

  // 3. Asenkron: Kartları Dağıt
  async function dealCards() {
    dealButton.disabled = true;
    cardDisplayArea.innerHTML =
      '<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Yükleniyor...</span></div><p>Kartlar hazırlanıyor...</p></div>';

    const namesLoaded = await loadPlayerNames();
    if (!namesLoaded) {
      dealButton.disabled = false;
      return;
    }
    if (allPlayerNames.length < CARDS_TO_DEAL) {
      cardDisplayArea.innerHTML =
        '<p class="text-danger text-center col-12">Hata: Yeterli futbolcu ismi yok!</p>';
      dealButton.disabled = false;
      return;
    }

    const selectedPlayers = getRandomPlayers(allPlayerNames, CARDS_TO_DEAL);
    let borderStyles = Array(GOLD_CARDS_COUNT)
      .fill("gold")
      .concat(Array(CARDS_TO_DEAL - GOLD_CARDS_COUNT).fill("white"));
    shuffleArray(borderStyles);

    const imagePromises = selectedPlayers.map((playerName) =>
      getPlayerImage(playerName)
    );

    try {
      const imageUrls = await Promise.all(imagePromises);
      cardDisplayArea.innerHTML = ""; // Temizle

      selectedPlayers.forEach((playerName, index) => {
        const borderClass =
          borderStyles[index] === "gold" ? "border-gold" : "border-white";
        const imageUrl = imageUrls[index]; // Gelen URL veya placeholder

        const cardCol = document.createElement("div");
        cardCol.classList.add("col");

        // onerror özelliği, src yüklenemezse PLACEHOLDER_IMAGE_URL'yi (artık yerel dosya) yükler.
        cardCol.innerHTML = `
                    <div class="football-card ${borderClass}">
                        <img src="${imageUrl}" class="card-img-top" alt="${playerName}" onerror="this.onerror=null; this.src='${PLACEHOLDER_IMAGE_URL}';">
                        <div class="card-body">
                            <h5 class="card-title text-center">${playerName}</h5>
                        </div>
                    </div>
                `;
        cardDisplayArea.appendChild(cardCol);
      });
    } catch (error) {
      console.error("Resimler alınırken genel bir hata oluştu:", error);
      cardDisplayArea.innerHTML =
        '<p class="text-danger text-center col-12">Hata: Resimler yüklenirken sorun oluştu.</p>';
    } finally {
      dealButton.disabled = false;
    }
  }

  // Yardımcı: Rastgele oyuncu seçer
  function getRandomPlayers(sourceArray, count) {
    const shuffled = [...sourceArray].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Yardımcı: Diziyi karıştırır
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // --- Başlangıç ---
  loadPlayerNames(); // Sayfa yüklenince listeyi yüklemeye başla
}); // DOMContentLoaded end
