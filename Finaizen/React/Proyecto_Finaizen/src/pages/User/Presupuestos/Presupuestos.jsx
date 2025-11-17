import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../../components/layout/Sidebar';
import Toast from '../../../components/ui/Toast';
import PresupuestoCard from '../../../components/ui/PresupuestoCard';
import BudgetModal from '../../../components/modals/BudgetModal';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import Button from '../../../components/ui/Button';
import mockDB from '../../../utils/mockDatabase';
import { userSidebarMenuItems, userDropdownMenuItems } from '../../../config/sidebarConfig';
import styles from './Presupuestos.module.css';

/**
 * Página de gestión de presupuestos
 */
export default function Presupuestos() {
  const { currentPerfil } = useAuth();
  const location = useLocation();

  const [presupuestos, setPresupuestos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPresupuesto, setEditingPresupuesto] = useState(null);
  const [deletingPresupuesto, setDeletingPresupuesto] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [filtro, setFiltro] = useState('todos'); // 'todos', 'mensual', 'semanal', 'anual'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    cargarPresupuestos();
  }, [currentPerfil]);

  // Mostrar toast si viene de otra página
  useEffect(() => {
    if (location.state?.message) {
      showToast(location.state.message, location.state.type || 'success');
      // Limpiar el state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const cargarPresupuestos = () => {
    if (!currentPerfil) return;

    const todosPresupuestos = mockDB.presupuestos;
    const historial = mockDB.historial;

    // Filtrar presupuestos del perfil actual y del mes/año actual
    const fecha = new Date();
    const mesActual = fecha.getMonth() + 1;
    const anioActual = fecha.getFullYear();

    const presupuestosPerfil = todosPresupuestos.filter(
      p => p.perfilId === currentPerfil.id && 
           p.mes === mesActual && 
           p.anio === anioActual &&
           p.activo
    );

    // Calcular el gasto real de cada presupuesto basado en el historial del mes actual
    const presupuestosConGastoReal = presupuestosPerfil.map(presupuesto => {
      const gastosCategoria = historial.filter(h =>
        h.perfilId === currentPerfil.id &&
        h.tipo === 'egreso' &&
        h.categoria === presupuesto.categoria &&
        h.mes === mesActual &&
        h.anio === anioActual
      );

      const montoGastadoReal = gastosCategoria.reduce((sum, h) => sum + h.monto, 0);
      const porcentajeGastado = presupuesto.montoLimite > 0 
        ? Math.round((montoGastadoReal / presupuesto.montoLimite) * 100)
        : 0;

      let estado;
      if (porcentajeGastado >= 100) {
        estado = 'danger';
      } else if (porcentajeGastado >= presupuesto.alertaEn) {
        estado = 'warning';
      } else if (porcentajeGastado >= 50) {
        estado = 'neutral';
      } else {
        estado = 'ok';
      }

      return {
        ...presupuesto,
        montoGastado: montoGastadoReal,
        porcentajeGastado,
        estado
      };
    });

    setPresupuestos(presupuestosConGastoReal);
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleAddNew = () => {
    setEditingPresupuesto(null);
    setShowModal(true);
  };

  const handleEdit = (presupuesto) => {
    setEditingPresupuesto(presupuesto);
    setShowModal(true);
  };

  const handleDelete = (presupuesto) => {
    setDeletingPresupuesto(presupuesto);
  };

  const confirmDelete = () => {
    if (!deletingPresupuesto) return;

    // Marcar como inactivo en lugar de eliminar
    const index = mockDB.presupuestos.findIndex(p => p.id === deletingPresupuesto.id);
    if (index !== -1) {
      mockDB.presupuestos[index].activo = false;
      cargarPresupuestos();
      showToast('Presupuesto eliminado correctamente', 'success');
    }

    setDeletingPresupuesto(null);
  };

  const handleSave = (budgetData) => {
    const fecha = new Date();
    const mesActual = fecha.getMonth() + 1;
    const anioActual = fecha.getFullYear();

    if (editingPresupuesto) {
      // Modo edición
      const index = mockDB.presupuestos.findIndex(p => p.id === editingPresupuesto.id);
      if (index !== -1) {
        mockDB.presupuestos[index] = {
          ...mockDB.presupuestos[index],
          ...budgetData,
          fechaModificacion: new Date().toISOString()
        };
        cargarPresupuestos();
        showToast('Presupuesto actualizado correctamente', 'success');
      }
    } else {
      // Modo creación
      // Verificar si ya existe un presupuesto activo para esta categoría en este mes
      const existente = mockDB.presupuestos.find(
        p => p.perfilId === currentPerfil.id &&
             p.categoria === budgetData.categoria &&
             p.mes === mesActual &&
             p.anio === anioActual &&
             p.activo
      );

      if (existente) {
        showToast(`Ya existe un presupuesto activo para la categoría "${budgetData.categoria}" este mes`, 'error');
        return;
      }

      const nuevoPresupuesto = {
        id: Date.now(),
        perfilId: currentPerfil.id,
        ...budgetData,
        mes: mesActual,
        anio: anioActual,
        montoGastado: 0,
        porcentajeGastado: 0,
        estado: 'ok',
        activo: true,
        fechaCreacion: new Date().toISOString()
      };

      mockDB.presupuestos.push(nuevoPresupuesto);
      cargarPresupuestos();
      showToast('Presupuesto creado correctamente', 'success');
    }

    setShowModal(false);
    setEditingPresupuesto(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPresupuesto(null);
  };

  // Filtrar presupuestos por periodo
  const presupuestosFiltrados = presupuestos.filter(p => {
    if (filtro === 'todos') return true;
    return p.periodo === filtro;
  });

  return (
    <div className={styles.container}>
      <Sidebar 
        menuItems={userSidebarMenuItems}
        userMenuItems={userDropdownMenuItems}
        variant="user"
        onCollapsedChange={setSidebarCollapsed}
      />
      
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1>💰 Presupuestos</h1>
            <p className={styles.subtitle}>
              Gestiona tus presupuestos por categoría
            </p>
          </div>
          <Button 
            variant="primary" 
            onClick={handleAddNew}
            className={styles.addButton}
          >
            ➕ Agregar Presupuesto
          </Button>
        </div>

        {/* Filtros */}
        <div className={styles.filters}>
          <button 
            className={`${styles.filterButton} ${filtro === 'todos' ? styles.active : ''}`}
            onClick={() => setFiltro('todos')}
          >
            Todos
          </button>
          <button 
            className={`${styles.filterButton} ${filtro === 'mensual' ? styles.active : ''}`}
            onClick={() => setFiltro('mensual')}
          >
            Mensuales
          </button>
          <button 
            className={`${styles.filterButton} ${filtro === 'semanal' ? styles.active : ''}`}
            onClick={() => setFiltro('semanal')}
          >
            Semanales
          </button>
          <button 
            className={`${styles.filterButton} ${filtro === 'anual' ? styles.active : ''}`}
            onClick={() => setFiltro('anual')}
          >
            Anuales
          </button>
        </div>

        {/* Lista de presupuestos */}
        <div className={styles.budgetList}>
          {presupuestosFiltrados.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📊</div>
              <h3>No hay presupuestos {filtro !== 'todos' ? `${filtro}es` : ''}</h3>
              <p>{filtro === 'todos' ? 'Comienza agregando un presupuesto para controlar tus gastos' : `No tienes presupuestos ${filtro}es configurados`}</p>
              <Button variant="primary" onClick={handleAddNew}>
                ➕ Crear presupuesto
              </Button>
            </div>
          ) : (
            <div className={styles.budgetGrid}>
              {presupuestosFiltrados.map(presupuesto => (
                <PresupuestoCard
                  key={presupuesto.id}
                  presupuesto={presupuesto}
                  simboloMoneda={currentPerfil.simboloMoneda}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  showActions={true}
                  compact={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de creación/edición */}
      <BudgetModal
        isOpen={showModal}
        presupuesto={editingPresupuesto}
        onSave={handleSave}
        onCancel={handleCloseModal}
        simboloMoneda={currentPerfil?.simboloMoneda || '$'}
      />

      {/* Diálogo de confirmación para eliminar */}
      <ConfirmDialog
        isOpen={deletingPresupuesto !== null}
        title="Eliminar Presupuesto"
        message={`¿Estás seguro de que deseas eliminar el presupuesto de "${deletingPresupuesto?.categoria}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeletingPresupuesto(null)}
      />

      {/* Toast de notificaciones */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'success' })}
        />
      )}
    </div>
  );
}
