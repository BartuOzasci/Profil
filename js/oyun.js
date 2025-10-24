// js/oyun.js - Kart Eşleştirme Oyunu Mantığı

document.addEventListener("DOMContentLoaded", () => {
  const gameBoard = document.getElementById("game-board");
  const movesCountSpan = document.getElementById("moves-count");
  const resetButton = document.getElementById("reset-button");

  // Kullanılacak ikonlar (Bootstrap Icons sınıf adları) - 18 adet olmalı
  const icons = [
    "bi-heart-fill",
    "bi-star-fill",
    "bi-bell-fill",
    "bi-gear-fill",
    "bi-bookmark-fill",
    "bi-briefcase-fill",
    "bi-camera-fill",
    "bi-chat-fill",
    "bi-cloud-fill",
    "bi-cup-fill",
    "bi-emoji-smile-fill",
    "bi-flag-fill",
    "bi-key-fill",
    "bi-lightbulb-fill",
    "bi-lock-fill",
    "bi-map-fill",
    "bi-music-note-beamed",
    "bi-shield-fill",
  ];

  let cardsArray = []; // Karıştırılmış ikon çiftlerini tutar
  let flippedCards = []; // Geçici olarak dönen 2 kartı tutar [element, element]
  let matchedPairs = 0; // Bulunan çift sayısı
  let moves = 0; // Hamle sayısı
  let lockBoard = false; // Eşleşme kontrolü sırasında tahtayı kilitlemek için

  // --- Oyun Fonksiyonları ---

  // 1. İkon Çiftlerini Oluştur ve Karıştır
  function createShuffledCards() {
    cardsArray = [...icons, ...icons]; // İkonları ikişerli hale getir (36 kart)
    // Fisher-Yates (Knuth) Shuffle algoritması
    for (let i = cardsArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardsArray[i], cardsArray[j]] = [cardsArray[j], cardsArray[i]];
    }
  }

  // 2. Oyun Tahtasını HTML Olarak Oluştur
  function createBoard() {
    gameBoard.innerHTML = ""; // Önceki tahtayı temizle
    createShuffledCards(); // Kartları karıştır

    cardsArray.forEach((iconClass, index) => {
      const cardElement = document.createElement("div");
      // Bootstrap sütun yapısı (6x6 grid için col-2)
      cardElement.classList.add("col-2", "game-card-col");

      // data-icon özelliği eşleşme kontrolünde kullanılacak
      cardElement.innerHTML = `
                <div class="game-card" data-icon="${iconClass}">
                    <div class="card-inner">
                        <div class="card-face card-back">
                            <i class="bi bi-question-lg"></i> </div>
                        <div class="card-face card-front">
                            <i class="${iconClass}"></i> </div>
                    </div>
                </div>
            `;
      // Her karta tıklama olayı ekle
      cardElement
        .querySelector(".game-card")
        .addEventListener("click", flipCard);
      gameBoard.appendChild(cardElement);
    });
  }

  // 3. Kart Çevirme Mantığı
  function flipCard() {
    // Tahta kilitliyse, kart zaten dönükse veya eşleşmişse bir şey yapma
    if (
      lockBoard ||
      this.classList.contains("flipped") ||
      this.classList.contains("matched")
    ) {
      return;
    }

    this.classList.add("flipped"); // Kartı CSS ile döndür
    flippedCards.push(this); // Dönen kartı listeye ekle

    // İki kart döndüyse
    if (flippedCards.length === 2) {
      incrementMoves(); // Hamle sayısını artır
      lockBoard = true; // Yeni kart tıklamalarını engelle
      checkForMatch(); // Eşleşmeyi kontrol et
    }
  }

  // 4. Eşleşme Kontrolü
  function checkForMatch() {
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.icon === card2.dataset.icon;

    if (isMatch) {
      disableCards();
    } else {
      unflipCards();
    }
  }

  // 5. Eşleşen Kartları Devre Dışı Bırak
  function disableCards() {
    flippedCards.forEach((card) => {
      card.classList.add("matched"); // Eşleşti olarak işaretle
      // Olay dinleyiciyi kaldırmaya gerek yok, flipCard içinde kontrol ediliyor
    });
    matchedPairs++; // Bulunan çift sayısını artır
    resetTurn(); // Sırayı sıfırla

    // Oyun Bitti mi?
    if (matchedPairs === icons.length) {
      // 18 çifte ulaşıldıysa
      setTimeout(() => {
        alert(`Tebrikler! Oyunu ${moves} hamlede bitirdin!`);
      }, 500); // Küçük bir gecikme sonrası mesaj
    }
  }

  // 6. Eşleşmeyen Kartları Geri Çevir
  function unflipCards() {
    // Kartların görünmesi için kısa bir süre bekle (1 saniye)
    setTimeout(() => {
      flippedCards.forEach((card) => card.classList.remove("flipped"));
      resetTurn(); // Sırayı sıfırla
    }, 1000);
  }

  // 7. Sırayı Sıfırla (flippedCards listesini boşalt, kilidi kaldır)
  function resetTurn() {
    flippedCards = [];
    lockBoard = false;
  }

  // 8. Hamle Sayısını Artır ve Göster
  function incrementMoves() {
    moves++;
    movesCountSpan.textContent = moves;
  }

  // 9. Oyunu Sıfırla
  function resetGame() {
    // Tüm durum değişkenlerini sıfırla
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    lockBoard = false;
    movesCountSpan.textContent = moves;

    // Tahtayı yeniden oluştur (kartları karıştırıp ekler)
    createBoard();
  }

  // --- Oyun Başlangıcı ---
  resetButton.addEventListener("click", resetGame); // Reset butonuna olay ekle
  createBoard(); // İlk tahtayı oluştur
}); // DOMContentLoaded end
