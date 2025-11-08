
    const supportTickets = [
        { id: 485, user: 'marta.f@gmail.com', subject: 'Ingreso semanal no se registra', date: '2025-10-18', status: 'nuevo' },
        { id: 486, user: 'juan.p@hotmail.com', subject: 'No puedo editar un gasto guardado', date: '2025-10-18', status: 'pendiente' },
        { id: 487, user: 'ana.g@company.com', subject: 'Sugerencia: Agregar recordatorios', date: '2025-10-17', status: 'resuelto' },
        { id: 488, user: 'carlos.m@yahoo.com', subject: 'Error en el cálculo del resumen mensual', date: '2025-10-17', status: 'escalado' },
        { id: 489, user: 'luis.r@gmail.com', subject: 'Mi categoría de "Mascotas" no aparece', date: '2025-10-16', status: 'resuelto' },
        { id: 490, user: 'maria.l@empresa.com', subject: 'Problema con la frecuencia anual', date: '2025-10-16', status: 'nuevo' }
    ];

    const tbody = document.getElementById('support-tbody');
    const statusFilter = document.getElementById('status-filter');
    const searchInput = document.getElementById('search-input');
    const assignModal = document.getElementById('assign-modal');
    const viewModal = document.getElementById('view-modal'); 

    function renderTable() {
        const filterValue = statusFilter.value;
        const searchValue = searchInput.value.toLowerCase();
        tbody.innerHTML = '';

        supportTickets
            .filter(ticket => 
                (filterValue === 'todos' || ticket.status === filterValue) &&
                (ticket.user.toLowerCase().includes(searchValue) || ticket.subject.toLowerCase().includes(searchValue))
            )
            .forEach(ticket => {
                const row = document.createElement('tr');
                const actions = ticket.status === 'resuelto' 
                    ? `<a class="action-link view-link" data-id="${ticket.id}">Ver</a>` 
                    : `<a class="action-link view-link" data-id="${ticket.id}">Ver</a><a class="action-link assign-link" data-id="${ticket.id}">Asignar</a>`;

                row.innerHTML = `
                    <td>${ticket.id}</td>
                    <td>${ticket.user}</td>
                    <td>${ticket.subject}</td>
                    <td>${ticket.date}</td>
                    <td><span class="status ${ticket.status}">${ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}</span></td>
                    <td>${actions}</td>
                `;
                tbody.appendChild(row);
            });
    }
    
    tbody.addEventListener('click', (e) => {
        if (e.target.classList.contains('assign-link')) {
            const ticketId = e.target.dataset.id;
            openAssignModal(ticketId);
        }
        // Lógica para el botón VER (NUEVO)
        if (e.target.classList.contains('view-link')) {
            const ticketId = e.target.dataset.id;
            openViewModal(ticketId);
        }

    });

    function openAssignModal(ticketId) {
        document.getElementById('modal-report-id').textContent = ticketId;
        assignModal.style.display = 'flex';
    }

    function closeAssignModal() {
        assignModal.style.display = 'none';
    }

    document.getElementById('modal-cancel').addEventListener('click', closeAssignModal);
    document.getElementById('modal-save').addEventListener('click', () => {
        // Lógica para guardar la asignación
        console.log("Ticket asignado.");
        closeAssignModal();
    });

    function openViewModal(ticketId) {
    // 1. Encontrar el ticket por su ID
    const ticket = supportTickets.find(t => t.id == ticketId);

        if (ticket) {
            // 2. Llenar el modal con la información del ticket
            document.getElementById('view-report-id').textContent = ticket.id;
            document.getElementById('view-report-user').textContent = ticket.user;
            document.getElementById('view-report-subject').textContent = ticket.subject;
            document.getElementById('view-report-date').textContent = ticket.date;
            
            const statusSpan = document.getElementById('view-report-status');
            statusSpan.textContent = ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1);
            statusSpan.className = `status ${ticket.status}`; // Opcional: para aplicar el estilo de color
            
            // 3. Mostrar el modal
            viewModal.style.display = 'flex';
        }
    }

    function closeViewModal() {
        viewModal.style.display = 'none';
    }

    // Evento para cerrar el modal de vista (usa el ID que pusimos en el HTML)
    document.getElementById('view-modal-close').addEventListener('click', closeViewModal);

    statusFilter.addEventListener('change', renderTable);
    searchInput.addEventListener('input', renderTable);

    window.onload = renderTable;