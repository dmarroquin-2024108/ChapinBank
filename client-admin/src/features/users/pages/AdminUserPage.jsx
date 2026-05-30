import { useState, useEffect, useMemo, useCallback } from 'react';
import { UserPlus, Search } from 'lucide-react';
import { useAdminStore } from '../../admin/store/adminStore.js';
import { useAuthStore } from '../../auth/store/authStore.js';
import { CreateUserModal } from '../components/CreateUserModal.jsx';
import { StatCard } from '../../admin/components/StatCard.jsx';
import { Users, UserCheck, UserX } from 'lucide-react';
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal.jsx';
import { UserTable } from '../components/UserTable.jsx';
import toast from 'react-hot-toast';

export const AdminUsersPage = () => {
  const { user } = useAuthStore();
  const { getUsers, deleteUser, users, loadings } = useAdminStore();
  const [showCreate, setShowCreate] = useState(false);
  const [confirmData, setConfirmData] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getUsers();
  }, [getUsers]);
  const safeUsers = Array.isArray(users) ? users : [];

  const filtered = useMemo(() => {
    if (!search.trim()) return safeUsers;
    const q = search.toLowerCase();
    return safeUsers.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.surname?.toLowerCase().includes(q) ||
        u.username?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
    );
  }, [search, safeUsers]);

  const stats = useMemo(
    () => ({
      total: safeUsers.length,
      active: safeUsers.filter((u) => u.status).length,
      pending: safeUsers.filter((u) => !u.status && !u.isDeleted).length,
      deleted: safeUsers.filter((u) => u.isDeleted).length,
    }),
    [safeUsers]
  );

  const handleDeleteConfirm = async () => {
    if (!confirmData) return;
    const { userId } = confirmData;
    setConfirmData(null);
    try {
      const response = await deleteUser(userId);
      if (response?.success) {
        toast.success('Usuario deshabilitado correctamente.');
      } else {
        toast.error(response?.error ?? 'Error al deshabilitar el usuario.');
      }
    } catch {
      toast.error('Error inesperado al deshabilitar el usuario.');
    }
  };

  const handleCreateClose = useCallback(
    (created = false) => {
      setShowCreate(false);
      if (created) getUsers();
    },
    [getUsers]
  );

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h1 className='text-xl font-bold text-[#0d1f35]'>Gestión de usuarios</h1>
        <p className='text-gray-400 text-sm mt-0.5'>
          Registra nuevos clientes y consulta los usuarios del banco
        </p>
      </div>

      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatCard
          title='Total'
          value={loadings.users ? '...' : stats.total}
          icon={Users}
          color='dark'
        />
        <StatCard
          title='Activos'
          value={loadings.users ? '...' : stats.active}
          icon={UserCheck}
          color='orange'
        />
        <StatCard
          title='Sin Activar'
          value={loadings.users ? '...' : stats.pending}
          icon={UserX}
          color='gold'
        />
        <StatCard
          title='Inhabilitados'
          value={loadings.users ? '...' : stats.deleted}
          icon={UserX}
          color='dark'
        />
      </div>

      <div className='flex items-center justify-between gap-4'>
        <div className='relative flex-1 max-w-sm'>
          <Search size={15} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
          <input
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Buscar por nombre, usuario o correo...'
            className='w-full pl-9 pr-4 py-2 bg-white text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange/40'
          />
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className='flex items-center gap-2 px-4 py-2 bg-orange text-white text-sm font-semibold rounded-xl hover:bg-[#c07018] transition shadow cursor-pointer shrink-0'
        >
          <UserPlus size={16} />
          Registrar usuario
        </button>
      </div>

      <UserTable
        users={filtered}
        loading={loadings.users}
        search={search}
        onDelete={(u) =>
          setConfirmData({
            userId: u.idUserResponse,
            fullName: `${u.name} ${u.surname}`,
          })
        }
      />

      <CreateUserModal
        isOpen={showCreate}
        onClose={handleCreateClose}
        currentUserRole={user?.role}
      />

      <ConfirmModal
        isOpen={!!confirmData}
        title='Deshabilitar usuario'
        description={`¿Estás seguro de deshabilitar a "${confirmData?.fullName}"? El usuario perderá acceso al sistema.`}
        confirmLabel='Deshabilitar'
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmData(null)}
        loading={loadings.action}
      />
    </div>
  );
};
