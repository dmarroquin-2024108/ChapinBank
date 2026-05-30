import { useState, useEffect } from 'react';
import {
  History,
  Loader2,
  AlertCircle,
  BarChart3,
  RefreshCw,
  ChevronRight,
  Wallet,
  PiggyBank,
} from 'lucide-react';
import { useHistoryStore } from '../store/Historystore.js';
import { MovementCard } from '../components/Movementcard.jsx';
import { getAccountsList } from '../../../shared/apis/admin.js';

// Sub-componentes utilitarios

const LoadingState = () => (
  <div className='flex items-center justify-center py-12 gap-2 text-gray-400'>
    <Loader2 size={18} className='animate-spin' />
    <span className='text-sm'>Cargando...</span>
  </div>
);

const ErrorState = ({ message }) => (
  <div className='flex items-center gap-2 text-red-500 bg-red-50 rounded-xl px-4 py-3 text-sm'>
    <AlertCircle size={16} className='shrink-0' />
    <span>{message}</span>
  </div>
);

const EmptyState = ({ message = 'Sin datos registrados' }) => (
  <div className='flex flex-col items-center justify-center py-12 text-gray-400'>
    <History size={36} strokeWidth={1.5} className='mb-3 text-gray-300' />
    <p className='text-sm'>{message}</p>
  </div>
);

