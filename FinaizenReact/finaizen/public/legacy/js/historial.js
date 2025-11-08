// historial.js - Manejo del historial de transacciones

document.addEventListener("DOMContentLoaded", () => {
    const filterType = document.getElementById("filter-type");
    const filterPeriod = document.getElementById("filter-period");
    const sortBy = document.getElementById("sort-by");
    const transactionsList = document.getElementById("transactions-list");

    // Función para filtrar transacciones
    function filterTransactions() {
        const selectedType = filterType.value;
        const cards = transactionsList.querySelectorAll(".transaction-card");

        cards.forEach(card => {
            const isIncome = card.classList.contains("income");
            const isExpense = card.classList.contains("expense");

            // Mostrar u ocultar según el filtro
            if (selectedType === "todos") {
                card.style.display = "flex";
            } else if (selectedType === "ingresos" && isIncome) {
                card.style.display = "flex";
            } else if (selectedType === "egresos" && isExpense) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });

        updateSummary();
    }

    // Función para ordenar transacciones
    function sortTransactions() {
        const selectedSort = sortBy.value;
        const cards = Array.from(transactionsList.querySelectorAll(".transaction-card"));

        cards.sort((a, b) => {
            if (selectedSort === "fecha-desc" || selectedSort === "fecha-asc") {
                // Ordenar por fecha (basado en el orden actual en el HTML)
                return selectedSort === "fecha-desc" ? 0 : 0;
            } else if (selectedSort === "monto-desc" || selectedSort === "monto-asc") {
                // Obtener los montos
                const amountA = parseFloat(a.querySelector(".transaction-amount").textContent.replace(/[+\-$,]/g, ""));
                const amountB = parseFloat(b.querySelector(".transaction-amount").textContent.replace(/[+\-$,]/g, ""));
                
                return selectedSort === "monto-desc" ? amountB - amountA : amountA - amountB;
            }
        });

        // Limpiar y volver a insertar en orden
        transactionsList.innerHTML = "";
        cards.forEach(card => transactionsList.appendChild(card));
    }

    // Función para actualizar el resumen
    function updateSummary() {
        const visibleCards = transactionsList.querySelectorAll(".transaction-card:not([style*='display: none'])");
        let totalIncome = 0;
        let totalExpense = 0;

        visibleCards.forEach(card => {
            const amountText = card.querySelector(".transaction-amount").textContent;
            const amount = parseFloat(amountText.replace(/[+\-$,]/g, ""));
            
            if (card.classList.contains("income")) {
                totalIncome += amount;
            } else if (card.classList.contains("expense")) {
                totalExpense += amount;
            }
        });

        const balance = totalIncome - totalExpense;

        // Actualizar los valores en la barra de resumen
        document.querySelector(".income-summary .summary-amount").textContent = `+$${totalIncome.toFixed(2)}`;
        document.querySelector(".expense-summary .summary-amount").textContent = `-$${totalExpense.toFixed(2)}`;
        document.querySelector(".balance-summary .summary-amount").textContent = `$${balance.toFixed(2)}`;
    }

    // Event listeners
    if (filterType) {
        filterType.addEventListener("change", filterTransactions);
    }

    if (filterPeriod) {
        filterPeriod.addEventListener("change", () => {
            console.log("Filtro de período cambiado a:", filterPeriod.value);
            // Aquí se implementaría el filtrado por período en el futuro
        });
    }

    if (sortBy) {
        sortBy.addEventListener("change", sortTransactions);
    }

    // Inicializar el resumen al cargar
    updateSummary();

    // Manejar clicks en botones de editar
    document.addEventListener("click", (e) => {
        if (e.target.closest(".btn-edit")) {
            const card = e.target.closest(".transaction-card");
            const transactionName = card.querySelector(".transaction-info h3").textContent;
            const amount = card.querySelector(".transaction-amount").textContent;
            
            if (confirm(`¿Deseas editar la transacción "${transactionName}" (${amount})?\n\nEsta funcionalidad te redirigirá a la página de edición.`)) {
                // Redirigir a la página de edición correspondiente
                const isIncome = card.classList.contains("income");
                if (isIncome) {
                    window.location.href = "nuevo-ingreso.html";
                } else {
                    window.location.href = "nuevo-egreso.html";
                }
            }
        }
    });

    // Manejar clicks en botones de eliminar
    document.addEventListener("click", (e) => {
        if (e.target.closest(".btn-delete")) {
            const card = e.target.closest(".transaction-card");
            const transactionName = card.querySelector(".transaction-info h3").textContent;
            const amount = card.querySelector(".transaction-amount").textContent;
            
            if (confirm(`⚠️ ¿Estás seguro de que deseas eliminar la transacción "${transactionName}" (${amount})?\n\nEsta acción no se puede deshacer.`)) {
                // Animación de eliminación
                card.style.transition = "all 0.3s ease";
                card.style.transform = "translateX(100%)";
                card.style.opacity = "0";
                
                setTimeout(() => {
                    card.remove();
                    updateSummary();
                    alert("✅ Transacción eliminada correctamente.");
                }, 300);
            }
        }
    });

    console.log("✅ Historial de transacciones cargado correctamente");
});
