import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Sidebar from '../../../components/layout/Sidebar';
import SupportKPIs from '../../../components/support/SupportKPIs';
import SupportFilters from '../../../components/support/SupportFilters';
import SupportTable from '../../../components/support/SupportTable';
import AssignModal from '../../../components/support/AssignModal';
import ViewModal from '../../../components/support/ViewModal';
import { supportTickets as initialTickets, kpiData, assignOptions } from '../../../utils/supportData';
import styles from './ReportesSoporte.module.css';

const ReportesSoporte = () => {
  const { currentUser, isAdmin } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [tickets, setTickets] = useState(initialTickets);
  const [statusFilter, setStatusFilter] = useState('todos');
  const [searchValue, setSearchValue] = useState('');
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

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

  // Filtrar tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = statusFilter === 'todos' || ticket.status === statusFilter;
    const matchesSearch = 
      ticket.user.toLowerCase().includes(searchValue.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchValue.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleViewClick = (ticket) => {
    setSelectedTicket(ticket);
    setViewModalOpen(true);
  };

  const handleAssignClick = (ticket) => {
    setSelectedTicket(ticket);
    setAssignModalOpen(true);
  };

  const handleAssignSave = (ticketId, assignTo) => {
    console.log(`Ticket ${ticketId} asignado a: ${assignTo}`);
    setAssignModalOpen(false);
    setSelectedTicket(null);
  };

  const handleCloseAssignModal = () => {
    setAssignModalOpen(false);
    setSelectedTicket(null);
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedTicket(null);
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
        <SupportKPIs data={kpiData} />
        
        <section className={styles.card}>
          <SupportFilters
            statusFilter={statusFilter}
            searchValue={searchValue}
            onStatusChange={setStatusFilter}
            onSearchChange={setSearchValue}
          />
          <SupportTable 
            tickets={filteredTickets}
            onViewClick={handleViewClick}
            onAssignClick={handleAssignClick}
          />
        </section>
      </main>

      <AssignModal
        isOpen={assignModalOpen}
        ticket={selectedTicket}
        assignOptions={assignOptions}
        onSave={handleAssignSave}
        onCancel={handleCloseAssignModal}
      />

      <ViewModal
        isOpen={viewModalOpen}
        ticket={selectedTicket}
        onClose={handleCloseViewModal}
      />
    </div>
  );
};

export default ReportesSoporte;
