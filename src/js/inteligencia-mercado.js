document.addEventListener("DOMContentLoaded", () =>{
    const sidebarContainer = document.getElementById("sidebar-container");
fetch('../../components/sidebar_admin.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar-container').innerHTML = data;
        })
        .catch(error => console.error('Error al cargar el sidebar:', error));

});

// --- Mockup Extendido de Base de Datos ---
    const mockDatabase = {
        quito: {
            "18-25": {
                expenses: [35000, 28000, 22000, 18000, 15000],
                incomeSources: [600, 150, 50, 200], // Sueldo, Emprendimiento, Becas, Otros
                trends: { income: [800, 850, 900, 880, 920, 950], expenses: [700, 720, 750, 800, 780, 810] }
            },
            "26-35": {
                expenses: [42000, 31000, 25000, 20000, 17000],
                incomeSources: [1500, 400, 0, 300],
                trends: { income: [2200, 2250, 2300, 2350, 2400, 2450], expenses: [1800, 1900, 1850, 2000, 2100, 2050] }
            },
             "36-50": {
                expenses: [55000, 25000, 28000, 22000, 19000],
                incomeSources: [2500, 800, 0, 500],
                trends: { income: [3800, 3850, 3900, 4000, 4100, 4050], expenses: [3000, 3100, 3200, 3150, 3300, 3400] }
            }
        },
        guayaquil: {
            // ... (datos similares para Guayaquil)
             "18-25": {
                expenses: [38000, 26000, 24000, 20000, 13000],
                incomeSources: [650, 120, 80, 150],
                trends: { income: [850, 880, 910, 900, 940, 980], expenses: [750, 780, 790, 820, 800, 850] }
            },
            "26-35": {
                expenses: [45000, 33000, 22000, 18000, 16000],
                incomeSources: [1600, 350, 0, 350],
                trends: { income: [2300, 2350, 2400, 2450, 2500, 2550], expenses: [1900, 1950, 2000, 2100, 2150, 2200] }
            },
             "36-50": {
                expenses: [58000, 22000, 26000, 25000, 21000],
                incomeSources: [2800, 700, 0, 600],
                trends: { income: [4100, 4200, 4150, 4300, 4400, 4350], expenses: [3200, 3300, 3400, 3350, 3500, 3600] }
            }
        }
    };
    const expenseLabels = ['Restaurantes', 'Suscripciones', 'Transporte', 'Ocio', 'Ropa'];
    const incomeLabels = ['Sueldo', 'Emprendimiento', 'Becas', 'Otros'];
    const trendLabels = ['Mes 1', 'Mes 2', 'Mes 3', 'Mes 4', 'Mes 5', 'Mes 6'];

    // --- Inicialización de Gráficos ---
    const expenseChart = new Chart(document.getElementById('topCategoriesChart').getContext('2d'), {
        type: 'bar', data: { labels: expenseLabels, datasets: [] },
        options: { responsive: true, scales: { x: { beginAtZero: true } }, plugins: { legend: { position: 'top' } } }
    });
    const incomeChart = new Chart(document.getElementById('incomeSourceChart').getContext('2d'), {
        type: 'doughnut', data: { 
            labels: incomeLabels, 
            datasets: [{ 
                data: [],
                backgroundColor: [
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(201, 203, 207)'
                ]
            }] 
        },
        options: { responsive: true, plugins: { legend: { position: 'top' } } }
    });
    const trendsChart = new Chart(document.getElementById('trendsChart').getContext('2d'), {
        type: 'line', data: { labels: trendLabels, datasets: [] },
        options: { responsive: true, plugins: { legend: { position: 'top' } }, interaction: { mode: 'index', intersect: false } }
    });

    // --- Referencias a Elementos del DOM ---
    const ageSelect1 = document.getElementById('age-range-1'), locSelect1 = document.getElementById('location-1');
    const ageSelect2 = document.getElementById('age-range-2'), locSelect2 = document.getElementById('location-2');
    const compareToggle = document.getElementById('compare-toggle');
    const insightText = document.getElementById('insight-text');
    const tableHeader = document.querySelector('#dataTable thead'), tableBody = document.querySelector('#dataTable tbody');

    // --- Funciones Principales ---
    function updateDashboard() {
        const isComparing = compareToggle.checked;
        const group1 = { age: ageSelect1.value, loc: locSelect1.value, label: `${ageSelect1.options[ageSelect1.selectedIndex].text} en ${locSelect1.options[locSelect1.selectedIndex].text}` };
        const dataGroup1 = mockDatabase[group1.loc][group1.age];
        
        // Actualizar Gráfico de Gastos
        const expenseDS1 = { label: group1.label, data: dataGroup1.expenses, backgroundColor: 'rgba(54, 162, 235, 0.7)' };
        expenseChart.data.datasets = [expenseDS1];
        
        // Actualizar Gráfico de Ingresos y Tendencias (solo para el grupo principal)
        incomeChart.data.datasets[0].data = dataGroup1.incomeSources;
        trendsChart.data.datasets = [
            { label: 'Ingresos', data: dataGroup1.trends.income, borderColor: 'rgb(75, 192, 192)', tension: 0.1 },
            { label: 'Egresos', data: dataGroup1.trends.expenses, borderColor: 'rgb(255, 99, 132)', tension: 0.1 }
        ];

        if (isComparing) {
            const group2 = { age: ageSelect2.value, loc: locSelect2.value, label: `${ageSelect2.options[ageSelect2.selectedIndex].text} en ${locSelect2.options[locSelect2.selectedIndex].text}` };
            const dataGroup2 = mockDatabase[group2.loc][group2.age];
            const expenseDS2 = { label: group2.label, data: dataGroup2.expenses, backgroundColor: 'rgba(255, 99, 132, 0.7)' };
            expenseChart.data.datasets.push(expenseDS2);
            // Nota: Los otros gráficos no se actualizan en modo comparación para mantener la simplicidad.
        }
        
        expenseChart.update();
        incomeChart.update();
        trendsChart.update();
        populateTable();
        generateInsight();
    }

    function populateTable() {
        const data1 = expenseChart.data.datasets[0].data;
        tableHeader.innerHTML = `<tr><th>Categoría</th><th>${expenseChart.data.datasets[0].label} (USD)</th></tr>`;
        tableBody.innerHTML = '';
        
        if (compareToggle.checked) {
            const data2 = expenseChart.data.datasets[1].data;
            tableHeader.innerHTML = `<tr><th>Categoría</th><th>${expenseChart.data.datasets[0].label} (USD)</th><th>${expenseChart.data.datasets[1].label} (USD)</th></tr>`;
            expenseLabels.forEach((label, i) => {
                tableBody.innerHTML += `<tr><td>${label}</td><td>$${data1[i].toLocaleString()}</td><td>$${data2[i].toLocaleString()}</td></tr>`;
            });
        } else {
            expenseLabels.forEach((label, i) => {
                tableBody.innerHTML += `<tr><td>${label}</td><td>$${data1[i].toLocaleString()}</td></tr>`;
            });
        }
    }
    
    function generateInsight() {
        const ds1 = expenseChart.data.datasets[0];
        const topCat1 = expenseLabels[ds1.data.indexOf(Math.max(...ds1.data))];
        let insight = `Para el grupo <strong>${ds1.label}</strong>, la categoría con mayor gasto es <strong>${topCat1}</strong>.`;
        
        const incomeData = incomeChart.data.datasets[0].data;
        const topIncome = incomeLabels[incomeData.indexOf(Math.max(...incomeData))];
        insight += ` Su principal fuente de ingresos es <strong>${topIncome}</strong>.`;

        if(compareToggle.checked) {
            const ds2 = expenseChart.data.datasets[1];
            const topCat2 = expenseLabels[ds2.data.indexOf(Math.max(...ds2.data))];
            insight += `<br>En comparación, para <strong>${ds2.label}</strong>, la categoría principal es <strong>${topCat2}</strong>.`
        }
        insightText.innerHTML = insight;
    }

    // --- Función para Descargar CSV ---
    function downloadCSV() {
        let csvContent = "data:text/csv;charset=utf-8,";
        const header = Array.from(tableHeader.querySelectorAll("th")).map(th => th.textContent);
        csvContent += header.join(",") + "\r\n";

        const rows = tableBody.querySelectorAll("tr");
        rows.forEach(row => {
            const rowData = Array.from(row.querySelectorAll("td")).map(td => `"${td.textContent.replace(/\$/g, '')}"`);
            csvContent += rowData.join(",") + "\r\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "inteligencia_de_mercado.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // --- Listeners de Eventos ---
    [ageSelect1, locSelect1, ageSelect2, locSelect2, compareToggle].forEach(el => {
        el.addEventListener('change', updateDashboard);
    });
    document.getElementById('download-csv-btn').addEventListener('click', downloadCSV);

    compareToggle.addEventListener('change', () => {
        document.getElementById('comparison-filters-container').style.display = compareToggle.checked ? 'block' : 'none';
    });

    document.getElementById('toggle-view').addEventListener('click', (e) => {
        const chartWrapper = document.getElementById('chart-wrapper');
        const tableContainer = document.getElementById('dataTable-container');
        const isChartVisible = chartWrapper.style.display !== 'none';
        
        chartWrapper.style.display = isChartVisible ? 'none' : 'block';
        tableContainer.style.display = isChartVisible ? 'block' : 'none';
        e.target.textContent = isChartVisible ? 'Ver Gráfico' : 'Ver Tabla';
    });

    // --- Carga Inicial ---
    window.onload = updateDashboard;