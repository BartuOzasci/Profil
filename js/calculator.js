// js/calculator.js - Yatırım Hesaplama Mantığı

document.addEventListener("DOMContentLoaded", function () {
  // --- Element Referansları ---
  const initialDepositInput = document.getElementById("initialDeposit");
  const frequencyRadios = document.querySelectorAll(
    'input[name="contributionFrequency"]'
  );
  const contributionAmountInput = document.getElementById("contributionAmount");
  const contributionLabel = document.getElementById("contributionLabel");
  const annualRateInput = document.getElementById("annualRate");
  const rateValueSpan = document.getElementById("rateValue");
  const investmentMonthsInput = document.getElementById("investmentMonths");
  const calculateBtn = document.getElementById("calculateBtn");
  const resultsArea = document.getElementById("resultsArea");
  const resultMonthsSpan = document.getElementById("resultMonths");
  const resultAmountDiv = document.getElementById("resultAmount");
  const chartCanvas = document.getElementById("growthChart");
  const moneyAnimationContainer = document.getElementById("moneyAnimation");

  let growthChart = null; // Grafik örneğini tutmak için

  // --- Yardımcı Fonksiyonlar ---
  const currencyFormatter = new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  });

  // --- Olay Dinleyicileri ---
  frequencyRadios.forEach((radio) => {
    radio.addEventListener("change", updateContributionLabel);
  });
  annualRateInput.addEventListener("input", () => {
    rateValueSpan.textContent = `${annualRateInput.value}%`;
  });
  calculateBtn.addEventListener("click", handleCalculation);

  // --- Fonksiyonlar ---
  function updateContributionLabel() {
    const selectedFrequency = document.querySelector(
      'input[name="contributionFrequency"]:checked'
    ).value;
    switch (selectedFrequency) {
      case "weekly":
        contributionLabel.textContent = "Haftalık Yatırım Miktarınız (₺)";
        break;
      case "yearly":
        contributionLabel.textContent = "Yıllık Yatırım Miktarınız (₺)";
        break;
      default: // monthly
        contributionLabel.textContent = "Aylık Yatırım Miktarınız (₺)";
        break;
    }
  }

  function handleCalculation() {
    const initialDeposit = parseFloat(initialDepositInput.value) || 0;
    const contributionAmount = parseFloat(contributionAmountInput.value) || 0;
    const annualRate = parseFloat(annualRateInput.value) || 0;
    const investmentMonths = parseInt(investmentMonthsInput.value) || 0;
    const selectedFrequency = document.querySelector(
      'input[name="contributionFrequency"]:checked'
    ).value;

    if (investmentMonths <= 0) {
      alert("Lütfen geçerli bir yatırım süresi (ay) girin.");
      return;
    }

    const { finalBalance, growthData } = calculateInvestment(
      initialDeposit,
      contributionAmount,
      selectedFrequency,
      annualRate,
      investmentMonths
    );

    displayResults(finalBalance, growthData, investmentMonths);
    startMoneyAnimation();
  }

  function calculateInvestment(initial, contribution, frequency, rate, months) {
    let currentBalance = initial;
    const monthlyRate = rate / 100 / 12;
    const growthData = [{ month: 0, balance: currentBalance }];

    let monthlyContribution = 0;
    if (frequency === "monthly") {
      monthlyContribution = contribution;
    } else if (frequency === "weekly") {
      monthlyContribution = contribution * (52 / 12);
    } else if (frequency === "yearly") {
      monthlyContribution = contribution / 12;
    }

    for (let month = 1; month <= months; month++) {
      const interestEarned = currentBalance * monthlyRate;
      currentBalance += interestEarned;
      currentBalance += monthlyContribution;
      growthData.push({ month: month, balance: currentBalance });
    }

    return { finalBalance: currentBalance, growthData: growthData };
  }

  function displayResults(finalBalance, growthData, months) {
    resultMonthsSpan.textContent = months;
    resultAmountDiv.textContent = currencyFormatter.format(finalBalance);
    resultsArea.style.display = "block";
    createOrUpdateChart(growthData);
    resultsArea.scrollIntoView({ behavior: "smooth" });
  }

  function createOrUpdateChart(growthData) {
    const labels = growthData.map((data) => data.month);
    const dataPoints = growthData.map((data) => data.balance.toFixed(2));

    if (growthChart) {
      growthChart.destroy();
    }

    const ctx = chartCanvas.getContext("2d");
    growthChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Birikim Büyümesi (₺)",
            data: dataPoints,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
            fill: true,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          x: {
            title: { display: true, text: "Ay" },
          },
          y: {
            title: { display: true, text: "Bakiye (₺)" },
            ticks: {
              callback: function (value) {
                return currencyFormatter.format(value).replace(/\s*₺\s*/, ""); // Para birimi olmadan
              },
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || "";
                if (label) label += ": ";
                if (context.parsed.y !== null)
                  label += currencyFormatter.format(context.parsed.y);
                return label;
              },
            },
          },
        },
      },
    });
  }

  function startMoneyAnimation() {
    moneyAnimationContainer.innerHTML = "";
    moneyAnimationContainer.style.display = "block";
    const numberOfIcons = 50;

    for (let i = 0; i < numberOfIcons; i++) {
      const moneyIcon = document.createElement("i");
      moneyIcon.classList.add("bi", "bi-currency-dollar", "money-icon");
      moneyIcon.style.left = `${Math.random() * 100}vw`;
      moneyIcon.style.fontSize = `${Math.random() * 1 + 0.8}rem`;
      const duration = Math.random() * 3 + 2;
      const delay = Math.random() * 2;
      moneyIcon.style.animationDuration = `${duration}s`;
      moneyIcon.style.animationDelay = `${delay}s`;
      moneyAnimationContainer.appendChild(moneyIcon);
    }

    setTimeout(() => {
      moneyAnimationContainer.style.display = "none";
      moneyAnimationContainer.innerHTML = "";
    }, 5500);
  }

  // --- Başlangıç Ayarları ---
  updateContributionLabel();
  rateValueSpan.textContent = `${annualRateInput.value}%`;
}); // DOMContentLoaded end
