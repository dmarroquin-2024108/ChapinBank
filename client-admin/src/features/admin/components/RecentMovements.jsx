import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatAmount, formatDate } from '../../../shared/utils/formatters.js';

const MOVEMENT_LABELS = {
  DEPOSIT: 'Depósito realizado',
  DEPOSIT_REVERT: 'Reversión de depósito',
  TRANSFER: 'Transferencia realizada',
  TRANSACTION: 'Transacción',
};

const CREDIT_TYPES = new Set(['DEPOSIT']);

export const RecentMovements = ({ history = [] }) => {
  const navigate = useNavigate();
  const recentHistory = Array.isArray(history) ? history.slice(0, 5) : [];

  return (
    <div className='bg-[#0d1f35] rounded-2xl overflow-hidden'>
      <div className='flex items-center justify-between px-6 py-4'>
        <div>
          <h2 className='text-white font-semibold text-base'>Movimientos recientes del banco</h2>
          <p className='text-gray-400 text-xs mt-0.5'>
            Últimas transacciones de todos los clientes
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/historial')}
          className='text-orange text-xs font-medium hover:underline cursor-pointer'
        >
          Ver historial completo
        </button>
      </div>

      <div className='bg-white/100 divide-y divide-white/5'>
        {recentHistory.length === 0 ? (
          <p className='text-gray-400 text-sm text-center py-8'>Sin movimientos registrados</p>
        ) : (
          recentHistory.map((mov) => {
            const isCredit = CREDIT_TYPES.has(mov.type);
            return (
              <div
                key={mov.id}
                className='flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors border-b-2 border-gray-300'
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0
                                    ${isCredit ? 'bg-green-200/20 text-green-400' : 'bg-orange/15 text-orange'}`}
                >
                  {isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                </div>

                <div className='flex-1 min-w-0'>
                  <p className='text-black text-sm font-medium truncate'>
                    {MOVEMENT_LABELS[mov.type] ?? mov.type}
                  </p>
                  <p className='text-gray-400 text-xs mt-0.5'>
                    {mov.originHolder ?? mov.accountNumber} · {formatDate(mov.date)}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold shrink-0
                                    ${isCredit ? 'text-green-400' : 'text-orange'}`}
                >
                  {isCredit ? '+' : '-'}Q {formatAmount(mov.amount)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
