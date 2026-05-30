import { useEffect, useState } from 'react';
import { X, CreditCard, ArrowDownLeft, ArrowUpRight, Loader2 } from 'lucide-react';
import { useAccountStore } from '../store/accountsStore.js';
import toast from 'react-hot-toast';
import { formatAmount, formatDate, formatBalance } from '../../../shared/utils/formatters.js';

const MOVEMENT_LABELS = {
  DEPOSIT: 'Depósito',
  DEPOSIT_REVERT: 'Reversión',
  TRANSFER: 'Transferencia',
  TRANSACTION: 'Transacción',
};

const CREDIT_TYPES = new Set(['DEPOSIT']);

const MovementItem = ({ mov }) => {
  const isCredit = CREDIT_TYPES.has(mov.type);
  return (
    <div className='flex items-center gap-3 py-2 border-b border-gray-100 last:border-0'>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0
          ${isCredit ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-500'}`}
      >
        {isCredit ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
      </div>
      <div className='flex-1 min-w-0'>
        <p className='text-xs font-semibold text-[#032340] truncate'>
          {MOVEMENT_LABELS[mov.type] ?? mov.type}
        </p>
        <p className='text-[10px] text-gray-400'>
          {mov.date
            ? formatDate(mov.date)
            : '—'}
        </p>
      </div>
      <span
        className={`text-xs font-bold shrink-0 ${isCredit ? 'text-green-600' : 'text-orange-500'}`}
      >
        {isCredit ? '+' : '-'}{formatAmount(mov.amount)}
      </span>
    </div>
  );
};

export const DetailModal = ({ isOpen, onClose, accountNumber }) => {
  const { selectedAccount, loadingDetail, loading, fetchAccountById, updateAccount } =
    useAccountStore();

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isOpen && accountNumber) {
      useAccountStore.setState({ selectedAccount: null });
      fetchAccountById(accountNumber);
    }
  }, [isOpen, accountNumber]);

  if (!isOpen) return null;

  const dark = selectedAccount?.accountType === 'AHORRO';

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 animate-fadeIn overflow-hidden'>
        <div className={`relative h-24 ${dark ? 'bg-[#032340]' : 'bg-[#F28C00]'}`}>
          <button
            onClick={handleClose}
            className='absolute top-3 right-3 text-white/60 hover:text-white transition cursor-pointer'
          >
            <X size={20} />
          </button>
          <div className='absolute -bottom-8 left-6'>
            <div
              className={`w-16 h-16 rounded-full border-4 border-white flex items-center justify-center shadow ${dark ? 'bg-[#F28C00]' : 'bg-[#032340]'}`}
            >
              <CreditCard size={24} className='text-white' />
            </div>
          </div>
        </div>

        <div className='pt-10 px-6 pb-2'>
          <h2 className='text-lg font-bold text-[#032340]'>
            {loadingDetail ? '...' : `Cuenta ${selectedAccount?.accountType}`}
          </h2>
          <p className='text-xs text-gray-400 mt-0.5'>{selectedAccount?.accountNumber ?? '—'}</p>
        </div>

        <div className='border-t border-gray-100 mx-6 my-3' />

        {loadingDetail ? (
          <div className='px-6 pb-6 space-y-3'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='h-8 bg-gray-100 rounded-lg animate-pulse' />
            ))}
          </div>
        ) : selectedAccount ? (
          <div className='px-6 pb-6 space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-xs text-gray-400 mb-1'>Saldo disponible</p>
                <p className='text-lg font-extrabold text-[#032340]'>
                  {formatBalance(selectedAccount.balance)}
                </p>
              </div>
              <div>
                <p className='text-xs text-gray-400 mb-1'>Tipo de cuenta</p>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${dark ? 'bg-[#032340]/10 text-[#032340]' : 'bg-[#F28C00]/10 text-[#F28C00]'}`}
                >
                  {selectedAccount.accountType}
                </span>
              </div>
              <div>
                <p className='text-xs text-gray-400 mb-1'>Número de cuenta</p>
                <p className='text-sm font-semibold text-[#032340]'>
                  {selectedAccount.accountNumber}
                </p>
              </div>
              <div>
                <p className='text-xs text-gray-400 mb-1'>Fecha de apertura</p>
                <p className='text-sm font-semibold text-[#032340]'>
                  {selectedAccount.createdAt
                    ? formatDate(selectedAccount.createdAt)
                    : '—'}
                </p>
              </div>
              <div>
                <p className='text-xs text-gray-400 mb-1'>Estado de cuenta</p>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full text-center ${selectedAccount.status
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-orange-100 text-orange-700'
                    }`}
                >
                  {selectedAccount.status ? 'ACTIVA' : 'DESHABILITADA'}
                </span>
              </div>
            </div>

            <div className='flex justify-end gap-2 pt-2'>
              <button
                type='button'
                onClick={handleClose}
                className='px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer'
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          <div className='px-6 pb-6 text-center'>
            <p className='text-sm text-gray-400'>No se pudo cargar el detalle</p>
          </div>
        )}
      </div>
    </div>
  );
};
