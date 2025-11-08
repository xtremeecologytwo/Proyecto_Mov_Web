import legacyRouteGroups from '../../routes/legacyRoutes';
import styles from './LegacyFrame.module.css';

const LegacyFrame = ({ src, title, currentPath, onNavigate }) => {
  const handleNavigate = (event) => {
    onNavigate(event.target.value);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => onNavigate('/')}
          >
            ← Volver al inicio
          </button>
          <h1 className={styles.title}>{title}</h1>
        </div>
        <div className={styles.selectorGroup}>
          <label className={styles.selectorLabel} htmlFor="legacy-page-selector">
            Cambiar página
          </label>
          <select
            id="legacy-page-selector"
            className={styles.selector}
            value={currentPath}
            onChange={handleNavigate}
          >
            <option value="/">Inicio moderno</option>
            {legacyRouteGroups.map((group) => (
              <optgroup key={group.title} label={group.title}>
                {group.routes.map((route) => (
                  <option key={route.path} value={route.path}>
                    {route.title}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </header>
      <div className={styles.frameWrapper}>
        <iframe
          title={title}
          src={src}
          className={styles.frame}
          sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
        />
      </div>
    </div>
  );
};

export default LegacyFrame;
