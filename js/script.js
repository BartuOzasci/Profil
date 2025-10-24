// script.js - Özel JavaScript Dosyası

/*
 * Bootstrap'in kendi JavaScript'i (HTML'ye eklenen bundle dosyası),
 * mobil menünün (toggler) açılıp kapanmasını zaten otomatik olarak yönetir.
 * Biz buraya ekstra, modern fonksiyonlar ekliyoruz.
 */

// DOM yüklendiğinde çalışacak kod
document.addEventListener("DOMContentLoaded", function () {
  // Header (navbar) elementini seç
  const navbar = document.querySelector(".custom-navbar");

  // Sayfa kaydırma (scroll) olayını dinle
  window.addEventListener("scroll", function () {
    // Eğer sayfa dikey olarak 50 pikselden fazla kaydırılmışsa
    if (window.scrollY > 50) {
      // Header'a 'scrolled' sınıfını ekle
      // (Bu sınıf, CSS'de arka planı opak yapar)
      navbar.classList.add("scrolled");
    } else {
      // Sayfa en üstteyse 'scrolled' sınıfını kaldır
      // (Header tekrar yarı şeffaf olur)
      navbar.classList.remove("scrolled");
    }
  });
});
