// src/js/modal_perfil.js

// Datos de monedas
const currencies = [
    { value: 'USD', label: 'Dólar estadounidense (USD)', flag: '🇺🇸' },
    { value: 'EUR', label: 'Euro (EUR)', flag: '🇪🇺' },
    { value: 'MXN', label: 'Peso mexicano (MXN)', flag: '🇲🇽' },
    { value: 'COP', label: 'Peso colombiano (COP)', flag: '🇨🇴' },
    { value: 'ARS', label: 'Peso argentino (ARS)', flag: '🇦🇷' },
    { value: 'CLP', label: 'Peso chileno (CLP)', flag: '🇨🇱' },
    { value: 'PEN', label: 'Sol peruano (PEN)', flag: '🇵🇪' },
    { value: 'BRL', label: 'Real brasileño (BRL)', flag: '🇧🇷' },
    { value: 'GBP', label: 'Libra esterlina (GBP)', flag: '🇬🇧' },
    { value: 'JPY', label: 'Yen japonés (JPY)', flag: '🇯🇵' },
    { value: 'CNY', label: 'Yuan chino (CNY)', flag: '🇨🇳' },
    { value: 'CAD', label: 'Dólar canadiense (CAD)', flag: '🇨🇦' }
];

// Clase para manejar el modal de perfiles
class ProfileModal {
    constructor() {
        this.modal = null;
        this.form = null;
        this.modalTitle = null;
        this.submitBtn = null;
        this.submitText = null;
        this.profileIdInput = null;
        this.profileNameInput = null;
        this.profileCurrencySelect = null;
        this.isEditMode = false;
        this.currentProfileData = null;
        this.modalLoaded = false;

        this.init();
    }

    // Inicializar el modal
    init() {
        this.cacheElements();
        
        if (!this.modal) {
            console.error('❌ Modal no encontrado en el DOM');
            alert('Error: El modal no está disponible en esta página.');
            return;
        }
        
        this.modalLoaded = true;
        this.populateCurrencies();
        this.attachEvents();
        console.log('✅ Modal de perfil inicializado correctamente');
    }

    // Llenar el selector de monedas
    populateCurrencies() {
        if (!this.profileCurrencySelect) return;
        
        currencies.forEach(curr => {
            const option = document.createElement('option');
            option.value = curr.value;
            option.textContent = `${curr.flag} ${curr.label}`;
            this.profileCurrencySelect.appendChild(option);
        });
    }

    // Cachear elementos del DOM
    cacheElements() {
        this.modal = document.getElementById('profile-modal');
        this.form = document.getElementById('profile-form');
        this.modalTitle = document.getElementById('modal-title');
        this.submitBtn = document.getElementById('submit-btn');
        this.submitText = this.submitBtn?.querySelector('.submit-text');
        this.profileIdInput = document.getElementById('profile-id');
        this.profileNameInput = document.getElementById('profile-name');
        this.profileCurrencySelect = document.getElementById('profile-currency');
        this.closeBtn = document.getElementById('close-modal-btn');
        this.cancelBtn = document.getElementById('cancel-btn');
    }

