// src/js/nuevo_ingreso.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Referencias a elementos del formulario ---
    const incomeForm = document.querySelector('.income-form');
    const montoInput = document.getElementById('monto');
    const descripcionInput = document.getElementById('descripcion');
    const frequencyItems = document.querySelectorAll('.frequency-list li');
    const daysSelector = document.getElementById('days-selector');
    const monthDaySelector = document.getElementById('month-day-selector');
    const dateSelector = document.getElementById('date-selector');
    const timeSelectorLabel = document.getElementById('time-selector-label');
    const dayCheckboxes = document.querySelectorAll('.days-selector input[type="checkbox"]');
    const calendarGrid = document.getElementById('calendar-grid');
    const dayOfMonthInput = document.getElementById('day-of-month');
    const notificationCheckbox = document.getElementById('activar-notificacion');
    const timeInputContainer = document.getElementById('time-input-container');
    const timeInput = document.getElementById('hora-notificacion');

    // --- Funciones de Validación y UI de Errores ---

    /** Muestra un mensaje de error para un campo específico */
    const showError = (inputElement, message) => {
        const wrapper = inputElement.closest('.input-wrapper');
        if (!wrapper) return; // Salir si no hay wrapper
        const errorDiv = wrapper.querySelector('.error-message');
        const elementToStyle = inputElement.type === 'number' ? inputElement : wrapper.querySelector('input, .days-selector');
        elementToStyle.classList.add('is-invalid');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    };

    /** Limpia el mensaje de error de un campo específico */
    const clearError = (inputElement) => {
        const wrapper = inputElement.closest('.input-wrapper');
        if (!wrapper) return; // Salir si no hay wrapper
        const errorDiv = wrapper.querySelector('.error-message');
        const elementToStyle = inputElement.type === 'number' ? inputElement : wrapper.querySelector('input, .days-selector');
        elementToStyle.classList.remove('is-invalid');
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
    };

    /** Valida el formulario completo y devuelve true si es válido */
    const validateForm = () => {
        let isValid = true;
        clearError(montoInput);
        clearError(descripcionInput);
        clearError(daysSelector);
        clearError(timeInput);

        if (!montoInput.value || parseFloat(montoInput.value) <= 0) {
            showError(montoInput, 'El monto debe ser un número mayor a cero.');
            isValid = false;
        }

        if (descripcionInput.value.trim() === '') {
            showError(descripcionInput, 'La descripción es obligatoria.');
            isValid = false;
        }

        const activeFrequency = document.querySelector('.frequency-list li.active')?.dataset.value;
        if (activeFrequency === 'semanal') {
            if (Array.from(dayCheckboxes).filter(cb => cb.checked).length === 0) {
                showError(daysSelector, 'Debe seleccionar al menos un día.');
                isValid = false;
            }
        }
        
        if (notificationCheckbox.checked && !timeInput.value) {
            showError(timeInput, 'Debe especificar una hora para la notificación.');
            isValid = false;
        }

        return isValid;
    };

    // --- Lógica de Eventos ---

    incomeForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (validateForm()) {
            const formData = {
                monto: montoInput.value,
                descripcion: descripcionInput.value,
                frecuencia: document.querySelector('.frequency-list li.active')?.dataset.value,
                notificacionActivada: notificationCheckbox.checked,
                horaNotificacion: timeInput.value,
            };
            
            console.log("Datos listos para enviar:", formData);
            alert(`✅ ¡Nuevo ingreso guardado!\n\nMonto: $${formData.monto}\nDescripción: ${formData.descripcion}\nFrecuencia: ${formData.frecuencia}\nNotificación: ${formData.notificacionActivada ? 'Sí' : 'No'}${formData.notificacionActivada ? ` a las ${formData.horaNotificacion}` : ''}`);
            incomeForm.reset();
            updateTimeSelector('semanal');
            document.querySelector('.frequency-list li[data-value="semanal"]').classList.add('active');

        } else {
            console.log("El formulario contiene errores.");
        }
    });

    montoInput.addEventListener('input', () => { if (montoInput.value && parseFloat(montoInput.value) > 0) clearError(montoInput); });
    descripcionInput.addEventListener('input', () => { if (descripcionInput.value.trim() !== '') clearError(descripcionInput); });
    timeInput.addEventListener('input', () => { if (timeInput.value) clearError(timeInput); });
    notificationCheckbox.addEventListener('change', () => {
        timeInputContainer.style.display = notificationCheckbox.checked ? 'flex' : 'none';
        if (!notificationCheckbox.checked) clearError(timeInput);
    });

    // --- Lógica de UI (Frecuencia, Calendario, etc.) ---
    
    function generateCalendar() {
        calendarGrid.innerHTML = '';
        for (let i = 1; i <= 31; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('calendar-day');
            dayDiv.textContent = i;
            dayDiv.dataset.day = i;
            dayDiv.addEventListener('click', function() {
                document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
                this.classList.add('selected');
                dayOfMonthInput.value = i;
            });
            calendarGrid.appendChild(dayDiv);
        }
    }

    function updateTimeSelector(frequency) {
        daysSelector.style.display = 'none';
        monthDaySelector.style.display = 'none';
        dateSelector.style.display = 'none';
        switch(frequency) {
            case 'diario':
                timeSelectorLabel.textContent = 'Días de la semana:';
                daysSelector.style.display = 'grid';
                dayCheckboxes.forEach(checkbox => { checkbox.checked = true; });
                break;
            case 'semanal':
                timeSelectorLabel.textContent = 'Seleccione los días:';
                daysSelector.style.display = 'grid';
                dayCheckboxes.forEach(checkbox => { checkbox.checked = false; });
                break;
            case 'mensual':
                timeSelectorLabel.textContent = 'Seleccione el día del mes:';
                monthDaySelector.style.display = 'block';
                if (!calendarGrid.children.length) { generateCalendar(); }
                const currentDay = new Date().getDate();
                dayOfMonthInput.value = currentDay;
                document.querySelectorAll('.calendar-day').forEach(d => {
                    d.classList.remove('selected');
                    if (parseInt(d.dataset.day) === currentDay) d.classList.add('selected');
                });
                break;
            case 'anual':
                timeSelectorLabel.textContent = 'Seleccione una fecha:';
                dateSelector.style.display = 'block';
                document.getElementById('specific-date').value = new Date().toISOString().split('T')[0];
                break;
            case 'ocasional':
                timeSelectorLabel.textContent = '';
                break;
        }
    }

    frequencyItems.forEach(item => {
        item.addEventListener('click', () => {
            frequencyItems.forEach(el => el.classList.remove('active'));
            item.classList.add('active');
            updateTimeSelector(item.dataset.value);
            clearError(daysSelector);
        });
    });

    dayCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (Array.from(dayCheckboxes).filter(cb => cb.checked).length > 0) {
                clearError(daysSelector);
            }
        });
    });

    const activeFrequency = document.querySelector('.frequency-list li.active');
    if (activeFrequency) {
        updateTimeSelector(activeFrequency.dataset.value);
    }
});