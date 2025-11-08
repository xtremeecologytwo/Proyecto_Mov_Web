// src/js/configPerfiles.js

// Los datos simulados se quedan fuera para que sean accesibles
const profilesData = [
    { id: 1, name: 'Finanzas Personales', currency: 'USD' },
    { id: 2, name: 'Emprendimiento', currency: 'EUR' }
];

// 1. Eliminamos el addEventListener y lo envolvemos todo en una función
function initConfigPerfilesPage() {
    console.log('🚀 Inicializando la lógica de la página de perfiles...');

    // 2. Obtenemos la instancia del modal que YA FUE CREADA por main.js
    // Es mejor usar getInstance() para asegurar que usamos el mismo objeto.
    const modalInstance = ProfileModal.getInstance();

    // Renderizar perfiles
    renderProfiles();

    // El resto de tus funciones se quedan exactamente igual, pero dentro de initConfigPerfilesPage
    function renderProfiles() {
        const container = document.querySelector('.profiles-container');
        if (!container) return;
        container.innerHTML = '';
        profilesData.forEach((profile, index) => {
            container.appendChild(createProfileCard(profile, index));
        });
        container.appendChild(createAddProfileCard());
    }

    function createProfileCard(profile, index) {
        const article = document.createElement('article');
        article.className = 'profile-card';
        article.dataset.id = profile.id;

        article.innerHTML = `
            <div class="profile-card__header">
                <div class="profile-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
            </div>
            <div class="profile-card__body">
                <div class="profile-name">
                    <span>Nombre del perfil</span>
                    <strong>${profile.name}</strong>
                </div>
                <div class="profile-currency">
                    <span>Moneda</span>
                    <strong>${profile.currency}</strong>
                </div>
                <div class="profile-card__actions">
                    <a href="#" class="action-link edit-link" data-index="${index}">Editar</a> |
                    <a href="#" class="action-link delete-link" data-index="${index}">Eliminar</a>
                </div>
            </div>
        `;

        // Event listeners (es mejor asignarlos fuera del innerHTML)
        article.querySelector('.edit-link').addEventListener('click', (e) => {
            e.preventDefault();
            modalInstance.openForEdit(profile);
        });

        article.querySelector('.delete-link').addEventListener('click', (e) => {
            e.preventDefault();
            handleDeleteProfile(index, article);
        });

        return article;
    }

    function createAddProfileCard() {
        const card = document.createElement('article');
        card.className = 'profile-card profile-card--add';
        card.innerHTML = `
            <div><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></div>
            <div style="font-size: 1.1em;">Agregar Perfil</div>
        `;
        card.addEventListener('click', () => {
            modalInstance.openForAdd();
        });
        return card;
    }

    function handleDeleteProfile(index, cardElement) {
        const profileData = profilesData[index];
        if (confirm(`¿Estás seguro de que quieres eliminar el perfil "${profileData.name}"?`)) {
            console.log(`Eliminando perfil:`, profileData);
            cardElement.style.opacity = '0';
            cardElement.style.transform = 'scale(0.9)';
            setTimeout(() => {
                cardElement.remove();
                // Opcional: volver a renderizar para ajustar los índices si es necesario
                // renderProfiles(); 
                alert(`✅ Perfil "${profileData.name}" eliminado correctamente`);
            }, 300);
            profilesData.splice(index, 1);
        }
    }
}