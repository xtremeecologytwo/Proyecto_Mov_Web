// src/js/configNotificaciones.js

document.addEventListener("DOMContentLoaded", () => {
    // --- Cargar el Sidebar de Configuración Dinámicamente ---

    // --- Lógica de la Página de Notificaciones ---
    const notificationList = document.querySelector('.notification-list');
    const filter = document.getElementById('notification-filter');

    // 1. Lógica para los botones de Habilitar/Deshabilitar
    if (notificationList) {
        notificationList.addEventListener('click', (event) => {
            // Solo actuar si se hizo clic en un botón con la clase .toggle-btn
            if (event.target.classList.contains('toggle-btn')) {
                const button = event.target;
                const item = button.closest('.notification-item');
                const currentStatus = item.dataset.status;

                if (currentStatus === 'active') {
                    // Cambiar a inactivo
                    item.dataset.status = 'inactive';
                    button.textContent = 'Habilitar';
                } else {
                    // Cambiar a activo
                    item.dataset.status = 'active';
                    button.textContent = 'Deshabilitar';
                }
                
                // Opcional: Volver a aplicar el filtro actual después de un cambio
                applyFilter();
            }
        });
    }

    // 2. Lógica para el filtro
    if (filter) {
        filter.addEventListener('change', applyFilter);
    }
    
    function applyFilter() {
        const selectedValue = filter.value;
        const allItems = document.querySelectorAll('.notification-item');

        allItems.forEach(item => {
            const itemStatus = item.dataset.status;

            switch (selectedValue) {
                case 'active':
                    item.style.display = (itemStatus === 'active') ? 'flex' : 'none';
                    break;
                case 'inactive':
                    item.style.display = (itemStatus === 'inactive') ? 'flex' : 'none';
                    break;
                case 'all':
                default:
                    item.style.display = 'flex';
                    break;
            }
        });
    }
});