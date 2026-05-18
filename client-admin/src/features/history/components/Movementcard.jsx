import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  ShoppingBag,
  RotateCcw,
} from 'lucide-react';
import { formatAmount, formatDate } from '../../../shared/utils/formatters.js';

const MOVEMENT_CONFIG = {
  DEPOSIT: {
    label: 'Depósito',
    icon: ArrowDownLeft,
    colorClass: 'bg-green-100 text-green-600',
    amountClass: 'text-green-600',
    sign: '+',
    isCredit: true,
  },
  DEPOSIT_REVERT: {
    label: 'Reversión de depósito',
    icon: RotateCcw,
    colorClass: 'bg-red-100 text-red-500',
    amountClass: 'text-red-500',
    sign: '-',
    isCredit: false,
  },
  TRANSFER: {
    label: 'Transferencia',
    icon: ArrowLeftRight,
    colorClass: 'bg-orange/10 text-orange',
    amountClass: 'text-orange',
    sign: '-',
    isCredit: false,
  },
  TRANSACTION: {
    label: 'Transacción',
    icon: ShoppingBag,
    colorClass: 'bg-purple-100 text-purple-600',
    amountClass: 'text-purple-600',
    sign: '-',
    isCredit: false,
  },
};

const DEFAULT_CONFIG = {
  label: 'Movimiento',
  icon: ArrowUpRight,
  colorClass: 'bg-gray-100 text-gray-500',
  amountClass: 'text-gray-700',
  sign: '',
  isCredit: false,
};

const TransferDetail = ({ mov }) => (
  <p className="text-xs text-gray-400 mt-0.5">
    {mov.numberAccountOrigin && (
      <span>
        De <span className="font-medium text-gray-500">{mov.originHolder ?? mov.numberAccountOrigin}</span>
        {' → '}
        <span className="font-medium text-gray-500">{mov.destinationHolder ?? mov.numberAccountDestination}</span>
      </span>
    )}
    {!mov.numberAccountOrigin && (
      <span>{mov.accountNumber}</span>
    )}
    <span className="mx-1">·</span>
    {formatDate(mov.date)}
  </p>
);

const DepositDetail = ({ mov }) => (
  <p className="text-xs text-gray-400 mt-0.5">
    {mov.depositMethod && (
      <span className="font-medium text-gray-500 mr-1">{mov.depositMethod}</span>
    )}
    <span>· {formatDate(mov.date)}</span>
  </p>
);

const DefaultDetail = ({ mov }) => (
  <p className="text-xs text-gray-400 mt-0.5">
    {mov.accountNumber} · {formatDate(mov.date)}
  </p>
);

/**
 * @param {{ mov: object, showAccount?: boolean }} props
 */
export const MovementCard = ({ mov, showAccount = false }) => {
  const config = MOVEMENT_CONFIG[mov.type] ?? DEFAULT_CONFIG;
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
      {/* Ícono */}
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${config.colorClass}`}
      >
        <Icon size={16} />
      </div>

      {/* Detalle */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-main-blue truncate">
            {config.label}
          </p>
          {mov.status && mov.status !== 'COMPLETED' && (
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                mov.status === 'PENDING'
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-red-100 text-red-500'
              }`}
            >
              {mov.status === 'PENDING' ? 'Pendiente' : 'Fallido'}
            </span>
          )}
        </div>

        {mov.description && mov.description !== 'Sin descripción' && (
          <p className="text-xs text-gray-500 truncate">{mov.description}</p>
        )}

        {mov.type === 'TRANSFER' ? (
          <TransferDetail mov={mov} />
        ) : mov.type === 'DEPOSIT' || mov.type === 'DEPOSIT_REVERT' ? (
          <DepositDetail mov={mov} />
        ) : (
          <DefaultDetail mov={mov} />
        )}

        {showAccount && mov.accountNumber && (
          <p className="text-[10px] text-gray-400 font-mono mt-0.5">
            Cuenta: {mov.accountNumber}
          </p>
        )}
      </div>

      {/* Monto */}
      <div className="text-right shrink-0">
        <p className={`text-sm font-bold ${config.amountClass}`}>
          {config.sign} Q {formatAmount(mov.amount)}
        </p>
        {mov.commision > 0 && (
          <p className="text-[10px] text-gray-400">comisión Q {formatAmount(mov.commision)}</p>
        )}
        {mov.noOperacion && (
          <p className="text-[10px] text-gray-400 font-mono">Op. {mov.noOperacion}</p>
        )}
      </div>
    </div>
  );
};