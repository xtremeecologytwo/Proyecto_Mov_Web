
const allPermissions = [
        'Acceso Total', 'Ver Dashboard', 'Gestionar Usuarios', 'Gestionar Roles', 'Ver Inteligencia de Mercado',
        'Exportar CSV', 'Supervisar Categorías IA', 'Crear Reglas de IA', 'Ver Métricas del Modelo', 
        'Gestionar Reportes de Soporte', 'Ver Perfil Limitado', 'Acceder a Registros de Seguridad'
    ];

    let roles = [
        { id: 1, name: 'Administrador de TI', userCount: 2, permissions: ['Acceso Total'], protected: true },
        { id: 2, name: 'Analista de Datos', userCount: 3, permissions: ['Ver Inteligencia de Mercado', 'Exportar CSV', 'Ver Dashboard'] },
        { id: 3, name: 'Supervisor de IA', userCount: 1, permissions: ['Supervisar Categorías IA', 'Crear Reglas de IA', 'Ver Métricas del Modelo'] },
        { id: 4, name: 'Agente de Soporte', userCount: 5, permissions: ['Gestionar Reportes de Soporte', 'Ver Perfil Limitado'] }
    ];

    const rolesContainer = document.getElementById('roles-list-container');
    const modal = document.getElementById('role-modal');

    function renderRoles() {
        rolesContainer.innerHTML = '';
        roles.forEach(role => {
            const roleCard = document.createElement('div');
            roleCard.className = 'role-card';
            
            const permissionsHTML = role.permissions.map(p => `<span class="permission-tag">${p}</span>`).join('');
            const deleteDisabled = role.protected ? 'disabled' : '';

            roleCard.innerHTML = `
                <div class="role-info">
                    <h4>${role.name} <span>(${role.userCount} usuarios)</span></h4>
                    <div class="permissions-tags">${permissionsHTML}</div>
                </div>
                <div class="role-actions">
                    <button class="btn-edit" onclick="openModal('edit', ${role.id})">Editar</button>
                    <button class="btn-delete" onclick="openModal('delete', ${role.id})" ${deleteDisabled}>Eliminar</button>
                </div>
            `;
            rolesContainer.appendChild(roleCard);
        });
    }

    function openModal(type, roleId = null) {
        let content = '';
        const role = roles.find(r => r.id === roleId);

        if (type === 'add' || type === 'edit') {
            const title = type === 'add' ? 'Agregar Nuevo Rol' : `Editar Rol: ${role.name}`;
            const roleName = type === 'edit' ? role.name : '';
            const permissionsChecked = type === 'edit' ? role.permissions : [];
            
            const permissionsCheckboxes = allPermissions.map(p => `
                <div class="permission-item">
                    <input type="checkbox" id="perm-${p.replace(/\s+/g, '')}" value="${p}" ${permissionsChecked.includes(p) ? 'checked' : ''}>
                    <label for="perm-${p.replace(/\s+/g, '')}" style="margin-left: 5px;">${p}</label>
                </div>
            `).join('');

            content = `
                <div class="modal-content">
                    <h3>${title}</h3>
                    <input type="text" id="role-name-input" placeholder="Nombre del Rol" value="${roleName}" style="width: 100%; padding: 10px; margin-bottom: 15px;">
                    <h4>Permisos</h4>
                    <div class="permissions-grid">${permissionsCheckboxes}</div>
                    <div class="modal-actions">
                        <button onclick="closeModal()">Cancelar</button>
                        <button onclick="saveRole(${roleId})">Guardar</button>
                    </div>
                </div>
            `;
        } else if (type === 'delete') {
            content = `
                <div class="modal-content" style="text-align: center;">
                    <h3>Confirmar Eliminación</h3>
                    <p>¿Estás seguro de que quieres eliminar el rol <strong>${role.name}</strong>? Esta acción no se puede deshacer.</p>
                    <div class="modal-actions">
                        <button onclick="closeModal()">Cancelar</button>
                        <button onclick="deleteRole(${roleId})" style="background-color: #dc3545; color: white;">Eliminar</button>
                    </div>
                </div>`;
        }
        
        modal.innerHTML = content;
        modal.style.display = 'flex';
    }

    function saveRole(roleId) {
        const name = document.getElementById('role-name-input').value;
        const selectedPermissions = [];
        document.querySelectorAll('.permissions-grid input[type="checkbox"]:checked').forEach(checkbox => {
            selectedPermissions.push(checkbox.value);
        });

        if (!name) {
            alert('El nombre del rol no puede estar vacío.');
            return;
        }

        if (roleId) { // Editando
            const roleIndex = roles.findIndex(r => r.id === roleId);
            roles[roleIndex].name = name;
            roles[roleIndex].permissions = selectedPermissions;
        } else { // Agregando
            const newRole = {
                id: Math.max(...roles.map(r => r.id)) + 1,
                name,
                userCount: 0,
                permissions: selectedPermissions,
                protected: false
            };
            roles.push(newRole);
        }
        renderRoles();
        closeModal();
    }

    function deleteRole(roleId) {
        roles = roles.filter(r => r.id !== roleId);
        renderRoles();
        closeModal();
    }

    function closeModal() { modal.style.display = 'none'; }
    
    document.getElementById('btn-add-role').addEventListener('click', () => openModal('add'));

    window.onload = renderRoles;