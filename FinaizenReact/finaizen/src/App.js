import { useCallback, useEffect, useState } from 'react';
import Home from './pages/Home';
import LegacyFrame from './components/LegacyFrame';
import legacyRouteGroups, { legacyRouteMap } from './routes/legacyRoutes';
import styles from './App.module.css';

const HOME_PATH = '/';

function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname || HOME_PATH);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || HOME_PATH);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (currentPath !== HOME_PATH && !legacyRouteMap[currentPath]) {
      window.history.replaceState(null, '', HOME_PATH);
      setCurrentPath(HOME_PATH);
    }
  }, [currentPath]);

  const navigate = useCallback(
    (to, options = {}) => {
      if (to === currentPath) {
        return;
      }

      const method = options.replace ? 'replaceState' : 'pushState';
      window.history[method](null, '', to);
      setCurrentPath(to);
    },
    [currentPath]
  );

  const activeRoute = legacyRouteMap[currentPath];

  return (
    <div className={styles.app}>
      {activeRoute ? (
        <LegacyFrame
          key={activeRoute.path}
          src={activeRoute.htmlPath}
          title={activeRoute.title}
          currentPath={currentPath}
          onNavigate={navigate}
        />
      ) : (
        <Home onNavigate={navigate} legacyGroups={legacyRouteGroups} />
      )}
    </div>
  );
}

export default App;
