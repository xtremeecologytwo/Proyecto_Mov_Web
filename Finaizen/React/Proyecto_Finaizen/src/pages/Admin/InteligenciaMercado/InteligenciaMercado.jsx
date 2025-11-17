import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../components/layout/Sidebar';
import MarketFilters from '../../../components/market/MarketFilters';
import ComparisonFilters from '../../../components/market/ComparisonFilters';
import TopCategoriesChart from '../../../components/market/TopCategoriesChart';
import IncomeSourceChart from '../../../components/market/IncomeSourceChart';
import TrendsChart from '../../../components/market/TrendsChart';
import InsightsCard from '../../../components/market/InsightsCard';
import { 
  mockMarketDatabase, 
  expenseLabels, 
  incomeLabels, 
  trendLabels,
  ageOptions,
  locationOptions 
} from '../../../utils/marketIntelligenceData';
import styles from './InteligenciaMercado.module.css';

/**
 * InteligenciaMercado - Página de análisis de inteligencia de mercado
 */
function InteligenciaMercado() {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Filtros principales
  const [age1, setAge1] = useState('18-25');
  const [location1, setLocation1] = useState('quito');

  // Filtros de comparación
  const [showComparison, setShowComparison] = useState(false);
  const [age2, setAge2] = useState('26-35');
  const [location2, setLocation2] = useState('quito');

  // Datos computados
  const [chartData, setChartData] = useState({
    expenses: [],
    income: [],
    trends: { income: [], expenses: [] }
  });
  const [insightText, setInsightText] = useState('');

  // Proteger ruta
  useEffect(() => {
    if (!currentUser || !isAdmin) {
      navigate('/login');
    }
  }, [currentUser, isAdmin, navigate]);

  // Actualizar dashboard cuando cambien los filtros
  useEffect(() => {
    if (!currentUser || !isAdmin) return;

    const dataGroup1 = mockMarketDatabase[location1][age1];
    const label1 = `${ageOptions.find(o => o.value === age1)?.label} en ${locationOptions.find(o => o.value === location1)?.label}`;

    const expensesDatasets = [{
      label: label1,
      data: dataGroup1.expenses
    }];

    if (showComparison) {
      const dataGroup2 = mockMarketDatabase[location2][age2];
      const label2 = `${ageOptions.find(o => o.value === age2)?.label} en ${locationOptions.find(o => o.value === location2)?.label}`;
      
      expensesDatasets.push({
        label: label2,
        data: dataGroup2.expenses
      });
    }

    setChartData({
      expenses: expensesDatasets,
      income: dataGroup1.incomeSources,
      trends: dataGroup1.trends
    });

    // Generar insight
    generateInsight(expensesDatasets, dataGroup1.incomeSources);
  }, [age1, location1, age2, location2, showComparison, currentUser, isAdmin]);

  const generateInsight = (expensesDatasets, incomeData) => {
    const ds1 = expensesDatasets[0];
    const topCat1 = expenseLabels[ds1.data.indexOf(Math.max(...ds1.data))];
    const topIncome = incomeLabels[incomeData.indexOf(Math.max(...incomeData))];
    
    let insight = `Para el grupo <strong>${ds1.label}</strong>, la categoría con mayor gasto es <strong>${topCat1}</strong>. Su principal fuente de ingresos es <strong>${topIncome}</strong>.`;

    if (showComparison && expensesDatasets.length > 1) {
      const ds2 = expensesDatasets[1];
      const topCat2 = expenseLabels[ds2.data.indexOf(Math.max(...ds2.data))];
      insight += `<br><br>En comparación, para <strong>${ds2.label}</strong>, la categoría principal es <strong>${topCat2}</strong>.`;
    }

    setInsightText(insight);
  };

  const downloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Header
    const header = ['Categoría'];
    chartData.expenses.forEach(ds => header.push(ds.label + ' (USD)'));
    csvContent += header.join(",") + "\r\n";

    // Rows
    expenseLabels.forEach((label, index) => {
      const row = [label];
      chartData.expenses.forEach(ds => {
        row.push(ds.data[index]);
      });
      csvContent += row.map(cell => `"${cell}"`).join(",") + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inteligencia_de_mercado.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    { label: 'Mi Perfil', path: '/config/perfil', icon: '👤' },
    { label: 'Configuración', path: '/config/cuenta', icon: '⚙️' }
  ];

  if (!currentUser || !isAdmin) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Sidebar 
        menuItems={adminMenuItems}
        userMenuItems={userMenuItems}
        variant="admin"
        onCollapsedChange={setIsCollapsed}
      />

      <main className={`${styles.mainContent} ${isCollapsed ? styles.expanded : ''}`}>
        <MarketFilters
          ageOptions={ageOptions}
          locationOptions={locationOptions}
          selectedAge={age1}
          selectedLocation={location1}
          onAgeChange={setAge1}
          onLocationChange={setLocation1}
          showComparison={showComparison}
          onComparisonToggle={setShowComparison}
          onDownloadCSV={downloadCSV}
        />

        <ComparisonFilters
          ageOptions={ageOptions}
          locationOptions={locationOptions}
          selectedAge={age2}
          selectedLocation={location2}
          onAgeChange={setAge2}
          onLocationChange={setLocation2}
          show={showComparison}
        />

        <div className={styles.chartsGrid}>
          <TopCategoriesChart
            labels={expenseLabels}
            datasets={chartData.expenses}
          />

          <IncomeSourceChart
            labels={incomeLabels}
            data={chartData.income}
          />

          <TrendsChart
            labels={trendLabels}
            incomeData={chartData.trends.income}
            expensesData={chartData.trends.expenses}
          />
        </div>

        <InsightsCard insightText={insightText} />
      </main>
    </div>
  );
}

export default InteligenciaMercado;
