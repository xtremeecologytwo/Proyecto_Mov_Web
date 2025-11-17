import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import mockDB from '../../../utils/mockDatabase';
import { Sidebar } from '../../../components/layout';
import { Button, Toast, ConfirmDialog } from '../../../components/ui';
import styles from './AdministrarRegistros.module.css';

/**
 * Página de Administrador de Registros
 * Permite visualizar, editar y eliminar ingresos y egresos
 */
function AdministrarRegistros() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, currentPerfil, loading: authLoading } = useAuth();
  
  // Menú items para el Sidebar de Usuario
  const userMenuItems = [
    { label: 'Dashboard', path: '/user/dashboard' },
    { label: 'Administrador ingresos/egresos', path: '/user/administrar-registros' },
    { label: 'Plan de Ahorros', path: '/user/plan-ahorro' },
    { label: 'Ajuste de presupuestos', path: '/user/presupuestos' },
    { label: 'Planificador de deudas', path: '/user/planificador-deudas' },
    { label: 'Logros y Recompensas', path: '/user/logros' },
  ];

  // Menú dropdown del usuario
  const userDropdownItems = [
    { icon: '👤', label: 'Mi Cuenta', path: '/user/config/cuenta' },
    { icon: '👥', label: 'Perfiles', path: '/user/config/perfiles' },
    { icon: '🔔', label: 'Notificaciones', path: '/user/config/notificaciones' },
    { icon: '🔒', label: 'Seguridad', path: '/user/config/seguridad' },
    { icon: '❓', label: 'Ayuda', path: '/user/config/ayuda' },
  ];
  
  // Estados
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [ingresos, setIngresos] = useState([]);
  const [egresos, setEgresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Estados de filtros
  const [filterBy, setFilterBy] = useState('todos'); // 'todos' | 'mensual' | 'semanal' | 'diario' | 'ocasional'
  const [sortBy, setSortBy] = useState('fecha'); // 'fecha' | 'monto-asc' | 'monto-desc'

  // Estados para modal de edición
  const [editingRecord, setEditingRecord] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Estados para diálogo de confirmación
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  // Estado para vista móvil (switch entre ingresos/egresos)
  const [mobileView, setMobileView] = useState('ingresos'); // 'ingresos' | 'egresos'

  // Detectar notificación del navigation state (cuando se regresa de editar)
  useEffect(() => {
    if (location.state?.notification) {
      setToast(location.state.notification);
      // Limpiar el estado de navegación
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Cargar datos al montar el componente
  useEffect(() => {
    if (authLoading) return;

    if (!currentUser || !currentPerfil) {
      navigate('/login');
      return;
    }

    loadRecords();
  }, [currentPerfil, authLoading, currentUser, navigate]);

  /**
   * Carga los ingresos y egresos del perfil actual
   */
  const loadRecords = () => {
    try {
      // Filtrar ingresos del perfil (excluyendo ocasionales)
      const perfilIngresos = mockDB.ingresos.filter(
        ing => currentPerfil.ingresos.includes(ing.id) && ing.frecuencia !== 'ocasional'
      );

      // Filtrar egresos del perfil (excluyendo ocasionales)
      const perfilEgresos = mockDB.egresos.filter(
        eg => currentPerfil.egresos.includes(eg.id) && eg.frecuencia !== 'ocasional'
      );

      setIngresos(perfilIngresos);
      setEgresos(perfilEgresos);
    } catch (error) {
      console.error('Error al cargar registros:', error);
      setToast({
        type: 'error',
        message: 'Error al cargar los registros'
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Aplica filtros y ordenamiento a una lista de registros
   */
  const applyFiltersAndSort = (records) => {
    let filtered = [...records];

    // Aplicar filtro por frecuencia
    if (filterBy !== 'todos') {
      filtered = filtered.filter(rec => rec.frecuencia === filterBy);
    }

    // Aplicar ordenamiento
    switch (sortBy) {
      case 'fecha':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'monto-asc':
        filtered.sort((a, b) => a.monto - b.monto);
        break;
      case 'monto-desc':
        filtered.sort((a, b) => b.monto - a.monto);
        break;
      default:
        break;
    }

    return filtered;
  };

  /**
   * Obtiene el texto descriptivo de la frecuencia
   */
  const getFrequencyText = (record) => {
    switch (record.frecuencia) {
      case 'mensual':
        return `El día ${record.diaMes} de cada mes`;
      case 'semanal':
        const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const dias = record.diasSemana.map(d => diasSemana[d]).join(', ');
        return `Cada ${dias}`;
      case 'diario':
        return 'Todos los días';
      case 'ocasional':
        return 'Ocasional';
      case 'anual':
        return `El ${record.diaAnio.dia}/${record.diaAnio.mes} de cada año`;
      default:
        return '';
    }
  };

  /**
   * Maneja la eliminación de un registro
   */
  const handleDelete = (record, tipo) => {
    setRecordToDelete({ record, tipo });
    setShowConfirmDialog(true);
  };

  /**
   * Confirma la eliminación de un registro
   */
  const confirmDelete = () => {
    if (!recordToDelete) return;

    const { record, tipo } = recordToDelete;

    try {
      if (tipo === 'ingreso') {
        // Eliminar del array de ingresos
        const index = mockDB.ingresos.findIndex(i => i.id === record.id);
        if (index > -1) {
          mockDB.ingresos.splice(index, 1);
        }
        // Eliminar del perfil
        currentPerfil.eliminarIngreso(record.id);
        
        // Actualizar estado local inmediatamente
        setIngresos(prev => prev.filter(i => i.id !== record.id));
      } else {
        // Eliminar del array de egresos
        const index = mockDB.egresos.findIndex(e => e.id === record.id);
        if (index > -1) {
          mockDB.egresos.splice(index, 1);
        }
        // Eliminar del perfil
        currentPerfil.eliminarEgreso(record.id);
        
        // Actualizar estado local inmediatamente
        setEgresos(prev => prev.filter(e => e.id !== record.id));
      }

      // Guardar en localStorage
      mockDB.saveToLocalStorage();

      setToast({
        type: 'success',
        message: `${tipo === 'ingreso' ? 'Ingreso' : 'Egreso'} eliminado exitosamente`
      });
    } catch (error) {
      console.error('Error al eliminar registro:', error);
      setToast({
        type: 'error',
        message: 'Error al eliminar el registro'
      });
    } finally {
      setShowConfirmDialog(false);
      setRecordToDelete(null);
    }
  };

  /**
   * Maneja la edición de un registro
   */
  const handleEdit = (record, tipo) => {
    // Redirigir a la página de edición correspondiente con el ID
    if (tipo === 'ingreso') {
      navigate(`/user/nuevo-ingreso?edit=${record.id}`);
    } else {
      navigate(`/user/nuevo-egreso?edit=${record.id}`);
    }
  };

  // Aplicar filtros y ordenamiento
  const filteredIngresos = applyFiltersAndSort(ingresos);
  const filteredEgresos = applyFiltersAndSort(egresos);

  if (authLoading || loading) {
    return (
      <div className={styles.adminPage}>
        <Sidebar 
          menuItems={userMenuItems} 
          userMenuItems={userDropdownItems} 
          variant="user"
          onCollapsedChange={setSidebarCollapsed}
        />
        <div className={`${styles.loadingContainer} ${sidebarCollapsed ? styles.collapsed : ''}`}>
          <p>Cargando registros...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || !currentPerfil) {
    return null;
  }

  return (
    <div className={styles.adminPage}>
      <Sidebar 
        menuItems={userMenuItems} 
        userMenuItems={userDropdownItems} 
        variant="user"
        onCollapsedChange={setSidebarCollapsed}
      />
      
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.collapsed : ''}`}>
        <div className={styles.recordsManager}>
          <h1>Administrar registros</h1>

          {/* Filtros y Ordenamiento */}
          <div className={styles.filtersContainer}>
            <div className={styles.filterGroup}>
              <label htmlFor="filter-by">Filtrar por:</label>
              <select 
                id="filter-by" 
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="mensual">Mensual</option>
                <option value="semanal">Semanal</option>
                <option value="diario">Diario</option>
                <option value="ocasional">Ocasional</option>
                <option value="anual">Anual</option>
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label htmlFor="sort-by">Ordenar por:</label>
              <select 
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="fecha">Fecha</option>
                <option value="monto-asc">Monto (menor a mayor)</option>
                <option value="monto-desc">Monto (mayor a menor)</option>
              </select>
            </div>
          </div>

          {/* Switch para vista móvil */}
          <div className={styles.mobileSwitch}>
            <button
              className={`${styles.switchButton} ${mobileView === 'ingresos' ? styles.active : ''}`}
              onClick={() => setMobileView('ingresos')}
            >
              💰 Ingresos
            </button>
            <button
              className={`${styles.switchButton} ${mobileView === 'egresos' ? styles.active : ''}`}
              onClick={() => setMobileView('egresos')}
            >
              💸 Egresos
            </button>
          </div>

          {/* Columnas de Ingresos y Egresos */}
          <div className={styles.recordsColumns}>
            {/* Columna de Ingresos */}
            <div className={`${styles.column} ${styles.ingresosColumn} ${mobileView === 'ingresos' ? styles.mobileActive : ''}`}>
              <h2>Ingresos:</h2>
              <div className={styles.recordsList}>
                {filteredIngresos.length === 0 ? (
                  <p className={styles.emptyMessage}>No hay ingresos registrados</p>
                ) : (
                  filteredIngresos.map(ingreso => (
                    <div key={ingreso.id} className={styles.recordCard}>
                      <div className={styles.recordInfo}>
                        <h3>{ingreso.descripcion}</h3>
                        <p>{getFrequencyText(ingreso)}</p>
                      </div>
                      <div className={styles.recordDetails}>
                        <span className={`${styles.amount} ${styles.positive}`}>
                          + {currentPerfil.simboloMoneda}{ingreso.monto.toFixed(2)}
                        </span>
                        <div className={styles.recordActions}>
                          <a 
                            href="#" 
                            className={styles.edit}
                            onClick={(e) => {
                              e.preventDefault();
                              handleEdit(ingreso, 'ingreso');
                            }}
                          >
                            Editar
                          </a>
                          <a 
                            href="#" 
                            className={styles.delete}
                            onClick={(e) => {
                              e.preventDefault();
                              handleDelete(ingreso, 'ingreso');
                            }}
                          >
                            Eliminar
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Botón de acción dentro de la columna de Ingresos */}
              <div className={styles.columnAction}>
                <Button
                  variant="primary"
                  onClick={() => navigate('/user/nuevo-ingreso')}
                  className={styles.btnIncome}
                >
                  Crear nuevo ingreso
                </Button>
              </div>
            </div>

            {/* Columna de Egresos */}
            <div className={`${styles.column} ${styles.egresosColumn} ${mobileView === 'egresos' ? styles.mobileActive : ''}`}>
              <h2>Egresos:</h2>
              <div className={styles.recordsList}>
                {filteredEgresos.length === 0 ? (
                  <p className={styles.emptyMessage}>No hay egresos registrados</p>
                ) : (
                  filteredEgresos.map(egreso => (
                    <div key={egreso.id} className={styles.recordCard}>
                      <div className={styles.recordInfo}>
                        <h3>{egreso.descripcion}</h3>
                        <p>{getFrequencyText(egreso)}</p>
                      </div>
                      <div className={styles.recordDetails}>
                        <span className={`${styles.amount} ${styles.negative}`}>
                          - {currentPerfil.simboloMoneda}{egreso.monto.toFixed(2)}
                        </span>
                        <div className={styles.recordActions}>
                          <a 
                            href="#" 
                            className={styles.edit}
                            onClick={(e) => {
                              e.preventDefault();
                              handleEdit(egreso, 'egreso');
                            }}
                          >
                            Editar
                          </a>
                          <a 
                            href="#" 
                            className={styles.delete}
                            onClick={(e) => {
                              e.preventDefault();
                              handleDelete(egreso, 'egreso');
                            }}
                          >
                            Eliminar
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Botón de acción dentro de la columna de Egresos */}
              <div className={styles.columnAction}>
                <Button
                  variant="danger"
                  onClick={() => navigate('/user/nuevo-egreso')}
                  className={styles.btnExpense}
                >
                  Crear nuevo egreso
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diálogo de Confirmación */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Confirmar eliminación"
        message={`¿Estás seguro de que quieres eliminar "${recordToDelete?.record?.descripcion}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowConfirmDialog(false);
          setRecordToDelete(null);
        }}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
          duration={5000}
        />
      )}
    </div>
  );
}

export default AdministrarRegistros;
