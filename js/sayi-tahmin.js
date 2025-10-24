// js/sayi-tahmin.js - Sayı Tahmin Oyunu Mantığı

document.addEventListener("DOMContentLoaded", () => {
  // --- Element Referansları ---
  const guessInput = document.getElementById("guessInput");
  const guessButton = document.getElementById("guessButton");
  const feedbackMessage = document.getElementById("feedbackMessage");
  const guessesListDiv = document.getElementById("guessesList"); // Önceki tahminler
  const resetGameButton = document.getElementById("resetGameButton");
  const winAnimationDiv = document.getElementById("winAnimation");
  const winMessage = document.getElementById("winMessage");

  // --- Oyun Değişkenleri ---
  const MIN_NUMBER = 1;
  const MAX_NUMBER = 1000;
  let targetNumber;
  let guessCount;
  let previousGuesses;
  let gameOver;

  // --- Oyun Fonksiyonları ---

  // Oyunu Başlat/Sıfırla
  function initializeGame() {
    targetNumber =
      Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER;
    guessCount = 0;
    previousGuesses = [];
    gameOver = false;

    guessInput.value = "";
    feedbackMessage.textContent = "Tahminini bekliyorum...";
    feedbackMessage.className = "feedback-message lead fw-bold my-4 text-muted"; // Reset classes
    guessesListDiv.innerHTML = ""; // Önceki tahminleri temizle
    guessInput.disabled = false;
    guessButton.disabled = false;
    resetGameButton.style.display = "none"; // Reset butonunu gizle
    winAnimationDiv.style.display = "none"; // Animasyonu gizle
    winAnimationDiv.classList.remove("show-win");

    console.log("Yeni oyun başladı. Hedef sayı:", targetNumber); // Test için
    guessInput.focus(); // Input'a odaklan
  }

  // Tahmini İşle
  function handleGuess() {
    if (gameOver) return; // Oyun bittiyse işlem yapma

    const userGuess = parseInt(guessInput.value);

    // --- Giriş Doğrulama ---
    if (isNaN(userGuess) || userGuess < MIN_NUMBER || userGuess > MAX_NUMBER) {
      setFeedback(
        `Lütfen ${MIN_NUMBER} ile ${MAX_NUMBER} arasında bir sayı girin!`,
        "warning"
      );
      guessInput.value = ""; // Hatalı girişi temizle
      return;
    }

    // --- Tahmin Geçerli ---
    guessCount++;
    previousGuesses.push(userGuess);
    updateGuessesList(); // Önceki tahminler listesini güncelle

    // --- Karşılaştırma ---
    if (userGuess === targetNumber) {
      // Bildi!
      gameOver = true;
      setFeedback(
        `🎉 Tebrikler! ${targetNumber} sayısını ${guessCount} hamlede buldun! 🎉`,
        "success"
      );
      guessInput.disabled = true;
      guessButton.disabled = true;
      resetGameButton.style.display = "inline-block"; // Reset butonunu göster
      showWinAnimation(`Tebrikler!\n${guessCount} Hamlede Bildin!`);
    } else if (userGuess < targetNumber) {
      // Daha Yüksek
      setFeedback("⬆️ Daha Yüksek!", "info");
    } else {
      // Daha Düşük
      setFeedback("⬇️ Daha Düşük!", "info");
    }

    guessInput.value = ""; // Tahmin sonrası input'u temizle
    guessInput.focus(); // Input'a tekrar odaklan
  }

  // Geri Bildirim Mesajını Ayarla
  function setFeedback(message, type = "muted") {
    feedbackMessage.textContent = message;
    // Önceki renk sınıflarını temizle, sonra yenisini ekle
    feedbackMessage.className = "feedback-message lead fw-bold my-4"; // Temel sınıflar
    switch (type) {
      case "success":
        feedbackMessage.classList.add("text-success");
        break;
      case "warning":
        feedbackMessage.classList.add("text-danger"); // Bootstrap'te warning sarı, danger kırmızı
        break;
      case "info":
        feedbackMessage.classList.add("text-primary"); // Bootstrap'te info mavi/turkuaz
        break;
      default:
        feedbackMessage.classList.add("text-muted");
        break;
    }
  }

  // Önceki Tahminler Listesini Güncelle
  function updateGuessesList() {
    guessesListDiv.innerHTML = previousGuesses
      .map((guess) => `<span>${guess}</span>`)
      .join(" ");
    // Scroll'u en sona kaydır (yeni tahmin görünsün)
    guessesListDiv.scrollTop = guessesListDiv.scrollHeight;
  }

  // Kazanma Animasyonunu Göster
  function showWinAnimation(message) {
    winMessage.innerHTML = message.replace("\n", "<br>"); // Mesajı ayarla (satır arası için <br>)
    winAnimationDiv.style.display = "flex"; // Flex ile ortalamayı sağlar
    // Kısa bir gecikme sonrası animasyon sınıfını ekle (geçiş için)
    setTimeout(() => {
      winAnimationDiv.classList.add("show-win");
    }, 50); // Çok kısa bir gecikme

    // (İsteğe bağlı) Animasyona tıklanınca veya bir süre sonra kapat
    // winAnimationDiv.addEventListener('click', () => {
    //     winAnimationDiv.classList.remove('show-win');
    //     setTimeout(() => { winAnimationDiv.style.display = 'none'; }, 500); // Geçiş bittikten sonra gizle
    // }, { once: true }); // Sadece bir kere çalışsın
  }

  // --- Olay Dinleyicileri ---
  guessButton.addEventListener("click", handleGuess);
  // Enter tuşuyla da tahmin yapabilme
  guessInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Formun gönderilmesini engelle (gerçi form yok ama yine de)
      handleGuess();
    }
  });
  resetGameButton.addEventListener("click", initializeGame);

  // --- Oyunu Başlat ---
  initializeGame();
}); // DOMContentLoaded end
