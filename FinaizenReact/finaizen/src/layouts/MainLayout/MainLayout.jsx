import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import styles from './MainLayout.module.css';

const MainLayout = ({ children }) => (
  <div className={styles.layout}>
    <Header />
    <div className={styles.contentArea}>
      <Sidebar />
      <main className={styles.mainContent}>{children}</main>
    </div>
  </div>
);

export default MainLayout;
