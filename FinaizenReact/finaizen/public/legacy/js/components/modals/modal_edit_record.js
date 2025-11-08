// src/components/edit_record_modal/modal_edit_record.js
class EditRecordModal {
    constructor() {
        // Inicialización se retrasa hasta que getInstance es llamado
    }

    init() {
        this._cacheElements();
        this._attachEvents();
    }

    _cacheElements() {
        this.modal = document.getElementById('edit-record-modal');
        this.form = document.getElementById('edit-record-form');
        this.closeBtn = document.getElementById('close-edit-modal-btn');
        this.cancelBtn = document.getElementById('cancel-edit-btn');
        this.frequencySelect = document.getElementById('record-frequency');
        this.weeklyOptions = document.getElementById('weekly-options');
        this.monthlyOptions = document.getElementById('monthly-options');
        this.daySelectorContainer = this.weeklyOptions.querySelector('.day-selector');
    }

    _attachEvents() {
        this.closeBtn.addEventListener('click', () => this.close());
        this.cancelBtn.addEventListener('click', () => this.close());
        this.modal.addEventListener('click', e => {
            if (e.target === this.modal) this.close();
        });
        this.frequencySelect.addEventListener('change', () => this._handleFrequencyChange());
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            this._handleSubmit();
        });
    }

    open(recordData) {
        this._populateForm(recordData);
        this.modal.classList.add('active');
    }

    close() {
        this.modal.classList.remove('active');
        this.form.reset();
    }

    _populateForm(record) {
        this.form['record-id'].value = record.id;
        this.form['record-type'].value = record.type;
        this.form['record-name'].value = record.title;
        this.form['record-amount'].value = record.amount;
        this.form['record-frequency'].value = record.frequency;

        // Poblar campos condicionales
        this._buildDayCheckboxes(record.days);
        this.form['monthly-day'].value = record.dayOfMonth || '';

        // Disparar el cambio de frecuencia para mostrar los campos correctos
        this._handleFrequencyChange();
    }

    _buildDayCheckboxes(selectedDays = []) {
        this.daySelectorContainer.innerHTML = '';
        const days = ['L', 'M', 'Mi', 'J', 'V', 'S', 'D'];
        days.forEach(day => {
            const isChecked = selectedDays.includes(day);
            const label = document.createElement('label');
            label.innerHTML = `
                <input type="checkbox" name="record-days" value="${day}" ${isChecked ? 'checked' : ''}>
                <span>${day}</span>
            `;
            this.daySelectorContainer.appendChild(label);
        });
    }

    _handleFrequencyChange() {
        const frequency = this.frequencySelect.value;
        this.weeklyOptions.style.display = (frequency === 'semanal' || frequency === 'diario') ? 'block' : 'none';
        this.monthlyOptions.style.display = frequency === 'mensual' ? 'block' : 'none';

        if(frequency === 'diario') {
            this.daySelectorContainer.querySelectorAll('input').forEach(chk => chk.checked = true);
        }
    }

    _handleSubmit() {
        const formData = new FormData(this.form);
        const record = {
            id: formData.get('record-id'),
            type: formData.get('record-type'),
            title: formData.get('record-name'),
            amount: parseFloat(formData.get('record-amount')),
            frequency: formData.get('record-frequency'),
            days: formData.getAll('record-days'),
            dayOfMonth: formData.get('monthly-day')
        };
        console.log('Guardando cambios:', record);
        alert('Registro actualizado (ver consola).');
        this.close();
        // TODO: Aquí se llamaría a una función para actualizar la UI
        // window.dispatchEvent(new CustomEvent('recordUpdated', { detail: record }));
    }

    static getInstance() {
        if (!EditRecordModal.instance) {
            EditRecordModal.instance = new EditRecordModal();
        }
        return EditRecordModal.instance;
    }
}