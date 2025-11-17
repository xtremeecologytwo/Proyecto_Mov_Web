import { useState } from 'react';
import styles from './MarketFilters.module.css';

/**
 * MarketFilters - Filtros principales para inteligencia de mercado
 */
function MarketFilters({ 
  ageOptions, 
  locationOptions, 
  selectedAge, 
  selectedLocation, 
  onAgeChange, 
  onLocationChange,
  showComparison,
  onComparisonToggle,
  onDownloadCSV 
}) {
  return (
    <section className={styles.filtersContainer}>
      <div className={styles.mainFilters}>
        <div className={styles.filterGroup}>
          <h3>Filtros Principales</h3>
          
          <div className={styles.filterItem}>
            <label htmlFor="age-range-1">Rango de edad</label>
            <select 
              id="age-range-1" 
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
            <label htmlFor="location-1">Ubicación</label>
            <select 
              id="location-1" 
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

        <button className={styles.downloadBtn} onClick={onDownloadCSV}>
          Descargar CSV
        </button>
      </div>

      <div className={styles.comparisonControls}>
        <label>
          <input 
            type="checkbox" 
            checked={showComparison} 
            onChange={(e) => onComparisonToggle(e.target.checked)}
          />
          Comparar con otro grupo
        </label>
      </div>
    </section>
  );
}

export default MarketFilters;
