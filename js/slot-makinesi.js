// js/slot-makinesi.js - Slot Makinesi Oyunu Mantığı

document.addEventListener("DOMContentLoaded", () => {
  // --- Element Referansları ---
  const reels = [
    document.querySelector("#reel1 .reel-symbols"),
    document.querySelector("#reel2 .reel-symbols"),
    document.querySelector("#reel3 .reel-symbols"),
  ];
  const spinButton = document.getElementById("spin-button");
  const resultMessageSlot = document.getElementById("result-message-slot");

  // --- Oyun Ayarları ---
  const symbols = ["🍒", "🍋", "🍊", "🍉", "⭐", "💎"]; // Kullanılacak semboller
  const spinDurationBase = 1000; // Temel dönme süresi (ms)
  const spinVariation = 500; // Makaralar arası maksimum süre farkı (ms)
  const symbolsPerReelVisually = 30; // Animasyon için makara başına sembol sayısı
  const symbolHeight = 100; // CSS'teki .reel-symbol yüksekliği (px)

  let isSpinning = false; // Aynı anda birden fazla spin engelleme

  // --- Fonksiyonlar ---

  // Makaraları başlangıç sembolleriyle doldur
  function setupReels() {
    reels.forEach((reelContainer) => {
      reelContainer.innerHTML = ""; // Temizle
      // Başlangıçta rastgele ama farklı semboller gösterilebilir
      const initialSymbol = getRandomSymbol();
      const symbolElement = document.createElement("div");
      symbolElement.classList.add("reel-symbol");
      symbolElement.textContent = initialSymbol;
      reelContainer.appendChild(symbolElement);
    });
    resultMessageSlot.textContent = ""; // Başlangıç mesajını temizle
    resultMessageSlot.className = "result-message-slot lead fw-bold mt-4"; // Sınıfları sıfırla
  }

  // Rastgele bir sembol seç
  function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
  }

  // Ana Spin Fonksiyonu
  async function spin() {
    if (isSpinning) return; // Zaten dönüyorsa tekrar başlatma
    isSpinning = true;
    spinButton.disabled = true;
    resultMessageSlot.textContent = "Dönüyor...";
    resultMessageSlot.className =
      "result-message-slot lead fw-bold mt-4 text-muted"; // Sınıfları sıfırla

    // Sonuçları önceden belirle
    const finalResults = reels.map(() => getRandomSymbol());

    // Her makara için animasyon promise'leri oluştur
    const spinPromises = reels.map((reelContainer, index) => {
      return new Promise((resolve) => {
        // 1. Makara içeriğini oluştur (çok sayıda rastgele + en sonda final sembol)
        reelContainer.innerHTML = ""; // Önceki sembolleri temizle
        const fragment = document.createDocumentFragment(); // Performans için fragment kullan
        for (let i = 0; i < symbolsPerReelVisually; i++) {
          const symbolElement = document.createElement("div");
          symbolElement.classList.add("reel-symbol");
          symbolElement.textContent = getRandomSymbol();
          fragment.appendChild(symbolElement);
        }
        // Sonucu en sona ekle
        const finalSymbolElement = document.createElement("div");
        finalSymbolElement.classList.add("reel-symbol");
        finalSymbolElement.textContent = finalResults[index];
        fragment.appendChild(finalSymbolElement);
        reelContainer.appendChild(fragment);

        // 2. Başlangıç pozisyonunu ayarla (çok yukarıda)
        // translate'i sıfırlamak yerine direkt hedefe gitmesi için
        reelContainer.style.transition = "none"; // Geçişi geçici kaldır
        reelContainer.style.transform = `translateY(0)`; // Başlangıçta en üstte

        // 3. Dönme animasyonunu başlat (CSS transition ile)
        // Force reflow before starting transition
        reelContainer.offsetHeight; // Tarayıcıyı güncellemeyi zorla

        reelContainer.style.transition = `transform ${
          spinDurationBase / 1000 + (Math.random() * spinVariation) / 1000
        }s cubic-bezier(.42,0,.58,1)`; // CSS transition süresi

        // Hedef Y pozisyonu: Son sembolün görünmesi için
        const targetY = -(reelContainer.scrollHeight - symbolHeight);
        reelContainer.style.transform = `translateY(${targetY}px)`;

        // 4. Transition bittiğinde resolve et
        reelContainer.addEventListener(
          "transitionend",
          () => resolve(finalResults[index]),
          { once: true }
        );
      });
    });

    // Tüm makaraların durmasını bekle
    const finalSymbolsInView = await Promise.all(spinPromises);

    // Sonucu kontrol et
    checkWin(finalSymbolsInView);

    isSpinning = false;
    spinButton.disabled = false;
  }

  // Kazanma Durumunu Kontrol Et
  function checkWin(results) {
    // results = ['🍒', '🍋', '🍒'] gibi
    if (results[0] === results[1] && results[1] === results[2]) {
      resultMessageSlot.textContent = `🎉 Kazandın! 🎉 (${results[0]}${results[1]}${results[2]})`;
      resultMessageSlot.classList.add("win");
    } else {
      resultMessageSlot.textContent = "Tekrar Dene!";
      resultMessageSlot.classList.add("lose");
    }
  }

  // --- Olay Dinleyicileri ---
  spinButton.addEventListener("click", spin);

  // --- Başlangıç ---
  setupReels(); // Sayfa yüklendiğinde makaraları ayarla
}); // DOMContentLoaded end
