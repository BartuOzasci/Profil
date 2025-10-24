// js/logos.js - Kesintisiz Kayan Logo Animasyonu (Duraklamasız + Kopyalama)

document.addEventListener("DOMContentLoaded", function () {
  const logosSlide = document.getElementById("logos-slide");
  const scrollContainer = document.querySelector(".logos-scroll-container");

  if (!logosSlide || !scrollContainer) {
    console.error("Logo kaydırma için gerekli elementler bulunamadı.");
    return;
  }

  // --- Hızı Ayarlayın ---
  const scrollSpeed = 0.4; // Piksel/kare (1 = yavaş, 2 = orta, 3 = hızlı)
  // ----------------------

  let currentPosition = 0;
  let animationFrameId = null;
  let singleSetWidth = 0; // Orijinal setin genişliği
  const originalContent = logosSlide.innerHTML; // Orijinal logoları sakla

  // Hem başlangıçta hem de resize'da içeriği kopyalayıp genişliği hesaplayan fonksiyon
  function setupSlider() {
    // Animasyonu durdur (eğer çalışıyorsa)
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    // İçeriği orijinal haliyle sıfırla
    logosSlide.innerHTML = originalContent;
    logosSlide.style.transform = `translateX(0px)`; // Pozisyonu sıfırla

    // Orijinal setin genişliğini hesaplamak için kısa bir gecikme
    // Tarayıcının layout'u hesaplamasına izin ver
    requestAnimationFrame(() => {
      // getBoundingClientRect daha kesin sonuç verebilir
      singleSetWidth = logosSlide.getBoundingClientRect().width;

      // Genişlik geçerli bir değerse içeriği kopyala
      if (singleSetWidth > 0) {
        logosSlide.innerHTML += originalContent; // Kopyayı ekle
        console.log("Slider setup complete. Single set width:", singleSetWidth);
        currentPosition = 0; // Pozisyonu tekrar sıfırla
        startScrolling(); // Animasyonu başlat/devam ettir
      } else {
        console.error("Logo genişliği hesaplanamadı.");
        // Belki birkaç ms sonra tekrar dene?
        // setTimeout(setupSlider, 50);
      }
    });
  }

  // Animasyon döngüsü fonksiyonu
  function scrollStep() {
    currentPosition -= scrollSpeed;

    // Sıfırlama Koşulu: Orijinal set tamamen kaydığında
    // Eşitlik yerine küçük-eşit kullanmak daha güvenli olabilir
    if (currentPosition <= -singleSetWidth) {
      // Pozisyonu sıfırlarken kalan küçük farkı da ekle
      // Bu, atlama hissini azaltır
      currentPosition = currentPosition + singleSetWidth;
    }

    logosSlide.style.transform = `translateX(${currentPosition}px)`;
    animationFrameId = requestAnimationFrame(scrollStep);
  }

  // Animasyonu başlatan fonksiyon
  function startScrolling() {
    // Eğer zaten çalışıyorsa tekrar başlatma
    if (animationFrameId) return;

    // Genişlik hesaplanmamışsa, setupSlider onu başlatacak
    if (singleSetWidth <= 0) {
      console.warn("Width calculation pending, startScrolling will wait.");
      return;
    }

    console.log("Starting scroll animation...");
    animationFrameId = requestAnimationFrame(scrollStep);
  }

  // Pencere yeniden boyutlandırıldığında slider'ı yeniden kur
  let resizeTimer;
  window.addEventListener("resize", () => {
    // Yeniden boyutlandırma sırasında sürekli hesaplama yapmayı önle
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      console.log("Resizing detected, setting up slider again...");
      setupSlider(); // Setup'ı tekrar çağır, o da startScrolling'i çağıracak
    }, 250); // 250ms bekleme süresi
  });

  // Sayfa yüklendiğinde ilk kurulumu yap
  // window.onload kullanmak, resimlerin boyutlarının daha doğru hesaplanmasını sağlayabilir
  window.onload = () => {
    console.log("Window loaded, setting up slider...");
    setupSlider();
  };

  // Fallback: Eğer onload çok gecikirse DOMContentLoaded sonrası da dene
  setTimeout(() => {
    if (singleSetWidth <= 0) {
      // Eğer onload henüz tetiklenmediyse
      console.log(
        "Onload delayed, trying setup after DOMContentLoaded timeout..."
      );
      setupSlider();
    }
  }, 500); // Yarım saniye bekle
});
