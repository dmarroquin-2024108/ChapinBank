import { useState, useEffect, useMemo, useCallback } from 'react';
import { CreditCard, CheckSquare, XSquare, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAdminStore } from '../../admin/store/adminStore.js';
import { StatCard } from '../../admin/components/StatCard.jsx';
import { AccountTable } from '../components/AccountTable.jsx';
import { DetailModal } from '../components/DetailModal.jsx';
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal.jsx';
import { formatBalance } from '../../../shared/utils/formatters.js';

const INITIAL_FILTERS = { search: '', type: '', status: '' };

export const AdminAccountsPage = () => {
  const { accounts, accountsList, loadings, getAllAccounts, getAccountsList, toggleAccount } =
    useAdminStore();

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [detailAccount, setDetailAccount] = useState(null);
  const [confirmData, setConfirmData] = useState(null);

  useEffect(() => {
    getAllAccounts();
    getAccountsList();
  }, [getAllAccounts, getAccountsList]);

  const filtered = useMemo(() => {
    const q = filters.search.toLowerCase().trim();
    const safeList = Array.isArray(accountsList) ? accountsList : [];

    return safeList.filter((acc) => {
      const matchSearch =
        !q ||
        acc.accountNumber?.toLowerCase().includes(q) ||
        acc.ownerName?.toLowerCase().includes(q) ||
        acc.ownerUsername?.toLowerCase().includes(q);

      const matchType = !filters.type || acc.accountType === filters.type;
      const matchStatus =
        !filters.status ||
        (filters.status === 'active' && acc.status) ||
        (filters.status === 'inactive' && !acc.status);
      return matchSearch && matchType && matchStatus;
    });
  }, [accountsList, filters]);

  const handleToggleConfirm = async () => {
    if (!confirmData) return;
    const { account } = confirmData;
    setConfirmData(null);

    const result = await toggleAccount({
      accountNumber: account.accountNumber,
      currentStatus: account.status,
    });

    if (result.success) {
      const action = result.newStatus ? 'habilitada' : 'deshabilitada';
      toast.success(`Cuenta ${action} correctamente. Se notificó al usuario.`);
    } else {
      toast.error(result.error ?? 'Error al cambiar el estado de la cuenta.');
    }
  };

  const handleToggleRequest = useCallback((account) => setConfirmData({ account }), []);
  const handleDetailOpen = useCallback((account) => setDetailAccount(account), []);
  const isLoadingStats = loadings.accounts || loadings.accountsList;

  const stats = useMemo(
    () => ({
      total: accounts?.total ?? 0,
      active: accounts?.active ?? 0,
      disabled: accounts?.disabled ?? 0,
      totalBalance: accounts?.totalBalance ?? null,
    }),
    [accounts]
  );
  const confirmAccount = confirmData?.account;
  const willEnable = confirmAccount && !confirmAccount.status;

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h1 className='text-xl font-bold text-[#0d1f35]'>Gestión de cuentas</h1>
        <p className='text-gray-400 text-sm mt-0.5'>
          Consulta el estado de todas las cuentas bancarias
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatCard
          title='Total cuentas'
          value={isLoadingStats ? '...' : stats.total}
          icon={CreditCard}
          color='dark'
        />
        <StatCard
          title='Activas'
          value={isLoadingStats ? '...' : stats.active}
          icon={CheckSquare}
          color='orange'
        />
        <StatCard
          title='Inhabilitadas'
          value={isLoadingStats ? '...' : stats.disabled}
          icon={XSquare}
          color='gold'
        />
        <StatCard
          title='Saldo total'
          value={
            isLoadingStats
              ? '...'
              : stats.totalBalance != null
                ? `${formatBalance(stats.totalBalance)}`
                : '—'
          }
          icon={DollarSign}
          color='dark'
        />
      </div>
      <AccountTable
        accounts={filtered}
        loading={loadings.accountsList}
        filters={filters}
        onFiltersChange={setFilters}
        onToggle={handleToggleRequest}
        onDetail={handleDetailOpen}
      />

      <DetailModal
        account={detailAccount}
        isOpen={!!detailAccount}
        onClose={() => setDetailAccount(null)}
      />

      <ConfirmModal
        isOpen={!!confirmData}
        title={willEnable ? 'Habilitar cuenta' : 'Deshabilitar cuenta'}
        description={
          willEnable
            ? `¿Habilitar la cuenta "${confirmAccount?.accountNumber}" de ${confirmAccount?.ownerName}? El usuario recibirá una notificación.`
            : `¿Deshabilitar la cuenta "${confirmAccount?.accountNumber}" de ${confirmAccount?.ownerName}? El usuario perderá acceso y recibirá una notificación.`
        }
        confirmLabel={willEnable ? 'Habilitar' : 'Deshabilitar'}
        onConfirm={handleToggleConfirm}
        onCancel={() => setConfirmData(null)}
        loading={loadings.action}
      />
    </div>
  );
};
