// src/js/configNotificaciones.js

document.addEventListener("DOMContentLoaded", () => {
    // --- Datos de Notificaciones (Simulando respuesta de API/BD) ---
    // TODO: En producción, reemplazar esto con una llamada a la API
    // Ejemplo:
    // async function fetchNotifications() {
    //     try {
    //         const response = await fetch('/api/notifications');
    //         const data = await response.json();
    //         return data;
    //     } catch (error) {
    //         console.error('Error al cargar notificaciones:', error);
    //         return [];
    //     }
    // }
    
    // Opciones de tiempo de anticipación
    const advanceTimeOptions = [
        { value: '0', label: 'En el momento', icon: '🔔' },
        { value: '15min', label: '15 minutos antes', icon: '⏰' },
        { value: '30min', label: '30 minutos antes', icon: '⏰' },
        { value: '1hour', label: '1 hora antes', icon: '⏰' },
        { value: '2hours', label: '2 horas antes', icon: '⏰' },
        { value: '1day', label: '1 día antes', icon: '📅' },
        { value: '2days', label: '2 días antes', icon: '📅' },
        { value: '1week', label: '1 semana antes', icon: '📆' },
    ];

    const notificationsData = [
        {
            id: 1,
            title: 'Salario Mensual',
            description: 'Recordatorio el día 30 de cada mes',
            type: 'income', // 'income' o 'expense'
            status: 'active', // 'active' o 'inactive'
            advanceTime: '1day', // Tiempo de anticipación
        },
        {
            id: 2,
            title: 'Beca Universitaria',
            description: 'Recordatorio cada sábado',
            type: 'income',
            status: 'active',
            advanceTime: '1day',
        },
        {
            id: 3,
            title: 'Mensualidad',
            description: 'Recordatorio el día 19 de cada mes',
            type: 'income',
            status: 'inactive',
            advanceTime: '2days',
        },
        {
            id: 4,
            title: 'Pago por Pasantías',
            description: 'Recordatorio cada L, M, Mi, J, V',
            type: 'income',
            status: 'active',
            advanceTime: '0',
        },
        {
            id: 5,
            title: 'Mensualidad Abuelita',
            description: 'Recordatorio el día 25 de cada mes',
            type: 'income',
            status: 'inactive',
            advanceTime: '1day',
        },
        {
            id: 6,
            title: 'Pagar Arriendo',
            description: 'Recordatorio el día 1 de cada mes',
            type: 'expense',
            status: 'active',
            advanceTime: '1week',
        },
        {
            id: 7,
            title: 'Pagar el Internet',
            description: 'Recordatorio el día 2 de cada mes',
            type: 'expense',
            status: 'active',
            advanceTime: '2days',
        },
        {
            id: 8,
            title: 'Pagar la Luz',
            description: 'Recordatorio el día 5 de cada mes',
            type: 'expense',
            status: 'active',
            advanceTime: '2days',
        },
        {
            id: 9,
            title: 'Suscripción Netflix',
            description: 'Recordatorio el día 15 de cada mes',
            type: 'expense',
            status: 'active',
            advanceTime: '1day',
        },
        {
            id: 10,
            title: 'Suscripción Prime',
            description: 'Recordatorio el día 15 de cada mes',
            type: 'expense',
            status: 'inactive',
            advanceTime: '1day',
        },
        {
            id: 11,
            title: 'Gastos con Pareja',
            description: 'Recordatorio cada sábado',
            type: 'expense',
            status: 'active',
            advanceTime: '1hour',
        },
        {
            id: 12,
            title: 'Pasajes de Bus',
            description: 'Recordatorio cada L, M, Mi, J, V',
            type: 'expense',
            status: 'active',
            advanceTime: '15min',
        },
        {
            id: 13,
            title: 'Almuerzo Universidad',
            description: 'Recordatorio cada L, Mi, J',
            type: 'expense',
            status: 'inactive',
            advanceTime: '30min',
        },
        {
            id: 14,
            title: 'Cuota del Gimnasio',
            description: 'Recordatorio el día 10 de cada mes',
            type: 'expense',
            status: 'active',
            advanceTime: '2days',
        },
        {
            id: 15,
            title: 'Pago Seguro Médico',
            description: 'Recordatorio el día 20 de cada mes',
            type: 'expense',
            status: 'inactive',
            advanceTime: '1week',
        }
    ];

    // --- Referencias a elementos del DOM ---
    const notificationList = document.querySelector('.notification-list');
    const statusFilter = document.getElementById('notification-filter');
    const typeFilter = document.getElementById('notification-type-filter');
    const notificationsCard = document.querySelector('.notifications-card');

    // Crear contador de resultados
    const resultCounter = document.createElement('div');
    resultCounter.className = 'result-counter';
    resultCounter.style.cssText = 'margin-top: 10px; font-size: 0.9em; color: #6c757d; font-weight: 500;';
    const filterBar = document.querySelector('.filter-bar');
    if (filterBar && notificationsCard) {
        filterBar.parentNode.insertBefore(resultCounter, filterBar.nextSibling);
    }

    // --- Función para crear el HTML de una notificación ---
    function createNotificationElement(notification) {
        // Obtener plantilla del DOM
        const template = document.getElementById('notification-item-template');
        if (!template) {
            console.error('❌ Plantilla no encontrada en el DOM');
            return null;
        }

        // Clonar contenido de la plantilla
        const article = template.content.cloneNode(true).firstElementChild;

        // Configurar datos
        article.dataset.id = notification.id;
        article.dataset.status = notification.status;
        article.dataset.type = notification.type;

        // Rellenar contenido
        article.querySelector('.notification-title').textContent = notification.title;
        article.querySelector('.notification-description').textContent = notification.description;

        // Badge de tipo
        const typeLabel = notification.type === 'income' ? 'Ingreso' : 'Egreso';
        const badgeClass = notification.type === 'income' ? 'income-badge' : 'expense-badge';
        const badge = article.querySelector('.notification-badge');
        badge.className = `notification-badge ${badgeClass}`;
        badge.textContent = typeLabel;

        // Icono de tiempo
        const currentTimeOption = advanceTimeOptions.find(opt => opt.value === notification.advanceTime);
        const timeIcon = currentTimeOption ? currentTimeOption.icon : '🔔';
        article.querySelector('.time-icon').textContent = timeIcon;

        // Selector de tiempo
        const select = article.querySelector('.advance-time-select');
        select.id = `advance-time-${notification.id}`;
        select.dataset.notificationId = notification.id;
        select.disabled = notification.status === 'inactive';

        // Llenar opciones de tiempo
        advanceTimeOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.label;
            optionElement.selected = option.value === notification.advanceTime;
            select.appendChild(optionElement);
        });

        // Actualizar label del selector
        const label = article.querySelector('.time-label');
        label.setAttribute('for', `advance-time-${notification.id}`);

        // Botón de toggle
        const buttonText = notification.status === 'active' ? 'Deshabilitar' : 'Habilitar';
        article.querySelector('.toggle-btn').textContent = buttonText;

        return article;
    }

    // --- Función para renderizar todas las notificaciones ---
    function renderNotifications() {
        if (!notificationList) return;

        // Limpiar el contenedor
        notificationList.innerHTML = '';

        // Si no hay datos, mostrar mensaje
        if (notificationsData.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.style.cssText = 'text-align: center; padding: 40px; color: #6c757d;';
            emptyMessage.textContent = 'No hay notificaciones disponibles.';
            notificationList.appendChild(emptyMessage);
            return;
        }

        // Crear y agregar cada notificación
        notificationsData.forEach(notification => {
            const notificationElement = createNotificationElement(notification);
            if (notificationElement) {
                notificationList.appendChild(notificationElement);
            }
        });

        // Aplicar filtros después de renderizar
        applyFilters();
    }

    // --- Función para alternar el estado de una notificación ---
    function toggleNotificationStatus(notificationId) {
        const notification = notificationsData.find(n => n.id === notificationId);
        if (notification) {
            notification.status = notification.status === 'active' ? 'inactive' : 'active';
            
            // TODO: En producción, hacer petición a la API para actualizar en la BD
            // Ejemplo:
            // await fetch(`/api/notifications/${notificationId}`, {
            //     method: 'PATCH',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ status: notification.status })
            // });
            console.log(`Notificación ${notificationId} actualizada:`, notification);
            
            // Actualizar solo el elemento específico en lugar de re-renderizar todo
            const element = document.querySelector(`[data-id="${notificationId}"]`);
            if (element) {
                element.dataset.status = notification.status;
                const button = element.querySelector('.toggle-btn');
                button.textContent = notification.status === 'active' ? 'Deshabilitar' : 'Habilitar';
                
                // Habilitar/deshabilitar el selector de tiempo
                const advanceTimeSelect = element.querySelector('.advance-time-select');
                if (advanceTimeSelect) {
                    advanceTimeSelect.disabled = notification.status === 'inactive';
                }
            }
            
            // Volver a aplicar filtros
            applyFilters();
        }
    }

    // --- Función para actualizar el tiempo de anticipación ---
    function updateAdvanceTime(notificationId, newAdvanceTime) {
        const notification = notificationsData.find(n => n.id === notificationId);
        if (notification) {
            notification.advanceTime = newAdvanceTime;
            
            // TODO: En producción, hacer petición a la API para actualizar en la BD
            // Ejemplo:
            // await fetch(`/api/notifications/${notificationId}`, {
            //     method: 'PATCH',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ advanceTime: newAdvanceTime })
            // });
            
            const timeOption = advanceTimeOptions.find(opt => opt.value === newAdvanceTime);
            console.log(`Tiempo de anticipación actualizado para notificación ${notificationId}: ${timeOption?.label}`);
            
            // Actualizar el icono visual con animación
            const item = document.querySelector(`[data-id="${notificationId}"]`);
            if (item) {
                const iconElement = item.querySelector('.time-icon');
                const selector = item.querySelector('.advance-time-selector');
                
                if (iconElement && timeOption) {
                    // Animación de cambio de icono
                    iconElement.style.transform = 'scale(1.3)';
                    setTimeout(() => {
                        iconElement.textContent = timeOption.icon;
                        iconElement.style.transform = 'scale(1)';
                    }, 150);
                }

                // Feedback visual
                if (selector) {
                    selector.style.backgroundColor = '#d4edda';
                    selector.style.borderColor = '#28a745';
                    setTimeout(() => {
                        selector.style.backgroundColor = '';
                        selector.style.borderColor = '';
                    }, 800);
                }
            }
        }
    }

    // --- Event Listener para los botones de Habilitar/Deshabilitar ---
    if (notificationList) {
        notificationList.addEventListener('click', (event) => {
            if (event.target.classList.contains('toggle-btn')) {
                const item = event.target.closest('.notification-item');
                const notificationId = parseInt(item.dataset.id);
                toggleNotificationStatus(notificationId);
            }
        });

        // Event Listener para los selectores de tiempo de anticipación
        notificationList.addEventListener('change', (event) => {
            if (event.target.classList.contains('advance-time-select')) {
                const notificationId = parseInt(event.target.dataset.notificationId);
                const newAdvanceTime = event.target.value;
                updateAdvanceTime(notificationId, newAdvanceTime);
            }
        });
    }

    // --- Event Listeners para los filtros ---
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
    
    if (typeFilter) {
        typeFilter.addEventListener('change', applyFilters);
    }
    
    // --- Función para aplicar filtros ---
    function applyFilters() {
        const selectedStatus = statusFilter?.value || 'all';
        const selectedType = typeFilter?.value || 'all';
        const allItems = document.querySelectorAll('.notification-item');
        let visibleCount = 0;
        let activeCount = 0;
        let inactiveCount = 0;

        allItems.forEach(item => {
            const itemStatus = item.dataset.status;
            const itemType = item.dataset.type;
            
            let showByStatus = false;
            let showByType = false;

            // Verificar filtro de estado
            switch (selectedStatus) {
                case 'active':
                    showByStatus = (itemStatus === 'active');
                    break;
                case 'inactive':
                    showByStatus = (itemStatus === 'inactive');
                    break;
                case 'all':
                default:
                    showByStatus = true;
                    break;
            }

            // Verificar filtro de tipo
            switch (selectedType) {
                case 'income':
                    showByType = (itemType === 'income');
                    break;
                case 'expense':
                    showByType = (itemType === 'expense');
                    break;
                case 'all':
                default:
                    showByType = true;
                    break;
            }

            // Mostrar solo si cumple ambos filtros
            const shouldShow = showByStatus && showByType;
            item.style.display = shouldShow ? 'flex' : 'none';
            
            if (shouldShow) {
                visibleCount++;
                if (itemStatus === 'active') activeCount++;
                if (itemStatus === 'inactive') inactiveCount++;
            }
        });

        // Actualizar el contador de resultados
        if (resultCounter) {
            resultCounter.textContent = '';
            
            resultCounter.appendChild(document.createTextNode('Mostrando '));
            
            const strongCount = document.createElement('strong');
            strongCount.textContent = visibleCount;
            resultCounter.appendChild(strongCount);
            
            resultCounter.appendChild(document.createTextNode(' notificación(es) ('));
            
            const activeSpan = document.createElement('span');
            activeSpan.style.color = '#0288D1';
            activeSpan.textContent = `${activeCount} activas`;
            resultCounter.appendChild(activeSpan);
            
            resultCounter.appendChild(document.createTextNode(', '));
            
            const inactiveSpan = document.createElement('span');
            inactiveSpan.style.color = '#6c757d';
            inactiveSpan.textContent = `${inactiveCount} inactivas`;
            resultCounter.appendChild(inactiveSpan);
            
            resultCounter.appendChild(document.createTextNode(')'));
        }
    }

    // --- Inicialización ---
    // Renderizar notificaciones al cargar la página
    renderNotifications();

    // --- Función pública para recargar notificaciones (útil para futuras actualizaciones) ---
    window.reloadNotifications = function(newData) {
        if (newData && Array.isArray(newData)) {
            notificationsData.length = 0;
            notificationsData.push(...newData);
            renderNotifications();
        }
    };
});