document.addEventListener("DOMContentLoaded", () => {

    // Animar las barras de progreso
    const achievementCards = document.querySelectorAll('.achievement-card');
    achievementCards.forEach(card => {
        const progressBarFill = card.querySelector('.progress-bar__fill');
        const progress = card.dataset.progress || 0;
        
        // Usar un pequeño timeout para que la animación se vea al cargar la página
        setTimeout(() => {
            progressBarFill.style.width = `${progress}%`;
        }, 300);
    });
});