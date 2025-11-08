import { useMemo } from 'react';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import UserDashboard from './pages/UserDashboard';
import styles from './App.module.css';

const ROUTES = {
  '/': Home,
  '/admin/dashboard': AdminDashboard,
  '/user/dashboard': UserDashboard,
};

const normalisePath = (path) => {
  if (!path) {
    return '/';
  }

  const withoutTrailing = path !== '/' ? path.replace(/\/+$/, '') : path;
  return withoutTrailing || '/';
};

function App() {
  const ActivePage = useMemo(() => {
    if (typeof window === 'undefined') {
      return Home;
    }

    const currentPath = normalisePath(window.location.pathname);
    return ROUTES[currentPath] ?? Home;
  }, []);

  return (
    <div className={styles.app}>
      <ActivePage />
    </div>
  );
}

export default App;
