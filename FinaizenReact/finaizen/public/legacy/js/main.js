// src/js/main.js

/**
 * Maneja el logout del usuario
 * Limpia sesiones y redirige a index.html
 */
function handleLogout(event) {
    event.preventDefault();
    
    // Llamar a SessionManager para limpiar sesiones
    if (typeof SessionManager !== 'undefined' && SessionManager.logout) {
        SessionManager.logout();
    }
    
    // Redirigir a index.html
    window.location.href = '../Base/index.html';
}

document.addEventListener('DOMContentLoaded', async () => {
     // 1. Cargamos el HTML de todos los componentes en paralelo
    await Promise.all([
        loadSidebar(),
        loadProfileModal(),
        loadIaCorrectionModal(),
        loadEditRecordModal(),
        loadConfirmDialog(),
        loadBudgetModal()
    ]);

    console.log('✅ Todos los componentes principales han sido cargados.');
    
    // 2. Ahora que el HTML está en el DOM, inicializamos y obtenemos las instancias
    // Nota: Solo inicializamos los componentes si su placeholder existe en la página actual.
    
     let editModal, confirmDialog, budgetModal;

    if (document.getElementById('edit-modal-placeholder')) {
        editModal = EditRecordModal.getInstance();
        editModal.init();
    }
    
    if (document.getElementById('confirm-dialog-placeholder')) {
        confirmDialog = ConfirmDialog.getInstance();
        confirmDialog.init();
        }

    if (document.getElementById('budget-modal-placeholder')) { // <-- AÑADIR INICIALIZACIÓN
        budgetModal = BudgetModal.getInstance();
        budgetModal.init();
    }

    // Inicializamos los otros modales también para otras páginas
    if (document.getElementById('modal-placeholder')) {
        ProfileModal.getInstance();
    }
    if (document.getElementById('ia-modal-placeholder')) {
        IaCorrectionModal.getInstance();
    }

    // 3. Llamamos a las funciones de inicialización de página, pasando las instancias necesarias
    if (typeof initConfigPerfilesPage === 'function') {
        initConfigPerfilesPage();
    }
    if (typeof initSupervisionPage === 'function') {
        initSupervisionPage();
    }
    
    // CORRECCIÓN CLAVE: Pasamos las instancias a la función de la página
    if (typeof initAdminRegistrosPage === 'function') {
        // Solo llamamos a la función si sus dependencias fueron inicializadas
        if (editModal && confirmDialog) {
            initAdminRegistrosPage(editModal, confirmDialog);
        } else {
            console.error('No se pudo inicializar la página de registros porque faltan uno o más componentes.');
        }
    }

    if (typeof initAdminRegistrosPage === 'function') {
        initAdminRegistrosPage(editModal, confirmDialog);
    }
    if (typeof initPresupuestosPage === 'function') { // <-- AÑADIR LLAMADA
        initPresupuestosPage(budgetModal, confirmDialog);
    }
});

/**
 * Carga el sidebar y su menú desplegable asociado.
 */
async function loadSidebar() {
    const sidebarContainer = document.getElementById('sidebar-container');
    const mainContent = document.querySelector('.main-content');

    if (!sidebarContainer || !mainContent) {
        // Esta página no tiene sidebar, terminamos la función.
        return;
    }

    const sidebarType = sidebarContainer.dataset.sidebar;
    if (!sidebarType) {
        console.error("El #sidebar-container no tiene 'data-sidebar'.");
        return;
    }

    try {
        const sidebarFile = `../../components/sidebar/sidebar_${sidebarType}.html`;
        const response = await fetch(sidebarFile);
        if (!response.ok) throw new Error(`No se pudo cargar ${sidebarFile}`);
        
        sidebarContainer.innerHTML = await response.text();
        
        // Adjuntar eventos al contenido recién cargado del sidebar
        const menuToggleButton = document.getElementById('menu-toggle');
        if (menuToggleButton) {
            menuToggleButton.addEventListener('click', () => {
                sidebarContainer.classList.toggle('collapsed');
                mainContent.classList.toggle('sidebar-collapsed');
            });
        }

        // Cargar y configurar el menú del usuario
        await loadSidebarMenu();

    } catch (err) {
        console.error('Error al cargar y configurar el sidebar:', err);
    }
}

