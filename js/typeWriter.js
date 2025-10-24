// typewriter.js - Özel Typewriter Efekti Dosyası

document.addEventListener("DOMContentLoaded", function () {
  const typewriterText = document.getElementById("typewriter-text");
  const words = ["Web Developer", "Civil Engineer", "AI & Data Engineer"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100; // Her karakter yazma hızı (ms)
  const deletingSpeed = 50; // Her karakter silme hızı (ms)
  const pauseTime = 1500; // Kelime yazıldıktan sonra bekleme süresi (ms)

  function typeWriterEffect() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      // Silme işlemi
      typewriterText.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Yazma işlemi
      typewriterText.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let currentSpeed = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentWord.length) {
      // Kelime tamamen yazıldı, silmeye başla
      currentSpeed = pauseTime; // Silmeden önce bekle
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Kelime tamamen silindi, bir sonraki kelimeye geç
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length; // Döngüsel olarak kelimeleri değiştir
      currentSpeed = typingSpeed; // Yeni kelimeyi yazma hızıyla başla
    }

    setTimeout(typeWriterEffect, currentSpeed);
  }

  // Efekti başlat
  if (typewriterText) {
    typeWriterEffect();
  }
});
