// js/kart-oyunu.js - Futbolcu Kart Oyunu Mantığı (Numaralandırma Eklendi)

document.addEventListener("DOMContentLoaded", () => {
  const dealButton = document.getElementById("deal-button");
  const cardDisplayArea = document.getElementById("card-display-area");

  // --- Dosya Yolu ve API Bilgileri ---
  // !!! GÜVENLİK RİSKİ! BU ANAHTARINIZ HERKESE AÇIK OLACAKTIR!
  const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE";
  const GEMINI_API_ENDPOINT =
    "https://varsayimsal-gemini-image-api.googleapis.com/v1/generateImage";

  const PLAYER_LIST_URL = "../txts/footballer.txt";

  const CARDS_TO_DEAL = 8;
  const GOLD_CARDS_COUNT = 3;

  // Yerel Placeholder resim yolu
  const PLACEHOLDER_IMAGE_URL = "../img/oyuncuKart.104Z.png";

  // GÜNCEL LİSTE (Test için hardcoded)
  let allPlayerNames = [
    "Lionel Messi",
    "Cristiano Ronaldo",
    "Kylian Mbappé",
    "Robert Lewandowski",
    "Mohamed Salah",
    "Virgil van Dijk",
    "Kevin De Bruyne",
    "Luka Modrić",
    "Neymar Jr.",
    "Erling Haaland",
    "Harry Kane",
    "Son Heung-min",
  ];

  // --- Olay Dinleyicisi ---
  dealButton.addEventListener("click", dealCards);

  // --- Fonksiyonlar ---

  // 1. Asenkron: Futbolcu listesini txt dosyasından yükle (Hardcode listenin yerine geçecektir)
  async function loadPlayerNamesFromTxt() {
    if (allPlayerNames.length > 12) return true; // Hardcoded liste zaten varsa, txt'yi atla
    try {
      const response = await fetch(PLAYER_LIST_URL);
      if (!response.ok)
        throw new Error(
          `Dosya bulunamadı veya ağ hatası! (${response.status})`
        );
      const text = await response.text();
      allPlayerNames = text
        .split("\n")
        .map((name) => name.trim())
        .filter((name) => name.length > 0);
      console.log(
        `TXT dosyasından ${allPlayerNames.length} futbolcu ismi yüklendi.`
      );
      return true;
    } catch (error) {
      console.warn(
        "TXT dosyası yüklenemedi. Hardcoded liste kullanılıyor.",
        error
      );
      return false; // Hata durumunda hardcoded liste kullanılmaya devam eder
    }
  }

  // 2. Asenkron: Gemini API'den (varsayımsal) resim al
  async function getPlayerImage(playerName) {
    // Bu kodun CORS hatası vermesi BÜYÜK OLASILIKLA BEKLENMEKTEDİR.

    try {
      // Sadece test amaçlı buraya bir API isteği atılıyor (GÜVENSİZ)
      const response = await fetch(GEMINI_API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          prompt: `${playerName}, professional football player, photorealistic portrait, high quality`,
          size: "300x400",
        }),
      });

      if (!response.ok) throw new Error(`API HTTP hatası: ${response.status}`);

      const data = await response.json();
      if (data && data.imageUrl) return data.imageUrl;

      console.warn("API cevabında resim URL'si bulunamadı.");
      return PLACEHOLDER_IMAGE_URL;
    } catch (error) {
      console.error(`API Çağrısı Hata Kodu (${playerName}):`, error);
      return PLACEHOLDER_IMAGE_URL;
    }
  }

  // 3. Asenkron: Kartları Dağıt
  async function dealCards() {
    dealButton.disabled = true;
    cardDisplayArea.innerHTML =
      '<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Yükleniyor...</span></div><p>Kartlar hazırlanıyor...</p></div>';

    // TXT dosyasını yüklemeyi dene
    await loadPlayerNamesFromTxt();

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
        const imageUrl = imageUrls[index];
        const cardNumber = index + 1; // 1'den 8'e kadar numara

        const cardCol = document.createElement("div");
        cardCol.classList.add("col");

        // KART HTML'İNE KÖŞE ETİKETİ EKLENDİ
        cardCol.innerHTML = `
                    <div class="football-card ${borderClass}">
                        <div class="card-corner-badge">
                            <span>#${cardNumber}</span>
                        </div>
                        <img src="${imageUrl}" class="card-img-top" alt="${playerName}" onerror="this.onerror=null; this.src='${PLACEHOLDER_IMAGE_URL}';">
                        <div class="card-body">
                            <h5 class="card-title text-center">${playerName}</h5>
                        </div>
                    </div>
                `;
        cardDisplayArea.appendChild(cardCol);
      });
    } catch (error) {
      console.error("Kart Oluşturma Hata:", error);
      cardDisplayArea.innerHTML =
        '<p class="text-danger text-center col-12">Hata: Kartlar oluşturulamadı. Konsolu kontrol edin (CORS/API).</p>';
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
  // loadPlayerNamesFromTxt() zaten bir kere çağrıldı.
}); // DOMContentLoaded end