/**
 * Carga el modal de perfil y lo inicializa.
 */
async function loadProfileModal() {
    const modalPlaceholder = document.getElementById('modal-placeholder');
    // Si la página no tiene el placeholder, no necesita el modal.
    if (!modalPlaceholder) {
        return;
    }

    try {
        const response = await fetch('../../components/modals/modal_perfil.html');
        if (!response.ok) {
            throw new Error(`Error al cargar el modal: ${response.statusText}`);
        }
        
        modalPlaceholder.innerHTML = await response.text();
        
        // Inicializa el script del modal DESPUÉS de que su HTML haya sido cargado.
        ProfileModal.getInstance();
        console.log('✅ Modal de perfil cargado e inicializado.');

    } catch (error) {
        console.error('❌ Falló la carga del modal de perfil:', error);
        modalPlaceholder.innerHTML = '<p style="color:red; text-align:center;">Error al cargar el componente del modal.</p>';
    }
}


// --- FUNCIONES DEL MENÚ DEL SIDEBAR (se mantienen igual) ---

async function loadSidebarMenu() {
    const dropdownContainer = document.getElementById("user-dropdown-container");
    if (!dropdownContainer) return;

    try {
        const response = await fetch('../../components/sidebar/sidebar_menu.html');
        if (!response.ok) throw new Error('No se pudo cargar sidebar_menu.html');
        
        dropdownContainer.innerHTML = await response.text();
        initSidebarMenu(); // Inicializar eventos del dropdown
    } catch (err) {
        console.error("Error al cargar el menú flotante:", err);
    }
}

function initSidebarMenu() {
    const userMenuTrigger = document.getElementById("user-menu-trigger");
    const userDropdown = document.getElementById("user-dropdown");
    if (!userMenuTrigger || !userDropdown) return;

    userMenuTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
        if (!userMenuTrigger.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.remove("active");
        }
    });

    userDropdown.addEventListener("click", (e) => {
        e.stopPropagation();
    });
}

async function loadIaCorrectionModal() {
    const modalPlaceholder = document.getElementById('ia-modal-placeholder');
    if (!modalPlaceholder) return; 

    try {
        const response = await fetch('../../components/modals/modal_correccion_ia.html');
        if (!response.ok) throw new Error('Error al cargar el modal de IA');
        
        const modalHTML = await response.text(); // Guardamos el HTML en una variable
        modalPlaceholder.innerHTML = modalHTML;
        
        // --- LÍNEAS DE DEPURACIÓN AÑADIDAS ---
        console.log('HTML del modal inyectado:', modalPlaceholder.innerHTML);
        console.log('¿Se encuentra #keyword-weight?:', document.getElementById('keyword-weight'));
        // --- FIN DE LÍNEAS DE DEPURACIÓN ---

        // Ahora inicializa
        IaCorrectionModal.getInstance();
        
    } catch (error) {
        console.error('❌ Falló la carga del modal de corrección de IA:', error);
    }
}

async function loadEditRecordModal() {
    const placeholder = document.getElementById('edit-modal-placeholder');
    if (!placeholder) return;
    try {
        const response = await fetch('../../components/modals/modal_edit_record.html');
        placeholder.innerHTML = await response.text();
        // YA NO SE LLAMA A .init() AQUÍ
    } catch (e) { console.error('Error al cargar el modal de edición:', e); }
}

async function loadConfirmDialog() {
    const placeholder = document.getElementById('confirm-dialog-placeholder');
    if (!placeholder) return;
    try {
        const response = await fetch('../../components/confirm dialog/confirm_dialog.html');
        placeholder.innerHTML = await response.text();
        // YA NO SE LLAMA A .init() AQUÍ
    } catch (e) { console.error('Error al cargar el diálogo de confirmación:', e); }
}

async function loadBudgetModal() {
    const placeholder = document.getElementById('budget-modal-placeholder');
    if (!placeholder) return;
    try {
        const response = await fetch('../../components/modals/modal_budget.html');
        placeholder.innerHTML = await response.text();
    } catch (e) { console.error('Error al cargar el modal de presupuestos:', e); }
}