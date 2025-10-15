document.addEventListener("DOMContentLoaded", () =>{
    const sidebarContainer = document.getElementById("sidebar-container");

    fetch("../components/sidebar.html")
    .then(response => response.text())
    .then(html =>{
        sidebarContainer.innerHTML = html;
    })
    
    .catch(err => console.error("Error el cargar el sidebar:",err))
});

// src/js/dashboard.js
document.addEventListener("DOMContentLoaded", () => {
  const ctxLine = document.getElementById("chart-line");
  const ctxPie = document.getElementById("chart-pie");

  // === Gráfico de línea ===
  new Chart(ctxLine, {
    type: "line",
    data: {
      labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
      datasets: [{
        label: "Ahorro Mensual",
        data: [400, 600, 1000, 1300, 1600, 1800],
        borderColor: "#0044cc",
        backgroundColor: "rgba(0, 68, 204, 0.15)",
        borderWidth: 2,
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });

  // === Gráfico de pastel ===
  new Chart(ctxPie, {
    type: "doughnut",
    data: {
      labels: ["Vivienda", "Comida", "Transporte", "Ocio"],
      datasets: [{
        data: [35, 30, 20, 15],
        backgroundColor: ["#4e79a7", "#f28e2b", "#e15759", "#76b7b2"]
      }]
    },
    options: { plugins: { legend: { position: "bottom" } } }
  });
});
