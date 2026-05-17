import { useEffect, useState } from 'react';
import { Clock, Loader2, ArrowLeftRight, ArrowDownToLine, RotateCcw, Package } from 'lucide-react';
import { useAccountStore } from '../../accounts/store/accountsStore.js';
import { getAccountHistory } from '../../../shared/apis/accounts.js';
import { formatAmount, formatDate } from '../../../shared/utils/formatters.js';

const TYPE_CONFIG = {
  DEPOSIT:        { label: 'Depósito',              icon: ArrowDownToLine, color: 'text-green-600', bg: 'bg-green-50'  },
  DEPOSIT_REVERT: { label: 'Reversión de depósito', icon: RotateCcw,       color: 'text-red-500',   bg: 'bg-red-50'    },
  TRANSFER:       { label: 'Transferencia',          icon: ArrowLeftRight,  color: 'text-orange',    bg: 'bg-orange/10' },
  TRANSACTION:    { label: 'Transacción',            icon: Package,         color: 'text-main-blue', bg: 'bg-blue-50'   },
};

const STATUS_LABEL = {
  COMPLETED: { text: 'Completada', color: 'text-green-600'  },
  FAILED:    { text: 'Fallida',    color: 'text-red-500'    },
  PENDING:   { text: 'Pendiente',  color: 'text-yellow-500' },
};

export const HistorialPage = () => {
  const { accounts = [], fetchAccounts, loading: loadingAccounts } = useAccountStore();
  const [selectedAccount, setSelectedAccount] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Si llegamos directo a /inicio/historial sin pasar por UserPage,
  // el store puede estar vacío. Lo cargamos aquí si hace falta.
  useEffect(() => {
    if (accounts.length === 0) {
      fetchAccounts();
    }
  }, []);

  useEffect(() => {
    if (accounts.length && !selectedAccount) {
      setSelectedAccount(accounts[0].accountNumber);
    }
  }, [accounts]);

  useEffect(() => {
    if (!selectedAccount) return;
    setLoading(true);
    setError(null);
    getAccountHistory(selectedAccount)
      .then(({ data }) => setHistory(data.data ?? []))
      .catch(() => setError('No se pudo cargar el historial'))
      .finally(() => setLoading(false));
  }, [selectedAccount]);

  return (
    <div className='max-w-3xl mx-auto px-4 py-6'>
      <div className='flex items-center gap-4 mb-6'>
        <div className='w-12 h-12 rounded-2xl bg-orange/10 flex items-center justify-center shrink-0'>
          <Clock size={22} className='text-orange' />
        </div>
        <div>
          <h1 className='text-xl font-extrabold text-main-blue leading-tight'>Historial</h1>
          <p className='text-sm text-gray-400 mt-0.5'>Todos los movimientos de tu cuenta</p>
        </div>
      </div>

      {loadingAccounts && accounts.length === 0 ? (
        <div className='flex items-center justify-center py-20 gap-2 text-gray-300'>
          <Loader2 size={18} className='animate-spin' />
          <span className='text-sm'>Cargando cuentas…</span>
        </div>
      ) : (
        <>
          {accounts.length > 1 && (
            <div className='mb-5'>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className='w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-main-blue font-semibold focus:outline-none focus:ring-2 focus:ring-orange/30'
              >
                {accounts.map((acc) => (
                  <option key={acc.accountNumber} value={acc.accountNumber}>
                    {acc.accountNumber} — {acc.accountType} — Q {parseFloat(acc.balance).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className='bg-white rounded-2xl border border-gray-100 shadow-sm'>
            {loading ? (
              <div className='flex items-center justify-center py-16 gap-2 text-gray-300'>
                <Loader2 size={18} className='animate-spin' />
                <span className='text-sm'>Cargando historial…</span>
              </div>
            ) : error ? (
              <div className='py-16 text-center'>
                <p className='text-sm text-red-400'>{error}</p>
              </div>
            ) : history.length === 0 ? (
              <div className='py-16 text-center'>
                <p className='text-sm text-gray-400'>Sin movimientos en esta cuenta</p>
              </div>
            ) : (
              <ul className='divide-y divide-gray-50'>
                {history.map((mov) => {
                  const cfg = TYPE_CONFIG[mov.type] ?? TYPE_CONFIG.TRANSACTION;
                  const Icon = cfg.icon;
                  const st = STATUS_LABEL[mov.status] ?? null;
                  return (
                    <li key={mov.id} className='flex items-center gap-4 px-5 py-4'>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                        <Icon size={16} className={cfg.color} />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className={`text-sm font-semibold ${cfg.color}`}>{cfg.label}</p>
                        {mov.numberAccountOrigin && (
                          <p className='text-xs text-gray-400 mt-0.5 truncate'>
                            {mov.numberAccountOrigin} → {mov.numberAccountDestination}
                          </p>
                        )}
                        {mov.description && mov.description !== 'Sin descripción' && (
                          <p className='text-xs text-gray-300 truncate'>{mov.description}</p>
                        )}
                        <p className='text-xs text-gray-300 mt-0.5'>{formatDate(mov.date)}</p>
                      </div>
                      <div className='text-right shrink-0'>
                        <p className='text-sm font-bold text-main-blue'>Q {formatAmount(mov.amount)}</p>
                        {st && <p className={`text-xs font-semibold mt-0.5 ${st.color}`}>{st.text}</p>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};