const AccountMovementRow = ({ item, index }) => (
  <div className='flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors'>
    <div
      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
        index === 0
          ? 'bg-gold text-white'
          : index === 1
            ? 'bg-main-blue text-white'
            : index === 2
              ? 'bg-orange text-white'
              : 'bg-orange/15 text-orange'
      }`}
    >
      {index + 1}
    </div>
    <p className='flex-1 text-sm font-mono font-medium text-main-blue'>{item.accountNumber}</p>
    <div className='text-right'>
      <span className='text-sm font-bold text-main-blue'>{item.totalMovements}</span>
      <span className='text-xs text-gray-400 ml-1'>mov.</span>
    </div>
  </div>
);

// Tarjeta de cuenta clickeable
const AccountCard = ({ account, selected, onClick }) => {
  const isMonetaria = account.accountType === 'MONETARIA';
  const Icon = isMonetaria ? Wallet : PiggyBank;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left cursor-pointer ${
        selected
          ? 'border-main-blue bg-main-blue/5 shadow-sm'
          : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
      }`}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
          isMonetaria ? 'bg-orange/10 text-orange' : 'bg-blue-100 text-blue-600'
        }`}
      >
        <Icon size={16} />
      </div>
      <div className='flex-1 min-w-0'>
        <p className='text-xs font-bold text-main-blue font-mono truncate'>
          {account.accountNumber}
        </p>
        <p className='text-[11px] text-gray-400 truncate'>{account.ownerName ?? '—'}</p>
      </div>
      <ChevronRight
        size={14}
        className={`shrink-0 transition-colors ${selected ? 'text-main-blue' : 'text-gray-300'}`}
      />
    </button>
  );
};

// Componente principal
export const BankHistoryPage = () => {
  const {
    bankHistory,
    accountsByMovements,
    adminFilteredHistory,
    loadings,
    errors,
    fetchBankHistory,
    fetchAccountsByMovements,
    fetchAdminFilteredHistory,
  } = useHistoryStore();

  const [rankOrder, setRankOrder] = useState('desc');

  // Cuentas para el selector
  const [allAccounts, setAllAccounts] = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('MONETARIA');
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    fetchBankHistory();
    fetchAccountsByMovements(rankOrder);
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setAccountsLoading(true);
    try {
      const { data } = await getAccountsList();
      setAllAccounts(data.data ?? data.accounts ?? data ?? []);
    } catch {
      setAllAccounts([]);
    } finally {
      setAccountsLoading(false);
    }
  };

  const handleSelectAccount = (account) => {
    setSelectedAccount(account);
    fetchAdminFilteredHistory({ accountNumber: account.accountNumber, limit: 5 });
  };

  const handleOrderChange = (e) => {
    const newOrder = e.target.value;
    setRankOrder(newOrder);
    fetchAccountsByMovements(newOrder);
  };

  const filteredAccounts = allAccounts.filter((a) => a.accountType === typeFilter);

  return (
    <div className='px-3 sm:px-6 py-4 sm:py-6 space-y-6'>
      {/* Encabezado */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <div className='w-12 h-12 rounded-2xl bg-main-blue/10 flex items-center justify-center shrink-0'>
            <History size={22} className='text-main-blue' />
          </div>
          <div>
            <h1 className='text-xl font-extrabold text-main-blue leading-tight'>
              Historial del banco
            </h1>
            <p className='text-sm text-gray-400 mt-0.5'>
              Consulta movimientos por cuenta o revisa la actividad global
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            fetchBankHistory();
            fetchAccountsByMovements(rankOrder);
          }}
          disabled={loadings.bankHistory}
          className='bg-main-blue flex items-center gap-1.5 text-sm text-white hover:cursor-pointer border border-gray-200 rounded-xl px-3 py-2 transition-colors disabled:opacity-50 cursor-pointer'
        >
          <RefreshCw size={14} className={loadings.bankHistory ? 'animate-spin' : ''} />
          Actualizar
        </button>
      </div>

      {/* Selector de cuentas + movimientos */}
      <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
        <div className='px-5 py-4 border-b border-gray-100'>
          <h2 className='text-sm font-bold text-main-blue mb-3'>Movimientos por cuenta</h2>

          {/* Tabs tipo de cuenta */}
          <div className='flex flex-wrap gap-2'>
            {['MONETARIA', 'AHORRO'].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setTypeFilter(type);
                  setSelectedAccount(null);
                }}
                className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                  typeFilter === type
                    ? 'bg-main-blue text-white border-main-blue'
                    : 'text-gray-500 border-gray-200 hover:border-gray-300'
                }`}
              >
                {type === 'MONETARIA' ? <Wallet size={13} /> : <PiggyBank size={13} />}
                {type === 'MONETARIA' ? 'Cuentas Monetarias' : 'Cuentas Ahorro'}
              </button>
            ))}
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-[280px_1fr]'>
          {/* Lista de cuentas */}
          <div className='border-r border-gray-100'>
            <div className='px-4 py-3 border-b border-gray-100'>
              <p className='text-xs font-semibold text-gray-400 uppercase tracking-wide'>
                {filteredAccounts.length} cuenta{filteredAccounts.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className='overflow-y-auto max-h-72 sm:max-h-80 p-2 sm:p-3 space-y-1.5'>
              {accountsLoading ? (
                <LoadingState />
              ) : filteredAccounts.length === 0 ? (
                <p className='text-xs text-gray-400 text-center py-6'>Sin cuentas de este tipo</p>
              ) : (
                filteredAccounts.map((acc) => (
                  <AccountCard
                    key={acc.accountNumber}
                    account={acc}
                    selected={selectedAccount?.accountNumber === acc.accountNumber}
                    onClick={() => handleSelectAccount(acc)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Movimientos de la cuenta seleccionada */}
          <div>
            {!selectedAccount ? (
              <div className='flex flex-col items-center justify-center py-16 text-gray-400'>
                <ChevronRight size={32} strokeWidth={1.5} className='mb-2 text-gray-200' />
                <p className='text-sm'>Selecciona una cuenta para ver sus movimientos</p>
              </div>
            ) : (
              <>
                <div className='px-5 py-3.5 border-b border-gray-100 flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-bold text-main-blue font-mono'>
                      {selectedAccount.accountNumber}
                    </p>
                    <p className='text-xs text-gray-400'>
                      {selectedAccount.ownerName} · Ultimos 5 movimientos
                    </p>
                  </div>
                </div>
                {errors.adminFilter ? (
                  <div className='p-4'>
                    <ErrorState message={errors.adminFilter} />
                  </div>
                ) : loadings.adminFilter ? (
                  <LoadingState />
                ) : adminFilteredHistory.length === 0 ? (
                  <EmptyState message='Sin movimientos para esta cuenta' />
                ) : (
                  <div>
                    {adminFilteredHistory.map((mov) => (
                      <MovementCard key={mov.id ?? mov._id} mov={mov} showAccount />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Movimientos recientes + ranking */}
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
        <div className='xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
          <div className='px-5 py-4 border-b border-gray-100'>
            <h2 className='text-sm font-bold text-main-blue'>Movimientos recientes del banco</h2>
            {!loadings.bankHistory && bankHistory.length > 0 && (
              <p className='text-xs text-gray-400 mt-0.5'>
                {bankHistory.length} movimiento{bankHistory.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          {errors.bankHistory ? (
            <div className='p-4'>
              <ErrorState message={errors.bankHistory} />
            </div>
          ) : loadings.bankHistory ? (
            <LoadingState />
          ) : bankHistory.length === 0 ? (
            <EmptyState message='Sin movimientos registrados en el banco' />
          ) : (
            <div>
              {bankHistory.map((mov, i) => (
                <MovementCard key={mov.id ?? mov._id ?? i} mov={mov} showAccount />
              ))}
            </div>
          )}
        </div>

        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
          <div className='px-4 sm:px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
            <div>
              <div className='flex items-center gap-2'>
                <BarChart3 size={15} className='text-orange' />
                <h2 className='text-sm font-bold text-main-blue'>Cuentas mas activas</h2>
              </div>
              <p className='text-xs text-gray-400 mt-0.5'>Por numero de movimientos</p>
            </div>
            <select
              value={rankOrder}
              onChange={handleOrderChange}
              disabled={loadings.accountsByMovements}
              className='text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-main-blue bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange/30 disabled:opacity-50 cursor-pointer'
            >
              <option value='desc'>Descendente</option>
              <option value='asc'>Ascendente</option>
            </select>
          </div>
          {errors.accountsByMovements ? (
            <div className='p-4'>
              <ErrorState message={errors.accountsByMovements} />
            </div>
          ) : loadings.accountsByMovements ? (
            <LoadingState />
          ) : accountsByMovements.length === 0 ? (
            <EmptyState message='Sin datos disponibles' />
          ) : (
            <div>
              {accountsByMovements.map((item, index) => (
                <AccountMovementRow key={item.accountNumber} item={item} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
