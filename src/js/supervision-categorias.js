
const transactions = [
        { id: 1, desc: '"Salida al cine"', keyword: '"Cine"', category: 'Entretenimiento', confidence: 'alta', score: 98, status: 'Validado' },
        { id: 2, desc: '"Comprar medicina"', keyword: '"Medicina"', category: 'Salud', confidence: 'media', score: 74, status: 'Corregir' },
        { id: 3, desc: '"Pago de suscripcion spotify"', keyword: '"Pago"', category: 'Otros', confidence: 'baja', score: 45, status: 'Corregir y crear regla' },
        { id: 4, desc: '"Uber a casa"', keyword: '"Uber"', category: 'Transporte', confidence: 'media', score: 68, status: 'Corregir' },
        { id: 5, desc: '"Supermaxi compra semanal"', keyword: '"Supermaxi"', category: 'Supermercado', confidence: 'alta', score: 99, status: 'Validado' },
        { id: 6, desc: '"Cuota del gym"', keyword: '"Gym"', category: 'Salud', confidence: 'alta', score: 92, status: 'Validado' },
        { id: 7, desc: '"Netflix mensual"', keyword: '"Netflix"', category: 'Otros', confidence: 'baja', score: 51, status: 'Corregir y crear regla' }
    ];

    const tbody = document.getElementById('supervision-tbody');
    const confidenceFilter = document.getElementById('confidence-filter');
    const searchInput = document.getElementById('search-input');
    const modal = document.getElementById('correction-modal');

    function renderTable() {
        const filterValue = confidenceFilter.value;
        const searchValue = searchInput.value.toLowerCase();
        tbody.innerHTML = '';

        transactions
            .filter(t => (filterValue === 'todos' || t.confidence === filterValue) && t.desc.toLowerCase().includes(searchValue))
            .forEach(t => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${t.desc}</td>
                    <td>${t.keyword}</td>
                    <td>${t.category}</td>
                    <td><span class="confidence-level ${t.confidence}">${t.confidence.charAt(0).toUpperCase() + t.confidence.slice(1)} (${t.score}%)</span></td>
                    <td><a class="action-link" data-id="${t.id}">${t.status}</a></td>
                `;
                tbody.appendChild(row);
            });
    }
    
    tbody.addEventListener('click', (e) => {
        if (e.target.classList.contains('action-link')) {
            const transactionId = parseInt(e.target.dataset.id);
            const transaction = transactions.find(t => t.id === transactionId);
            if (transaction && transaction.status !== 'Validado') {
                openCorrectionModal(transaction);
            }
        }
    });

    function openCorrectionModal(transaction) {
        document.getElementById('modal-original-desc').textContent = transaction.desc;
        document.getElementById('modal-keyword').value = transaction.keyword.replace(/"/g, '');
        document.getElementById('modal-category').value = transaction.category;
        document.getElementById('modal-create-rule').checked = transaction.status === 'Corregir y crear regla';
        modal.style.display = 'flex';
    }

    function closeCorrectionModal() {
        modal.style.display = 'none';
    }

    document.getElementById('modal-cancel').addEventListener('click', closeCorrectionModal);
    document.getElementById('modal-save').addEventListener('click', () => {
        // Aquí iría la lógica para guardar los cambios en la BD
        console.log("Corrección guardada.");
        closeCorrectionModal();
    });

    document.getElementById('ai-test-btn').addEventListener('click', () => {
        const input = document.getElementById('ai-test-input').value;
        const resultDiv = document.getElementById('ai-prediction-result');
        if (!input) return;
        
        // Simulación de una llamada a la API de la IA
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `<strong>Predicción para "${input}":</strong><br>
                               Palabra Clave: "Pago"<br>
                               Categoría: "Servicios"<br>
                               Confianza: Media (65%)`;
    });

    function renderCharts() {
        const confidenceCounts = transactions.reduce((acc, t) => { acc[t.confidence] = (acc[t.confidence] || 0) + 1; return acc; }, {});
        new Chart(document.getElementById('confidenceChart').getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Alta', 'Media', 'Baja'],
                datasets: [{
                    data: [confidenceCounts.alta || 0, confidenceCounts.media || 0, confidenceCounts.baja || 0],
                    backgroundColor: ['#d4edda', '#fff3cd', '#f8d7da'],
                    borderColor: ['#155724', '#856404', '#721c24'],
                    borderWidth: 1
                }]
            },
            options: { responsive: true, plugins: { legend: { position: 'top' } } }
        });
        
        new Chart(document.getElementById('correctionsTrendChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Jul', 'Ago', 'Sep', 'Oct'],
                datasets: [{
                    label: 'Correcciones Manuales',
                    data: [120, 95, 88, 82],
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1
                }]
            },
            options: { plugins: { legend: { display: false } } }
        });
    }

    confidenceFilter.addEventListener('change', renderTable);
    searchInput.addEventListener('input', renderTable);

    window.onload = () => {
        renderTable();
        renderCharts();
    };