import styles from './SupervisionTable.module.css';

function SupervisionTable({ transactions, onValidate, onCorrect }) {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.supervisionTable}>
        <thead>
          <tr>
            <th>Descripción del usuario</th>
            <th>Palabra clave IA</th>
            <th>Categoría general IA</th>
            <th>Confianza</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                No se encontraron registros con los filtros aplicados.
              </td>
            </tr>
          ) : (
            transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.desc}</td>
                <td>{transaction.keyword}</td>
                <td>{transaction.category}</td>
                <td>
                  <span className={`${styles.confidenceLevel} ${styles[transaction.confidence]}`}>
                    {transaction.confidence.charAt(0).toUpperCase() + transaction.confidence.slice(1)} ({transaction.score}%)
                  </span>
                </td>
                <td>
                  {transaction.status === 'Validado' ? (
                    <span className={styles.statusBadge}>Validado</span>
                  ) : (
                    <div className={styles.rowActions}>
                      <button
                        className={`${styles.btn} ${styles.btnValidate}`}
                        onClick={() => onValidate(transaction.id)}
                      >
                        Validar
                      </button>
                      <button
                        className={`${styles.btn} ${styles.btnCorrect}`}
                        onClick={() => onCorrect(transaction.id)}
                      >
                        Corregir
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SupervisionTable;
