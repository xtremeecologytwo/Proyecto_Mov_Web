import Header from '../../components/common/Header';
import styles from './MainLayout.module.css';

const MainLayout = ({ children }) => (
  <div className={styles.layout}>
    <Header />
    <main className={styles.mainContent}>{children}</main>
  </div>
);

export default MainLayout;
