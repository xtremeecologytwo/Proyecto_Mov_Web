// src/components/ia_correction_modal/modal_correccion_ia.js

class IaCorrectionModal {
    constructor() {
        // Cache de elementos del DOM
        this.modalOverlay = null;
        this.form = null;
        this.transaction = null;
        // ... otros elementos que necesites cachear ...

        // Llama a la inicialización
        this.init();
    }

    init() {
        // Es importante esperar a que el HTML esté en el DOM para cachear los elementos.
        // Por eso, la inicialización real se dispara desde getInstance()
    }

    _cacheElements() {
        this.modalOverlay = document.querySelector('.modal-overlay-ia');
        this.form = document.querySelector('.correction-form');
        this.closeBtn = document.querySelector('.modal-close-ia');
        this.cancelBtn = document.querySelector('.cancel-correction');
        this.weightRange = document.getElementById('keyword-weight');
        this.weightValue = document.querySelector('.weight-value');
        
        // ... cachea todos los demás inputs y spans del modal aquí ...
        this.originalDesc = document.querySelector('.original-description');
        this.originalKeyword = document.querySelector('.original-keyword');
        this.originalCategory = document.querySelector('.original-category');
        this.originalConfidence = document.querySelector('.original-confidence');
        this.correctedKeywordInput = document.getElementById('corrected-keyword');
        this.correctedCategorySelect = document.getElementById('corrected-category');
        this.keywordsContainer = document.querySelector('.keywords-detected');
    }

    _attachEvents() {
        if (!this.modalOverlay) return;

        this.closeBtn.addEventListener('click', () => this.close());
        this.cancelBtn.addEventListener('click', () => this.close());
        this.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay) this.close();
        });

        this.weightRange.addEventListener('input', (e) => {
            this.weightValue.textContent = e.target.value;
        });

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this._handleSubmit();
        });
    }

    // --- MÉTODOS PÚBLICOS ---

    open(transactionData) {
        if (!this.modalOverlay) {
            console.error('El modal de corrección no está cargado en el DOM.');
            return;
        }
        
        this.transaction = transactionData;
        this._populateData();
        this.modalOverlay.style.display = 'flex';
        this.modalOverlay.classList.add('active');
    }

    close() {
        this.modalOverlay.style.display = 'none';
        this.modalOverlay.classList.remove('active');
        // Opcional: limpiar el formulario si es necesario
        // this.form.reset(); 
    }

    // --- MÉTODOS PRIVADOS (de ayuda) ---

    _populateData() {
        // Llenar categorías y palabras clave
        this._populateCategories();
        this._populateKeywords();

        // Llenar información original
        this.originalDesc.textContent = this.transaction.desc;
        this.originalKeyword.textContent = this.transaction.keyword;
        this.originalCategory.textContent = this.transaction.category;
        this.originalConfidence.textContent = `${this.transaction.confidence.charAt(0).toUpperCase() + this.transaction.confidence.slice(1)} (${this.transaction.score}%)`;

        // Llenar formulario
        this.correctedKeywordInput.value = (this.transaction.keyword || '').replace(/"/g, '');
        this.correctedCategorySelect.value = this.transaction.category || '';
    }

    _handleSubmit() {
        console.log('Corrección guardada:', {
            transactionId: this.transaction.id,
            keyword: document.getElementById('corrected-keyword').value,
            category: document.getElementById('corrected-category').value,
            // ... recopilar el resto de los datos del form ...
        });
        alert('Corrección enviada. Revisa la consola para ver los datos.');
        this.close();
        // Aquí podrías emitir un evento para que la tabla se actualice
        // window.dispatchEvent(new CustomEvent('iaCorrectionApplied', { detail: { id: this.transaction.id } }));
    }
    
    // --- LÓGICA PORTADA DESDE supervision-categorias.js ---
    _populateCategories() {
        const categories = ['Entretenimiento', 'Salud', 'Transporte', 'Supermercado', 'Suscripciones', 'Servicios', 'Otros'];
        while (this.correctedCategorySelect.options.length > 1) {
            this.correctedCategorySelect.remove(1);
        }
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            this.correctedCategorySelect.appendChild(option);
        });
    }
    
    _populateKeywords() {
        const desc = (this.transaction.desc || '').replace(/"/g, '');
        const aiKeyword = (this.transaction.keyword || '').replace(/"/g, '').toLowerCase();
        let candidates = this._extractKeywords(desc);
        if (aiKeyword && !candidates.includes(aiKeyword)) {
            candidates.unshift(aiKeyword);
        }
        candidates = candidates.slice(0, 8);
        this.keywordsContainer.innerHTML = '';
        if (candidates.length === 0) {
            this.keywordsContainer.innerHTML = '<em>No se detectaron palabras clave.</em>';
            return;
        }
        candidates.forEach((word, idx) => {
            const id = `kw-${this.transaction.id}-${idx}`;
            const label = document.createElement('label');
            label.className = 'keyword-pill';
            label.innerHTML = `<input type="radio" name="keyword-choice" value="${word}" id="${id}" ${idx === 0 ? 'checked' : ''}><span>${word}</span>`;
            this.keywordsContainer.appendChild(label);
        });

        const updateCorrected = () => {
            const selected = this.keywordsContainer.querySelector('input:checked');
            if (selected) this.correctedKeywordInput.value = selected.value;
        };

        this.keywordsContainer.querySelectorAll('input').forEach(r => r.addEventListener('change', updateCorrected));
        updateCorrected();
    }
    
    _extractKeywords(text) {
        // (La misma función que tenías antes)
        if (!text) return [];
        const cleaned = text.replace(/"/g, '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-záéíóúñ0-9\s]/gi, ' ');
        const stopwords = new Set(['el','la','los','las','un','una','unos','unas','de','del','al','a','y','o','u','en','con','por','para','sin','sobre',
        'se','su','sus','mi','mis','tu','tus','su','sus','nuestro','nuestra','nuestros','nuestras','vos','usted','ustedes',
        'yo','me','te','lo','le','les','que','como','es','son','fue','fueron','sera','seran','estoy','esta','estas','estamos',
        'muy','mas','menos','ya','no','si','pero','porque','cuando','donde','cuanto','pago','pagar']);
        const words = cleaned.split(/\s+/).filter(w => w && w.length >= 3 && !stopwords.has(w));
        return [...new Set(words)];
    }

    // --- MÉTODO SINGLETON ---
    static getInstance() {
        if (!IaCorrectionModal.instance) {
            IaCorrectionModal.instance = new IaCorrectionModal();
            // Retrasamos la inicialización hasta que el HTML esté cargado
            // y este método sea llamado por primera vez.
            try {
                IaCorrectionModal.instance._cacheElements();
                IaCorrectionModal.instance._attachEvents();
                console.log('✅ Modal de corrección de IA inicializado.');
            } catch (e) {
                console.error('❌ Error al inicializar el modal de IA. ¿Está el HTML cargado?', e);
            }
        }
        return IaCorrectionModal.instance;
    }
}