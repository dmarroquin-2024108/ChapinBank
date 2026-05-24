import { CheckCircle, XCircle, PiggyBank, Wallet, Eye, PowerOff, Power } from 'lucide-react';
import { formatDate, formatBalance } from '../../../shared/utils/formatters.js';

const ACCOUNT_TYPE_CONFIG = {
  MONETARIA: { label: 'Monetaria', Icon: Wallet, className: 'bg-orange-100 text-orange-700' },
  AHORRO: { label: 'Ahorro', Icon: PiggyBank, className: 'bg-blue-100 text-blue-700' },
};

export const AccountRow = ({ account, onToggle, onDetail }) => {
  const typeConfig = ACCOUNT_TYPE_CONFIG[account.accountType] ?? ACCOUNT_TYPE_CONFIG.AHORRO;
  const { Icon } = typeConfig;
  const isActive = account.status;
  return (
    <tr className='border-b border-gray-50 hover:bg-gray-50/60 transition-colors'>
      <td className='py-4 px-6 whitespace-nowrap'>
        <span className='font-mono text-sm font-semibold text-[#0d1f35]'>
          {account.accountNumber}
        </span>
      </td>

      <td className='py-4 px-6 whitespace-nowrap'>
        <span className='text-sm text-gray-700 font-medium'>{account.ownerName ?? '—'}</span>
        <p className='text-xs text-gray-400'>
          {account.ownerUsername ? `@${account.ownerUsername}` : ''}
        </p>
      </td>

      <td className='py-4 px-6 whitespace-nowrap'>
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full ${typeConfig.className}`}
        >
          <Icon size={11} />
          {typeConfig.label}
        </span>
      </td>

      <td className='py-4 px-6 whitespace-nowrap text-sm font-semibold text-gray-800'>
        {formatBalance(account.balance)}
      </td>

      <td className='py-4 px-6 text-gray-400 text-xs whitespace-nowrap'>
        {formatDate(account.createdAt)}
      </td>

      <td className='py-4 px-6 whitespace-nowrap'>
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${
            isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'
          }`}
        >
          {isActive ? <CheckCircle size={11} /> : <XCircle size={11} />}
          {isActive ? 'Activa' : 'Inhabilitada'}
        </span>
      </td>

      <td className='py-4 px-6 whitespace-nowrap'>
        <div className='flex items-center justify-end gap-1'>
          <button
            onClick={() => onDetail(account)}
            className='p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-[#0d1f35] transition cursor-pointer'
            title='Ver detalle'
          >
            <Eye size={15} />
          </button>

          <button
            onClick={() => onToggle(account)}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              isActive
                ? 'text-red-400 hover:bg-red-50 hover:text-red-600'
                : 'text-green-500 hover:bg-green-50 hover:text-green-700'
            }`}
            title={isActive ? 'Deshabilitar cuenta' : 'Habilitar cuenta'}
          >
            {isActive ? <PowerOff size={15} /> : <Power size={15} />}
          </button>
        </div>
      </td>
    </tr>
  );
};
