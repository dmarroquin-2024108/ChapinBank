import { useState, useEffect } from 'react';
import { History, Loader2, AlertCircle, SlidersHorizontal } from 'lucide-react';
import { useHistoryStore } from '../store/historyStore.js';
import { MovementCard } from '../components/Movementcard.jsx';
import { getMyAccounts } from '../../../shared/apis/accounts.js';

const FILTER_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'DEPOSIT', label: 'Depósitos' },
  { value: 'DEPOSIT_REVERT', label: 'Reversiones' },
  { value: 'TRANSFER', label: 'Transferencias' },
  { value: 'TRANSACTION', label: 'Transacciones' },
];

const EmptyState = () => (
  <div className='flex flex-col items-center justify-center py-16 text-gray-400'>
    <History size={40} strokeWidth={1.5} className='mb-3 text-gray-300' />
    <p className='text-sm font-medium'>Sin movimientos registrados</p>
    <p className='text-xs mt-1'>Selecciona una cuenta o realiza tu primera operación</p>
  </div>
);

const LoadingState = () => (
  <div className='flex items-center justify-center py-16 gap-2 text-gray-400'>
    <Loader2 size={18} className='animate-spin' />
    <span className='text-sm'>Cargando movimientos…</span>
  </div>
);

const ErrorState = ({ message }) => (
  <div className='flex items-center gap-2 text-orange-500 bg-orange-50 rounded-xl px-4 py-3 text-sm'>
    <AlertCircle size={16} className='shrink-0' />
    <span>{message}</span>
  </div>
);

export const HistoryPage = () => {
  const {
    accountHistory,
    selectedAccountNumber,
    loadings,
    errors,
    fetchAccountHistory,
    clearAccountHistory,
  } = useHistoryStore();

  const [accounts, setAccounts] = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    getMyAccounts()
      .then(({ data }) => {
        const list = data.data ?? data.accounts ?? data ?? [];
        setAccounts(list);
        if (list.length > 0) {
          const first = list[0].accountNumber;
          setSelectedAccount(first);
          fetchAccountHistory(first);
        }
      })
      .catch(() => {})
      .finally(() => setAccountsLoading(false));

    return () => clearAccountHistory();
  }, []);

  const handleAccountChange = (e) => {
    const accountNumber = e.target.value;
    setSelectedAccount(accountNumber);
    setFilterType('');
    if (accountNumber) {
      fetchAccountHistory(accountNumber);
    } else {
      clearAccountHistory();
    }
  };

  const filteredHistory = filterType
    ? accountHistory.filter((m) => m.type === filterType)
    : accountHistory;

  const isLoading = loadings.accountHistory || accountsLoading;
  const hasError = errors.accountHistory;

  return (
    <div className='max-w-3xl mx-auto px-4 py-6'>
      {/* Encabezado */}
      <div className='flex items-center gap-4 mb-6'>
        <div className='w-12 h-12 rounded-2xl bg-main-blue/10 flex items-center justify-center shrink-0'>
          <History size={22} className='text-main-blue' />
        </div>
        <div>
          <h1 className='text-xl font-extrabold text-main-blue leading-tight'>
            Historial de movimientos
          </h1>
          <p className='text-sm text-gray-400 mt-0.5'>
            Consulta todos los movimientos de tus cuentas
          </p>
        </div>
      </div>

      {/* Controles */}
      <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4'>
        <div className='flex flex-col sm:flex-row gap-3'>
          {/* Selector de cuenta */}
          <div className='flex-1'>
            <label className='text-xs font-semibold text-gray-500 mb-1 block'>
              Cuenta bancaria
            </label>
            <select
              value={selectedAccount}
              onChange={handleAccountChange}
              disabled={accountsLoading}
              className='w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 text-main-blue bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange/30 disabled:opacity-50 cursor-pointer'
            >
              <option value=''>— Selecciona una cuenta —</option>
              {accounts.map((acc) => (
                <option key={acc.accountNumber} value={acc.accountNumber}>
                  {acc.accountNumber}
                  {acc.accountType ? ` · ${acc.accountType}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por tipo */}
          <div className='flex-1'>
            <label className='text-xs font-semibold text-gray-500 mb-1 block flex items-center gap-1'>
              <SlidersHorizontal size={12} />
              Filtrar por tipo
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              disabled={!selectedAccount || isLoading}
              className='w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 text-main-blue bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange/30 disabled:opacity-50 cursor-pointer'
            >
              {FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Resumen rápido */}
        {!isLoading && filteredHistory.length > 0 && (
          <p className='text-xs text-gray-400 mt-3'>
            Mostrando <span className='font-semibold text-main-blue'>{filteredHistory.length}</span>{' '}
            movimiento{filteredHistory.length !== 1 ? 's' : ''}
            {selectedAccount && (
              <span>
                {' '}
                para la cuenta{' '}
                <span className='font-mono font-semibold text-main-blue'>{selectedAccount}</span>
              </span>
            )}
          </p>
        )}
      </div>

      {/* Lista de movimientos */}
      <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
        {hasError ? (
          <div className='p-4'>
            <ErrorState message={hasError} />
          </div>
        ) : isLoading ? (
          <LoadingState />
        ) : filteredHistory.length === 0 ? (
          <EmptyState />
        ) : (
          <div>
            {filteredHistory.map((mov) => (
              <MovementCard key={mov.id ?? mov._id} mov={mov} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
