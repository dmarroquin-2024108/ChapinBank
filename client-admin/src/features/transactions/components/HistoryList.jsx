import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { formatAmount, formatDate } from '../../../shared/utils/formatters.js';

const MOVEMENT_LABELS = {
  DEPOSIT: 'Depósito realizado',
  DEPOSIT_REVERT: 'Reversión de depósito',
  TRANSFER: 'Transferencia realizada',
  TRANSACTION: 'Transacción',
  WITHDRAWAL: 'Retiro',
  PAYMENT: 'Pago',
};

const CREDIT_TYPES = new Set(['DEPOSIT']);

export const HistoryList = ({
  movements = [],
  title = 'Historial de movimientos',
  loading = false,
}) => {
  if (loading) {
    return (
      <div className='bg-white rounded-2xl overflow-hidden border border-gray-100'>
        <div className='px-6 py-4'>
          <h2 className='text-[#0d1f35] font-semibold text-base'>{title}</h2>
        </div>
        <div className='flex justify-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-4 border-orange border-t-transparent' />
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-2xl overflow-hidden border border-gray-100'>
      <div className='px-6 py-4 border-b border-gray-100'>
        <h2 className='text-[#0d1f35] font-semibold text-base'>{title}</h2>
      </div>

      <div className='divide-y divide-gray-100'>
        {movements.length === 0 ? (
          <p className='text-gray-400 text-sm text-center py-8'>Sin movimientos registrados</p>
        ) : (
          movements.map((mov) => {
            const isCredit = CREDIT_TYPES.has(mov.type);
            return (
              <div
                key={mov.id || `${mov.accountNumber}-${mov.date}`}
                className='flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors'
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0
                    ${isCredit ? 'bg-blue-200/20 text-blue-400' : 'bg-orange/15 text-orange'}`}
                >
                  {isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                </div>

                <div className='flex-1 min-w-0'>
                  <p className='text-[#0d1f35] text-sm font-medium truncate'>
                    {MOVEMENT_LABELS[mov.type] ?? mov.type}
                  </p>
                  <p className='text-gray-400 text-xs mt-0.5'>
                    {mov.originHolder ?? mov.accountNumber} · {formatDate(mov.date)}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold shrink-0
                    ${isCredit ? 'text-blue-400' : 'text-orange'}`}
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
