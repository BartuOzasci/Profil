// js/katil-kim.js - Katil Kim Oyunu Mantığı

document.addEventListener("DOMContentLoaded", () => {
  // --- Element Referansları ---
  const storyTitle = document.getElementById("story-title");
  const storyScenario = document.getElementById("story-scenario");
  const cluesList = document.getElementById("clues-list");
  const clueCountSpan = document.getElementById("clue-count");
  const totalCluesSpan = document.getElementById("total-clues");
  const revealClueBtn = document.getElementById("reveal-clue-btn");
  const suspectsList = document.getElementById("suspects-list");
  const accuseBtn = document.getElementById("accuse-btn");
  const resultMessage = document.getElementById("result-message");
  const restartGameBtn = document.getElementById("restart-game-btn");
  const confettiContainer = document.getElementById("confetti-animation");

  // --- Oyun Verileri (HİKAYELERİ BURAYA EKLEYİN!) ---
  const stories = [
    // ÖRNEK HİKAYE 1
    {
      id: 1,
      title: "Kütüphanedeki Sır",
      scenario:
        "Şehrin eski kütüphanesinde, ünlü tarihçi Prof. Ahmet Çınar odasında ölü bulundu. Ölüm saati gece yarısı olarak belirlendi. Odada zorlama izi yok.",
      clues: [
        "Maktulün masasında yarısı içilmiş soğuk bir kahve bulundu.",
        "Odanın penceresi aralıktı ve dışarıda çamurlu ayak izleri vardı.",
        "Prof. Çınar'ın nadir bulunan bir el yazması üzerinde çalıştığı biliniyordu.",
        "Kütüphane görevlisi Ayşe, olay gecesi geç saatte şüpheli bir ses duyduğunu söyledi.",
        "Maktulün rakibi Dr. Veli'nin o gece kütüphanede görüldüğü rapor edildi.",
        "Ayak izleri Dr. Veli'nin ayakkabı numarasıyla uyuşmuyor.",
      ],
      suspects: [
        {
          name: "Ayşe Tekin",
          description: "Kütüphane görevlisi. Profesörle arası iyiydi.",
        },
        {
          name: "Dr. Veli Arslan",
          description: "Maktulün akademik rakibi. El yazmasını istiyordu.",
        },
        {
          name: "Elif Çınar",
          description: "Maktulün kızı. Babasıyla miras konusunda tartışmıştı.",
        },
        {
          name: "Kemal Ustaoğlu",
          description: "Koleksiyoncu. El yazmasına yüksek bir teklif yapmıştı.",
        },
      ],
      killer: "Kemal Ustaoğlu",
      motive:
        "Nadir el yazmasını çalmak için kütüphaneye gizlice girdi, profesör onu yakalayınca paniğe kapılıp öldürdü.",
    },
    // ÖRNEK HİKAYE 2
    {
      id: 2,
      title: "Tiyatro Cinayeti",
      scenario:
        "Ünlü aktris Leyla Yıldız, oyunun galasından sonra kendi kulisinde boğulmuş halde bulundu. Kapı içeriden kilitliydi.",
      clues: [
        "Maktulün elinde bir tiyatro broşürü sıkılı halde bulundu.",
        "Kuliste pahalı bir parfüm kokusu vardı, maktul bu parfümü kullanmazdı.",
        "Leyla Yıldız'ın başrolü genç oyuncu Efe'den kaptığı söyleniyordu.",
        "Yönetmen Hakan Bey, Leyla ile sık sık sanatsal konularda tartışırdı.",
        "Makyöz Sema, olaydan hemen önce Leyla'nın kulisine girdiğini itiraf etti.",
        "Broşürde Efe'nin parmak izleri bulundu, ancak yırtıktı.",
      ],
      suspects: [
        {
          name: "Efe Demir",
          description: "Genç ve hırslı oyuncu. Başrolü kaybetmişti.",
        },
        {
          name: "Hakan Öztürk",
          description: "Oyunun yönetmeni. Maktulle anlaşmazlıkları vardı.",
        },
        { name: "Sema Kaya", description: "Makyöz. Maktulü son gören kişi." },
        {
          name: "Can Tekin",
          description: "Maktulün eski eşi. Galaya davetsiz gelmişti.",
        },
      ],
      killer: "Sema Kaya",
      motive:
        "Leyla Yıldız, Sema'nın gizli bir ilişkisini öğrenmiş ve bunu açıklamakla tehdit etmişti. Kulisin gizli bir geçidini kullanarak cinayeti işledi ve kapıyı içeriden kilitledi.",
    },
    // ÖRNEK HİKAYE 3
    {
      id: 3,
      title: "Yazlık Evdeki Ölüm",
      scenario:
        "Zengin iş adamı Murat Bey, hafta sonu kaçamağı için gittiği göl kenarındaki yazlık evinde bıçaklanarak öldürülmüş. Ceset sabah bulundu.",
      clues: [
        "Evin arka kapısında zorlama izleri vardı.",
        "Salonda devrilmiş bir vazo ve su izleri bulundu.",
        "Murat Bey'in genç eşi Aslı, gece başka bir odada uyuduğunu iddia etti.",
        "Bahçıvan Ali, olaydan bir gün önce Murat Bey ile maaşı konusunda tartışmıştı.",
        "Murat Bey'in avukatı Zeynep Hanım, vasiyetini değiştirmek üzere olduğunu söyledi.",
        "Mutfak tezgahında Aslı'nın parmak izlerinin olduğu ıslak bir bıçak bulundu, ancak cinayet silahı değildi.",
        "Bahçıvan Ali'nin olay saatinde yakındaki bir barda olduğu tanıklarla doğrulandı.",
      ],
      suspects: [
        {
          name: "Aslı Demir",
          description: "Maktulün genç eşi. Mirastan büyük pay alacaktı.",
        },
        { name: "Ali Vural", description: "Bahçıvan. Maktulle tartışmıştı." },
        {
          name: "Zeynep Akın",
          description: "Maktulün avukatı. Vasiyet değişikliğinden haberdardı.",
        },
        {
          name: "Demir Soylu",
          description: "Maktulün eski ortağı. Büyük bir borcu vardı.",
        },
      ],
      killer: "Demir Soylu",
      motive:
        "Murat Bey'den borcunu silmesini istedi, reddedilince tartışma çıktı ve cinayeti işledi. Arka kapıdan girdi, vazoyu devirdi.",
    },
    // Hikaye 4 (Burayı doldurun)
    // { id: 4, title: "...", scenario: "...", clues: [...], suspects: [...], killer: "...", motive: "..." },
    // ...
    // Hikaye 20 (Burayı doldurun)
    // { id: 20, title: "...", scenario: "...", clues: [...], suspects: [...], killer: "...", motive: "..." },
  ];

  // --- Oyun Durum Değişkenleri ---
  let currentStory = null;
  let revealedCluesCount = 0;
  let selectedSuspect = null;
  let gameActive = false;
  const cluesNeededToAccuse = 3; // Suçlamak için gereken minimum ipucu sayısı

  // --- Oyun Fonksiyonları ---

  // Oyunu Başlat/Sıfırla
  function initGame() {
    gameActive = true;
    revealedCluesCount = 0;
    selectedSuspect = null;

    // Rastgele bir hikaye seç
    currentStory = stories[Math.floor(Math.random() * stories.length)];

    // Arayüzü güncelle
    storyTitle.textContent = currentStory.title;
    storyScenario.textContent = currentStory.scenario;

    // İpuçlarını ve Şüphelileri Temizle
    cluesList.innerHTML = "";
    suspectsList.innerHTML = "";
    resultMessage.textContent = "";
    resultMessage.className = "lead result-message mb-3"; // Reset class

    // İpucu Sayısını Ayarla
    totalCluesSpan.textContent = currentStory.clues.length;
    clueCountSpan.textContent = revealedCluesCount;

    // Şüphelileri Ekrana Ekle
    currentStory.suspects.forEach((suspect, index) => {
      const suspectId = `suspect-${index}`;
      const colDiv = document.createElement("div");
      colDiv.className = "col-md-6 mb-3";
      colDiv.innerHTML = `
                <div class="suspect-card form-check">
                    <input class="form-check-input suspect-radio" type="radio" name="suspect" id="${suspectId}" value="${suspect.name}">
                    <label class="form-check-label suspect-label" for="${suspectId}">
                        <strong class="suspect-name">${suspect.name}</strong>
                        <small class="suspect-desc d-block text-muted">${suspect.description}</small>
                    </label>
                </div>
            `;
      // Radio butonuna tıklama olayı ekle
      colDiv.querySelector(".suspect-radio").addEventListener("change", (e) => {
        selectedSuspect = e.target.value;
        // Yeterli ipucu varsa Suçla butonunu aktif et
        if (revealedCluesCount >= cluesNeededToAccuse) {
          accuseBtn.disabled = false;
        }
      });
      suspectsList.appendChild(colDiv);
    });

    // Butonları Ayarla
    revealClueBtn.disabled = false;
    accuseBtn.disabled = true; // Başlangıçta suçlama kapalı
    restartGameBtn.style.display = "none";

    // Konfeti animasyonunu gizle
    confettiContainer.style.display = "none";
    confettiContainer.innerHTML = "";
  }

  // Yeni İpucu Göster
  function revealClue() {
    if (!gameActive || revealedCluesCount >= currentStory.clues.length) {
      return; // Oyun bitmişse veya tüm ipuçları açıksa bir şey yapma
    }

    const clueText = currentStory.clues[revealedCluesCount];
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = clueText;
    cluesList.appendChild(li);

    // CSS animasyonunu tetiklemek için gecikme
    setTimeout(() => li.classList.add("revealed"), 10);

    revealedCluesCount++;
    clueCountSpan.textContent = revealedCluesCount;

    // Tüm ipuçları gösterildiyse butonu devre dışı bırak
    if (revealedCluesCount >= currentStory.clues.length) {
      revealClueBtn.disabled = true;
    }

    // Yeterli ipucu gösterildiyse ve bir şüpheli seçildiyse Suçla butonunu aktif et
    if (revealedCluesCount >= cluesNeededToAccuse && selectedSuspect) {
      accuseBtn.disabled = false;
    }
    // Yeterli ipucu gösterildi ama henüz şüpheli seçilmediyse de aktif edilebilir
    else if (revealedCluesCount >= cluesNeededToAccuse) {
      accuseBtn.disabled = false;
      // Eğer şüpheli seçilmeden basılırsa uyarı verilebilir (makeAccusation içinde)
    }
  }

  // Suçlama Yap
  function makeAccusation() {
    if (!gameActive || !selectedSuspect) {
      if (!selectedSuspect) alert("Lütfen önce bir şüpheli seçin!");
      return;
    }

    gameActive = false; // Oyunu durdur
    revealClueBtn.disabled = true;
    accuseBtn.disabled = true;
    // Tüm radio butonlarını devre dışı bırak
    document
      .querySelectorAll(".suspect-radio")
      .forEach((radio) => (radio.disabled = true));

    if (selectedSuspect === currentStory.killer) {
      // Doğru Bildi!
      resultMessage.textContent = `Doğru! Katil ${currentStory.killer}. Sebep: ${currentStory.motive}`;
      resultMessage.className = "lead result-message mb-3 text-success fw-bold";
      showConfettiAnimation(); // Animasyonu göster
    } else {
      // Yanlış Bildi!
      resultMessage.textContent = `Yanlış! Katil ${selectedSuspect} değildi. Doğru katil ${currentStory.killer}. Sebep: ${currentStory.motive}`;
      resultMessage.className = "lead result-message mb-3 text-danger fw-bold";
      // İsteğe bağlı: Yanlış bilince farklı bir animasyon veya efekt eklenebilir
    }

    restartGameBtn.style.display = "inline-block"; // Yeni oyun butonunu göster
  }

  // Konfeti Animasyonu
  function showConfettiAnimation() {
    confettiContainer.innerHTML = ""; // Önceki konfetileri temizle
    confettiContainer.style.display = "block";
    const colors = ["#f00", "#0f0", "#00f", "#ff0", "#f0f", "#0ff"]; // Farklı renkler
    const confettiCount = 100;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement("div");
      confetti.classList.add("confetti");
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      const duration = Math.random() * 3 + 2; // 2-5 saniye arası
      const delay = Math.random() * 1; // 0-1 saniye arası gecikme
      confetti.style.animationDuration = `${duration}s`;
      confetti.style.animationDelay = `${delay}s`;
      // Farklı dönüşler ve boyutlar (isteğe bağlı)
      confetti.style.width = `${Math.random() * 5 + 5}px`;
      confetti.style.height = `${Math.random() * 10 + 10}px`;
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

      confettiContainer.appendChild(confetti);
    }

    // Belirli bir süre sonra konfetileri temizle
    setTimeout(() => {
      confettiContainer.style.display = "none";
      confettiContainer.innerHTML = "";
    }, 5000); // 5 saniye sonra
  }

  // --- Olay Dinleyicileri ---
  revealClueBtn.addEventListener("click", revealClue);
  accuseBtn.addEventListener("click", makeAccusation);
  restartGameBtn.addEventListener("click", initGame);

  // --- Oyunu Başlat ---
  initGame();
}); // DOMContentLoaded end
