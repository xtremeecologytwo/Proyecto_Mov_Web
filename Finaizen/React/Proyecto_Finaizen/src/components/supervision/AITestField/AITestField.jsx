import { useState } from 'react';
import styles from './AITestField.module.css';

function AITestField() {
  const [testInput, setTestInput] = useState('');
  const [prediction, setPrediction] = useState(null);

  const handleTest = () => {
    if (!testInput.trim()) return;
    
    // Simulación de predicción IA
    setPrediction({
      input: testInput,
      keyword: 'Pago',
      category: 'Servicios',
      confidence: 'Media',
      score: 65
    });
  };

  return (
    <section className={styles.card}>
      <h4>Campo de Pruebas de la IA</h4>
      <div className={styles.playground}>
        <div className={styles.inputGroup}>
          <label htmlFor="ai-test-input">Ingresa una descripción para probar:</label>
          <input
            type="text"
            id="ai-test-input"
            placeholder="Ej: 'Pago de la luz'"
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTest()}
          />
        </div>
        <button onClick={handleTest}>Probar</button>
      </div>
      {prediction && (
        <div className={styles.predictionResult}>
          <strong>Predicción para "{prediction.input}":</strong><br />
          Palabra Clave: "{prediction.keyword}"<br />
          Categoría: "{prediction.category}"<br />
          Confianza: {prediction.confidence} ({prediction.score}%)
        </div>
      )}
    </section>
  );
}

export default AITestField;
