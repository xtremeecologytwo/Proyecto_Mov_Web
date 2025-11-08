// src/components/confirm_dialog/confirm_dialog.js
class ConfirmDialog {
    constructor() {
        // La inicialización ocurre la primera vez que se llama a getInstance
    }
    
    init() {
        this._cacheElements();
    }

    _cacheElements() {
        this.dialog = document.getElementById('confirm-dialog');
        this.titleEl = document.getElementById('confirm-title');
        this.messageEl = document.getElementById('confirm-message');
        this.cancelBtn = document.getElementById('confirm-cancel-btn');
        this.confirmBtn = document.getElementById('confirm-delete-btn');
    }

    show(message, title = 'Confirmar Acción') {
        this.titleEl.textContent = title;
        this.messageEl.textContent = message;
        this.dialog.classList.add('active');

        // Retornamos una promesa que se resolverá con true o false
        return new Promise(resolve => {
            const close = (result) => {
                this.dialog.classList.remove('active');
                // Removemos los listeners para que no se acumulen
                this.cancelBtn.removeEventListener('click', cancelListener);
                this.confirmBtn.removeEventListener('click', confirmListener);
                resolve(result);
            };

            const cancelListener = () => close(false);
            const confirmListener = () => close(true);

            this.cancelBtn.addEventListener('click', cancelListener);
            this.confirmBtn.addEventListener('click', confirmListener);
        });
    }

    static getInstance() {
        if (!ConfirmDialog.instance) {
            ConfirmDialog.instance = new ConfirmDialog();
        }
        return ConfirmDialog.instance;
    }
}