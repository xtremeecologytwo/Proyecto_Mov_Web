import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../components/layout/Sidebar';
import SupervisionKPIs from '../../../components/supervision/SupervisionKPIs';
import AITestField from '../../../components/supervision/AITestField';
import SupervisionCharts from '../../../components/supervision/SupervisionCharts';
import SupervisionFilters from '../../../components/supervision/SupervisionFilters';
import SupervisionTable from '../../../components/supervision/SupervisionTable';
import CorrectionModal from '../../../components/supervision/CorrectionModal';
import { transactionsData, kpiData, chartData, categories } from '../../../utils/supervisionData';
import styles from './SupervisionCategorias.module.css';

function SupervisionCategorias() {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Estados
  const [transactions, setTransactions] = useState(transactionsData);
  const [filteredTransactions, setFilteredTransactions] = useState(transactionsData);
  const [correctionModalOpen, setCorrectionModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  
  // Filtros
  const [confidenceFilter, setConfidenceFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Configuración del menú
  const adminMenuItems = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Gestión de Usuarios', path: '/admin/gestion-usuarios' },
    { label: 'Gestión de Roles', path: '/admin/gestion-roles' },
    { label: 'Supervisión de Categorías', path: '/admin/supervision-categorias' },
    { label: 'Registro de Seguridad', path: '/admin/registro-seguridad' },
    { label: 'Inteligencia de Mercado', path: '/admin/inteligencia-mercado' },
    { label: 'Reportes y Soporte', path: '/admin/reportes-soporte' }
  ];

  const userMenuItems = [
    { label: 'Mi Perfil', path: '/user/config/cuenta', icon: '👤' },
    { label: 'Configuración', path: '/user/config/seguridad', icon: '⚙️' }
  ];

  // Proteger ruta
  useEffect(() => {
    if (!currentUser || !isAdmin) {
      navigate('/login');
    }
  }, [currentUser, isAdmin, navigate]);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...transactions];

    // Filtrar por confianza
    if (confidenceFilter !== 'todos') {
      filtered = filtered.filter(t => t.confidence === confidenceFilter);
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.desc.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  }, [confidenceFilter, searchTerm, transactions]);

  // Handlers
  const handleValidate = (transactionId) => {
    setTransactions(prev => prev.map(t =>
      t.id === transactionId ? { ...t, status: 'Validado' } : t
    ));
  };

  const handleCorrect = (transactionId) => {
    const transaction = transactions.find(t => t.id === transactionId);
    setSelectedTransaction(transaction);
    setCorrectionModalOpen(true);
  };

  const handleSaveCorrection = (transactionId, formData) => {
    setTransactions(prev => prev.map(t =>
      t.id === transactionId
        ? { ...t, keyword: formData.keyword, category: formData.category, status: 'Validado' }
        : t
    ));
    
    if (formData.createRule) {
      alert(`Regla creada: "${formData.keyword}" → "${formData.category}"`);
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar
        menuItems={adminMenuItems}
        userMenuItems={userMenuItems}
        variant="admin"
        onCollapsedChange={setIsCollapsed}
      />

      <main className={`${styles.mainContent} ${isCollapsed ? styles.expanded : ''}`}>
        <h1>Supervisión de Categorías</h1>

        <SupervisionKPIs
          precision={kpiData.precision}
          corrections={kpiData.corrections}
          problematicCategories={kpiData.problematicCategories}
        />

        <AITestField />

        <SupervisionCharts
          confidenceData={chartData.confidence}
          correctionsData={chartData.corrections}
          isCollapsed={isCollapsed}
        />

        <section className={styles.tableSection}>
          <SupervisionFilters
            onConfidenceFilter={setConfidenceFilter}
            onSearch={setSearchTerm}
          />

          <SupervisionTable
            transactions={filteredTransactions}
            onValidate={handleValidate}
            onCorrect={handleCorrect}
          />
        </section>

        <CorrectionModal
          isOpen={correctionModalOpen}
          onClose={() => setCorrectionModalOpen(false)}
          transaction={selectedTransaction}
          categories={categories}
          onSave={handleSaveCorrection}
        />
      </main>
    </div>
  );
}

export default SupervisionCategorias;
