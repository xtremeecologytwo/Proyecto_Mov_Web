import styles from './ComparisonFilters.module.css';

/**
 * ComparisonFilters - Filtros secundarios para comparación
 */
function ComparisonFilters({ 
  ageOptions, 
  locationOptions, 
  selectedAge, 
  selectedLocation, 
  onAgeChange, 
  onLocationChange,
  show 
}) {
  if (!show) return null;

  return (
    <div className={styles.comparisonFiltersContainer}>
      <div className={styles.filterGroup}>
        <h3>Filtros de Comparación</h3>
        
        <div className={styles.filterItem}>
          <label htmlFor="age-range-2">Rango de edad</label>
          <select 
            id="age-range-2" 
            value={selectedAge} 
            onChange={(e) => onAgeChange(e.target.value)}
          >
            {ageOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterItem}>
          <label htmlFor="location-2">Ubicación</label>
          <select 
            id="location-2" 
            value={selectedLocation} 
            onChange={(e) => onLocationChange(e.target.value)}
          >
            {locationOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default ComparisonFilters;
