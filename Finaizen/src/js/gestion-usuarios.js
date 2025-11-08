
 const roles = {
        'Usuario': 'usuario',
        'Admin TI': 'admin',
        'Analista de Datos': 'analista',
        'Supervisor IA': 'supervisor',
        'Agente de Soporte': 'soporte'
    };

    let users = [
        { id: 1, name: 'Carlos Mendoza', email: 'carlos.m@email.com', date: '2024-08-15', status: 'Activo', role: 'Usuario' },
        { id: 2, name: 'Ana Torres', email: 'ana.t@email.com', date: '2024-09-22', status: 'Activo', role: 'Analista de Datos' },
        { id: 3, name: 'Luis García', email: 'luis.g@email.com', date: '2024-07-10', status: 'Activo', role: 'Usuario' },
        { id: 4, name: 'Javier López', email: 'javier.l@email.com', date: '2024-08-30', status: 'Suspendido', role: 'Usuario' },
        { id: 5, name: 'Carmen Ruiz', email: 'carmen.r@email.com', date: '2024-09-15', status: 'Activo', role: 'Supervisor IA' },
        { id: 6, name: 'Elena Morales', email: 'elena.m@email.com', date: '2024-08-18', status: 'Activo', role: 'Agente de Soporte' },
        { id: 7, name: 'Isabel Díaz', email: 'isabel.d@email.com', date: '2024-08-25', status: 'Suspendido', role: 'Usuario' }
    ];

    const tbody = document.getElementById('user-tbody');
    const roleFilter = document.getElementById('role-filter');

    function renderTable() {
        const searchValue = document.getElementById('search-input').value.toLowerCase();
        const roleValue = roleFilter.value;
        const statusValue = document.getElementById('status-filter').value;
        tbody.innerHTML = '';
        
        users
            .filter(u => 
                (u.name.toLowerCase().includes(searchValue) || u.email.toLowerCase().includes(searchValue)) &&
                (roleValue === 'todos' || u.role === roleValue) &&
                (statusValue === 'todos' || u.status === statusValue)
            )
            .forEach(u => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${u.name}</td><td>${u.email}</td><td>${u.date}</td>
                    <td><span class="status ${u.status.toLowerCase()}">${u.status}</span></td>
                    <td><span class="role ${roles[u.role] || 'usuario'}">${u.role}</span></td>
                    <td class="actions-dropdown">
                        <button onclick="toggleDropdown(${u.id})">⋮</button>
                        <div id="dropdown-${u.id}" class="dropdown-menu">
                            <a href="#" onclick="openModal('view', ${u.id})">Ver Perfil</a>
                            <a href="#" onclick="openModal('role', ${u.id})">Modificar Rol</a>
                            <a href="#" onclick="openModal('${u.status === 'Activo' ? 'suspend' : 'reactivate'}', ${u.id})">${u.status === 'Activo' ? 'Suspender' : 'Reactivar'}</a>
                        </div>
                    </td>
                `;
                tbody.appendChild(row);
            });
        updateKPIs();
    }
    
    function updateKPIs() {
        document.getElementById('kpi-total').textContent = users.length;
        document.getElementById('kpi-active').textContent = users.filter(u => u.status === 'Activo').length;
        document.getElementById('kpi-suspended').textContent = users.filter(u => u.status === 'Suspendido').length;
    }

    function populateRoleFilter() {
        Object.keys(roles).forEach(role => {
            roleFilter.innerHTML += `<option value="${role}">${role}</option>`;
        });
    }

    function toggleDropdown(userId) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            if (menu.id !== `dropdown-${userId}`) menu.classList.remove('show');
        });
        document.getElementById(`dropdown-${userId}`).classList.toggle('show');
    }

    function openModal(type, userId) {
        const user = users.find(u => u.id === userId);
        const modal = document.getElementById('action-modal');
        let content = '';

        if (type === 'view') {
            content = `
                <div class="modal-content">
                    <h3>Perfil de Usuario</h3>
                    <p><strong>Nombre:</strong> ${user.name}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Rol:</strong> ${user.role}</p>
                    <p><strong>Estado:</strong> ${user.status}</p>
                    <p><strong>Miembro desde:</strong> ${user.date}</p>
                    <div class="modal-actions"><button onclick="closeModal()">Cerrar</button></div>
                </div>`;
        } else if (type === 'role') {
            let roleOptions = Object.keys(roles).map(r => `<option value="${r}" ${user.role === r ? 'selected' : ''}>${r}</option>`).join('');
            content = `
                <div class="modal-content">
                    <h3>Modificar Rol de ${user.name}</h3>
                    <select id="new-role-select">${roleOptions}</select>
                    <div class="modal-actions">
                        <button onclick="closeModal()">Cancelar</button>
                        <button onclick="updateUser(${userId}, 'role')">Guardar</button>
                    </div>
                </div>`;
        } else if (type === 'suspend' || type === 'reactivate') {
            const actionText = type === 'suspend' ? 'suspender' : 'reactivar';
            content = `
                <div class="modal-content">
                    <h3>Confirmar Acción</h3>
                    <p>¿Estás seguro de que quieres ${actionText} a <strong>${user.name}</strong>?</p>
                    <div class="modal-actions">
                        <button onclick="closeModal()">Cancelar</button>
                        <button onclick="updateUser(${userId}, '${type}')">Confirmar</button>
                    </div>
                </div>`;
        } else if (type === 'invite') {
             content = `
                <div class="modal-content">
                    <h3>Invitar Nuevo Usuario</h3>
                    <input type="email" id="invite-email" placeholder="Email del usuario" style="width: 100%; padding: 10px; margin-bottom: 10px;">
                     <select id="invite-role-select">${Object.keys(roles).map(r => `<option value="${r}">${r}</option>`).join('')}</select>
                    <div class="modal-actions">
                        <button onclick="closeModal()">Cancelar</button>
                        <button onclick="updateUser(null, 'invite')">Enviar Invitación</button>
                    </div>
                </div>`;
        }
        
        modal.innerHTML = content;
        modal.style.display = 'flex';
    }

    function updateUser(userId, actionType) {
        if (actionType === 'role') {
            const newRole = document.getElementById('new-role-select').value;
            const userIndex = users.findIndex(u => u.id === userId);
            users[userIndex].role = newRole;
        } else if (actionType === 'suspend') {
            users.find(u => u.id === userId).status = 'Suspendido';
        } else if (actionType === 'reactivate') {
            users.find(u => u.id === userId).status = 'Activo';
        } else if (actionType === 'invite') {
            const email = document.getElementById('invite-email').value;
            const role = document.getElementById('invite-role-select').value;
            console.log(`Invitación enviada a ${email} con el rol de ${role}.`);
        }
        renderTable();
        closeModal();
    }
    
    function closeModal() { document.getElementById('action-modal').style.display = 'none'; }
    
    document.getElementById('search-input').addEventListener('input', renderTable);
    document.getElementById('role-filter').addEventListener('change', renderTable);
    document.getElementById('status-filter').addEventListener('change', renderTable);
    document.getElementById('btn-invite-user').addEventListener('click', () => openModal('invite', null));

    window.onload = () => {
        populateRoleFilter();
        renderTable();
    };
