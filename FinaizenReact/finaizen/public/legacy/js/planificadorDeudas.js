document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('debt-form');
    const resultsContainer = document.getElementById('results-container');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const amount = parseFloat(document.getElementById('amount').value);
        const annualInterest = parseFloat(document.getElementById('interest').value);
        const termMonths = parseInt(document.getElementById('term').value, 10);

        if (isNaN(amount) || isNaN(annualInterest) || isNaN(termMonths) || amount <= 0 || termMonths <= 0) {
            alert("Por favor, introduce valores válidos.");
            return;
        }

        const monthlyInterest = annualInterest / 100 / 12;
        let monthlyPayment;

        if (monthlyInterest === 0) { // Préstamo sin interés
            monthlyPayment = amount / termMonths;
        } else {
            const factor = Math.pow(1 + monthlyInterest, termMonths);
            monthlyPayment = amount * (monthlyInterest * factor) / (factor - 1);
        }

        const totalPaid = monthlyPayment * termMonths;
        const totalInterest = totalPaid - amount;

        document.getElementById('monthly-payment').textContent = `$${monthlyPayment.toFixed(2)}`;
        document.getElementById('total-paid').textContent = `$${totalPaid.toFixed(2)}`;
        document.getElementById('total-interest').textContent = `$${totalInterest.toFixed(2)}`;

        generateAmortizationTable(amount, monthlyPayment, monthlyInterest, termMonths);
        
        resultsContainer.classList.remove('hidden');
    });

    function generateAmortizationTable(principal, monthlyPayment, monthlyInterest, termMonths) {
        const tableBody = document.querySelector("#amortization-table tbody");
        tableBody.innerHTML = ''; // Limpiar tabla anterior
        let balance = principal;

        for (let i = 1; i <= termMonths; i++) {
            const interestPaid = balance * monthlyInterest;
            const principalPaid = monthlyPayment - interestPaid;
            balance -= principalPaid;

            const row = `
                <tr>
                    <td>${i}</td>
                    <td>$${monthlyPayment.toFixed(2)}</td>
                    <td>$${principalPaid.toFixed(2)}</td>
                    <td>$${interestPaid.toFixed(2)}</td>
                    <td>$${Math.abs(balance).toFixed(2)}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        }
    }
});