    // Adjuntar eventos
    attachEvents() {
        // Cerrar modal con el botón X
        this.closeBtn.addEventListener('click', () => this.close());

        // Cerrar modal con el botón Cancelar
        this.cancelBtn.addEventListener('click', () => this.close());

        // Cerrar modal al hacer clic fuera
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Cerrar modal con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });

        // Manejar envío del formulario
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Validación en tiempo real
        this.profileNameInput.addEventListener('input', () => {
            this.clearError(this.profileNameInput);
        });

        this.profileCurrencySelect.addEventListener('change', () => {
            this.clearError(this.profileCurrencySelect);
        });
    }

    // Abrir modal en modo "Agregar"
    openForAdd() {
        if (!this.modalLoaded) {
            alert('El modal aún se está cargando. Por favor intenta nuevamente.');
            return;
        }
        
        this.isEditMode = false;
        this.modalTitle.textContent = 'Agregar nuevo perfil';
        if (this.submitText) {
            this.submitText.textContent = 'Crear perfil';
        }
        this.form.reset();
        this.clearAllErrors();
        this.show();
    }

    // Abrir modal en modo "Editar"
    openForEdit(profileData) {
        if (!this.modalLoaded) {
            alert('El modal aún se está cargando. Por favor intenta nuevamente.');
            return;
        }
        
        this.isEditMode = true;
        this.currentProfileData = profileData;
        this.modalTitle.textContent = 'Editar perfil';
        if (this.submitText) {
            this.submitText.textContent = 'Guardar cambios';
        }
        
        // Cargar datos en el formulario
        this.profileIdInput.value = profileData.id;
        this.profileNameInput.value = profileData.name;
        this.profileCurrencySelect.value = profileData.currency;
        
        this.clearAllErrors();
        this.show();
    }

    // Mostrar el modal
    show() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevenir scroll del body
        
        // Focus en el primer campo
        setTimeout(() => {
            this.profileNameInput.focus();
        }, 300);
    }

    // Cerrar el modal
    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll del body
        
        // Limpiar formulario después de la animación
        setTimeout(() => {
            this.form.reset();
            this.clearAllErrors();
        }, 300);
    }

    // Validar formulario
    validate() {
        let isValid = true;

        // Validar nombre
        if (!this.profileNameInput.value.trim()) {
            this.showError(this.profileNameInput, 'El nombre del perfil es obligatorio');
            isValid = false;
        } else if (this.profileNameInput.value.trim().length < 3) {
            this.showError(this.profileNameInput, 'El nombre debe tener al menos 3 caracteres');
            isValid = false;
        }

        // Validar moneda
        if (!this.profileCurrencySelect.value) {
            this.showError(this.profileCurrencySelect, 'Debes seleccionar una moneda');
            isValid = false;
        }

        return isValid;
    }

    // Mostrar error en un campo
    showError(input, message) {
        input.classList.add('error');
        const errorSpan = input.parentElement.querySelector('.error-message');
        if (errorSpan) {
            errorSpan.textContent = message;
            errorSpan.classList.add('show');
        }
    }

    // Limpiar error de un campo
    clearError(input) {
        input.classList.remove('error');
        const errorSpan = input.parentElement.querySelector('.error-message');
        if (errorSpan) {
            errorSpan.classList.remove('show');
            errorSpan.textContent = '';
        }
    }

    // Limpiar todos los errores
    clearAllErrors() {
        const inputs = this.form.querySelectorAll('input, select');
        inputs.forEach(input => this.clearError(input));
    }

    // Manejar envío del formulario
    handleSubmit() {
        if (!this.validate()) {
            return;
        }

        // Recopilar datos del formulario
        const formData = {
            id: this.profileIdInput.value,
            name: this.profileNameInput.value.trim(),
            currency: this.profileCurrencySelect.value
        };

        // Obtener el nombre completo de la moneda seleccionada
        const selectedOption = this.profileCurrencySelect.options[this.profileCurrencySelect.selectedIndex];
        const currencyFullName = selectedOption.text;

        if (this.isEditMode) {
            // Modo edición
            console.log('Actualizando perfil:', formData);
            
            // TODO: Aquí harías la petición a la API para actualizar
            // await fetch(`/api/profiles/${formData.id}`, {
            //     method: 'PATCH',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // });

            // Simulación de éxito - NO redirige
            this.showSuccessMessage('Guardando cambios', formData.name, currencyFullName);
        } else {
            // Modo creación
            console.log('Creando nuevo perfil:', formData);
            
            // TODO: Aquí harías la petición a la API para crear
            // const response = await fetch('/api/profiles', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // });

            // Simulación de éxito - SÍ redirige
            this.showSuccessAndRedirect('Creando perfil', formData.name, currencyFullName);
        }
    }

    // Mostrar mensaje de éxito sin redirigir (para edición)
    showSuccessMessage(action, profileName, currency) {
        // Construir mensaje con la información ingresada
        const message = `✅ ${action}\n\nNombre: ${profileName}\nMoneda: ${currency}`;

        // Mostrar mensaje
        alert(message);

        // Cerrar el modal
        this.close();

        // Recargar la página para reflejar cambios
        window.location.reload();
    }

    // Mostrar mensaje de éxito y redirigir (para creación)
    showSuccessAndRedirect(action, profileName, currency) {
        // Deshabilitar botones durante la redirección
        this.submitBtn.disabled = true;
        this.cancelBtn.disabled = true;

        // Construir mensaje con la información ingresada
        const message = `✅ ${action}\n\nNombre: ${profileName}\nMoneda: ${currency}\n\nSerás redirigido al dashboard.`;

        // Mostrar mensaje
        alert(message);

        // Redirigir al dashboard de usuario
        setTimeout(() => {
            window.location.href = '../User/dashboard.html';
        }, 500);
    }

    // Método público para obtener la instancia del modal
    static getInstance() {
        if (!ProfileModal.instance) {
            ProfileModal.instance = new ProfileModal();
        }
        return ProfileModal.instance;
    }
}

// Exportar para uso global
window.ProfileModal = ProfileModal;
