
    let securityLogs = [
        { id: 1, datetime: '2025-10-18 14:22:18', type: 'fallido', event: 'Inicio de Sesión Fallido', ip: '192.168.1.105', user: 'carlos.mendez@email.com', blocked: false },
        { id: 2, datetime: '2025-10-18 13:58:01', type: 'fallido', event: 'Inicio de Sesión Fallido', ip: '192.168.1.107', user: 'laura.gomez@email.com', blocked: true },
        { id: 3, datetime: '2025-10-18 12:31:47', type: 'exitoso', event: 'Inicio de Sesión', ip: '192.168.1.109', user: 'david.garcia@email.com', blocked: false },
        { id: 4, datetime: '2025-10-18 12:05:33', type: 'modificacion', event: 'Cambio de Contraseña', ip: '192.168.1.118', user: 'isabel.sanchez@email.com', blocked: false },
        { id: 8, datetime: '2025-10-18 11:50:10', type: 'modificacion', event: 'Cambio de Correo Electrónico', ip: '201.15.8.44', user: 'marta.f@gmail.com', blocked: false },
        { id: 5, datetime: '2025-10-18 11:47:12', type: 'fallido', event: 'Inicio de Sesión Fallido', ip: '192.168.1.111', user: 'francisco.martin@email.com', blocked: false },
        { id: 9, datetime: '2025-10-18 11:35:00', type: 'modificacion', event: 'Autenticación 2FA Activada', ip: '190.152.20.1', user: 'david.garcia@email.com', blocked: false },
        { id: 6, datetime: '2025-10-18 11:20:05', type: 'exitoso', event: 'Inicio de Sesión', ip: '192.168.1.115', user: 'patricia.diaz@email.com', blocked: false },
        { id: 7, datetime: '2025-10-18 10:55:41', type: 'fallido', event: 'Inicio de Sesión Fallido', ip: '192.168.1.108', user: 'ana.torres@email.com', blocked: true },
        { id: 10, datetime: '2025-10-18 10:15:22', type: 'modificacion', event: 'Exportación de Datos', ip: '181.39.15.112', user: 'luis.r@gmail.com', blocked: false }
    ];

    const tbody = document.getElementById('security-log-tbody');
    const eventFilter = document.getElementById('event-filter');
    const searchInput = document.getElementById('search-input');
    const modal = document.getElementById('confirmation-modal');

    function renderTable() {
        const filterValue = eventFilter.value;
        const searchValue = searchInput.value.toLowerCase();
        tbody.innerHTML = '';

        securityLogs
            .filter(log => 
                (filterValue === 'todos' || log.type === filterValue) &&
                (log.user.toLowerCase().includes(searchValue) || log.ip.toLowerCase().includes(searchValue))
            )
            .forEach(log => {
                const row = document.createElement('tr');
                const actionText = log.blocked ? 'Desbloquear' : 'Bloquear';
                const actionClass = log.blocked ? 'unblock' : 'block';
                
                row.innerHTML = `
                    <td>${log.datetime}</td>
                    <td><span class="event-type ${log.type}">${log.event}</span></td>
                    <td>${log.ip}</td>
                    <td>${log.user}</td>
                    <td><a class="action-link ${actionClass}" data-id="${log.id}" data-user="${log.user}">${actionText}</a></td>
                `;
                tbody.appendChild(row);
            });
    }
    
    tbody.addEventListener('click', (e) => {
        if (e.target.classList.contains('action-link')) {
            const logId = parseInt(e.target.dataset.id);
            const user = e.target.dataset.user;
            const action = e.target.textContent.toLowerCase();
            openConfirmationModal(logId, user, action);
        }
    });

    let currentAction = {};
    function openConfirmationModal(logId, user, action) {
        currentAction = { logId, action };
        const modalTitle = document.getElementById('modal-title');
        const modalMessage = document.getElementById('modal-message');
        const confirmBtn = document.getElementById('modal-confirm');

        modalTitle.textContent = `Confirmar ${action.charAt(0).toUpperCase() + action.slice(1)}`;
        modalMessage.innerHTML = `¿Estás seguro de que quieres <strong>${action}</strong> al usuario <strong>${user}</strong>?`;
        
        if (action === 'bloquear') {
            confirmBtn.style.backgroundColor = '#dc3545';
        } else {
            confirmBtn.style.backgroundColor = '#28a745';
        }

        modal.style.display = 'flex';
    }

    function closeConfirmationModal() {
        modal.style.display = 'none';
    }



    document.getElementById('modal-cancel').addEventListener('click', closeConfirmationModal);
    document.getElementById('modal-confirm').addEventListener('click', () => {
        const logIndex = securityLogs.findIndex(log => log.id === currentAction.logId);
        if (logIndex > -1) {
            securityLogs[logIndex].blocked = !securityLogs[logIndex].blocked;
            renderTable();
        }
        console.log(`Usuario ${currentAction.action === 'bloquear' ? 'bloqueado' : 'desbloqueado'}.`);
        closeConfirmationModal();
    });

    eventFilter.addEventListener('change', renderTable);
    searchInput.addEventListener('input', renderTable);

    window.onload = renderTable;