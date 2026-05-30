import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, ShoppingBag, RotateCcw } from 'lucide-react';
import { formatAmount, formatDate } from '../../../shared/utils/formatters.js';

const MOVEMENT_CONFIG = {
  DEPOSIT: {
    label: 'Deposito',
    icon: ArrowDownLeft,
    colorClass: 'bg-blue-100 text-blue-600',
    amountClass: 'text-blue-600',
    sign: '+',
  },
  DEPOSIT_REVERT: {
    label: 'Reversion de deposito',
    icon: RotateCcw,
    colorClass: 'bg-orange-100 text-orange-500',
    amountClass: 'text-orange-500',
    sign: '-',
  },
  TRANSFER: {
    label: 'Transferencia',
    icon: ArrowLeftRight,
    colorClass: 'bg-gold/10 text-gold',
    amountClass: 'text-gold',
    sign: '-',
  },
  TRANSACTION: {
    label: 'Transaccion',
    icon: ShoppingBag,
    colorClass: 'bg-main-blue/90 text-white',
    amountClass: 'text-main-blue',
    sign: '-',
  },
};

const DEFAULT_CONFIG = {
  label: 'Movimiento',
  icon: ArrowUpRight,
  colorClass: 'bg-gray-100 text-gray-500',
  amountClass: 'text-gray-700',
  sign: '',
};

const DefaultDetail = ({ mov }) => (
  <p className='text-xs text-gray-400 mt-0.5'>
    {mov.accountNumber} - {formatDate(mov.date)}
  </p>
);

const TransferDetail = ({ mov }) => (
  <div className='text-xs text-gray-400 mt-1 space-y-0.5'>
    <p className='break-words'>
      De{' '}
      <span className='font-medium text-gray-500'>
        {mov.originHolder ?? mov.numberAccountOrigin}
      </span>
    </p>
    <p className='break-words'>
      Para{' '}
      <span className='font-medium text-gray-500'>
        {mov.destinationHolder ?? mov.numberAccountDestination}
      </span>
    </p>
    <p>{formatDate(mov.date)}</p>
  </div>
);

const DepositDetail = ({ mov }) => (
  <div className='text-xs text-gray-400 mt-1 space-y-0.5'>
    <p className='font-mono break-all'>{mov.accountNumber}</p>
    {mov.depositMethod && <p>{mov.depositMethod}</p>}
    <p>{formatDate(mov.date)}</p>
  </div>
);

export const MovementCard = ({ mov, showAccount = false }) => {
  const config = MOVEMENT_CONFIG[mov.type] ?? DEFAULT_CONFIG;
  const Icon = config.icon;

  return (
    <div className='flex gap-3 p-4 sm:p-5 border-b border-gray-100'>
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.colorClass}`}
      >
        <Icon size={18} />
      </div>

      <div className='flex-1 min-w-0'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
          <div className='flex flex-wrap items-center gap-2'>
            <p className='text-sm sm:text-base font-semibold text-main-blue break-words'>
              {config.label}
            </p>

            {mov.status && mov.status !== 'COMPLETED' && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  mov.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-amber-100 text-orange-500'
                }`}
              >
                {mov.status === 'PENDING' ? 'Pendiente' : 'Fallido'}
              </span>
            )}
          </div>

          <div className='sm:text-right'>
            <p className={`text-sm sm:text-base font-bold ${config.amountClass}`}>
              {config.sign} Q {formatAmount(mov.amount)}
            </p>

            {mov.commision > 0 && (
              <p className='text-[10px] text-gray-400'>comisión Q {formatAmount(mov.commision)}</p>
            )}
          </div>
        </div>

        {mov.description && mov.description !== 'Sin descripcion' && (
          <p className='text-xs sm:text-sm text-gray-500 mt-1 break-words'>{mov.description}</p>
        )}

        <div className='mt-2 space-y-1'>
          {mov.type === 'TRANSFER' ? (
            <TransferDetail mov={mov} />
          ) : mov.type === 'DEPOSIT' || mov.type === 'DEPOSIT_REVERT' ? (
            <DepositDetail mov={mov} />
          ) : (
            <DefaultDetail mov={mov} />
          )}

          {showAccount && mov.accountNumber && (
            <p className='text-[11px] text-gray-400 font-mono break-all'>
              Cuenta: {mov.accountNumber}
            </p>
          )}

          {mov.noOperacion && (
            <p className='text-[10px] text-gray-400 font-mono break-all'>Op. {mov.noOperacion}</p>
          )}
        </div>
      </div>
    </div>
  );
};
