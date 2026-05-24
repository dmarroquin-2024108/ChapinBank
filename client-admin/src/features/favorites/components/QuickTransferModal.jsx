import { useForm } from 'react-hook-form';
import { X, Send } from 'lucide-react';
import { useQuickTransfer } from '../hooks/useQuickTransfer.js';
import { showSuccess, showError } from '../../../shared/utils/toast.js';

const CURRENCIES = ['GTQ', 'USD', 'EUR', 'MXN'];

export const QuickTransferModal = ({ isOpen, onClose, favorite }) => {
  const { accounts, loadingAccounts, quickTransfer, loadingAction } = useQuickTransfer();
  const activeAccounts = accounts.filter((acc) => acc.status);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { currency: 'GTQ' } });

  const onSubmit = async (formData) => {
    const result = await quickTransfer(favorite._id, {
      numberAccountOrigin: formData.numberAccountOrigin,
      originHolder: formData.originHolder,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      description: formData.description || undefined,
    });

    if (result.success) {
      showSuccess('Transferencia creada. El destinatario recibirá un correo para confirmarla.');
      reset();
      onClose();
    } else {
      showError(result.error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen || !favorite) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden max-h-[90vh] overflow-y-auto'>
        <div className='relative h-20 bg-[#0d1f35]'>
          <button
            onClick={handleClose}
            className='absolute top-3 right-3 text-white/60 hover:text-white transition'
          >
            <X size={20} />
          </button>
          <div className='absolute -bottom-7 left-6'>
            <div className='w-14 h-14 rounded-full bg-[#F28C00] border-4 border-white flex items-center justify-center shadow'>
              <Send size={20} className='text-white' />
            </div>
          </div>
        </div>

        <div className='pt-10 px-6 pb-2'>
          <h2 className='text-base font-bold text-[#0d1f35]'>Transferencia rápida</h2>
          <p className='text-xs text-gray-400 mt-0.5'>
            Hacia: <span className='font-semibold text-[#0d1f35]'>{favorite.alias}</span>
          </p>
        </div>

        <div className='mx-6 mt-3 bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-3 border border-gray-100'>
          <div className='w-9 h-9 rounded-full bg-[#F28C00]/20 flex items-center justify-center text-[#F28C00] font-bold text-sm flex-shrink-0'>
            {favorite.alias
              .split(' ')
              .slice(0, 2)
              .map((w) => w[0])
              .join('')
              .toUpperCase()}
          </div>
          <div>
            <p className='text-xs text-gray-400'>Destinatario</p>
            <p className='text-sm font-semibold text-[#0d1f35]'>{favorite.accountNumber}</p>
          </div>
          <span
            className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-full ${favorite.accountType === 'AHORRO' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}
          >
            {favorite.accountType}
          </span>
        </div>

        <div className='border-t border-gray-100 mx-6 my-4' />
        <form className='px-6 pb-6 space-y-4' onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className='text-xs text-gray-400 mb-1 block'>Cuenta de origen</label>
            {loadingAccounts ? (
              <div className='h-9 bg-gray-100 animate-pulse rounded-lg' />
            ) : activeAccounts.length > 0 ? (
              <select
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange/40 ${errors.numberAccountOrigin ? 'border-red-400' : 'border-gray-200'}`}
                {...register('numberAccountOrigin', {
                  required: 'Selecciona una cuenta de origen',
                })}
              >
                <option value=''>Seleccionar cuenta...</option>
                {activeAccounts.map((acc) => (
                  <option key={acc.accountNumber} value={acc.accountNumber}>
                    {acc.accountNumber} · {acc.accountType} · Q {acc.balance}
                  </option>
                ))}
              </select>
            ) : (
              <div className='text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-3'>
                No tienes cuentas activas para realizar transferencias.
              </div>
            )}
            {errors.numberAccountOrigin && (
              <p className='text-red-500 text-xs mt-0.5'>{errors.numberAccountOrigin.message}</p>
            )}
          </div>

          <div>
            <label className='text-xs text-gray-400 mb-1 block'>Tu nombre completo</label>
            <input
              type='text'
              placeholder='Nombre completo'
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange/40 ${errors.originHolder ? 'border-red-400' : 'border-gray-200'}`}
              {...register('originHolder', { required: 'Tu nombre es obligatorio' })}
            />
            {errors.originHolder && (
              <p className='text-red-500 text-xs mt-0.5'>{errors.originHolder.message}</p>
            )}
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='text-xs text-gray-400 mb-1 block'>Monto</label>
              <input
                type='number'
                step='0.01'
                min='1'
                placeholder='0.00'
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange/40 ${errors.amount ? 'border-red-400' : 'border-gray-200'}`}
                {...register('amount', {
                  required: 'El monto es obligatorio',
                  min: { value: 1, message: 'Mínimo 1' },
                  valueAsNumber: true,
                })}
              />
              {errors.amount && (
                <p className='text-red-500 text-xs mt-0.5'>{errors.amount.message}</p>
              )}
            </div>
            <div>
              <label className='text-xs text-gray-400 mb-1 block'>Moneda</label>
              <select
                className='w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange/40'
                {...register('currency')}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className='text-xs text-gray-400 mb-1 block'>
              Descripción <span className='text-gray-300'>(opcional)</span>
            </label>
            <input
              type='text'
              placeholder='Ej. Pago de renta'
              maxLength={255}
              className='w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange/40'
              {...register('description')}
            />
          </div>

          <div className='flex justify-end gap-2 pt-1'>
            <button
              type='button'
              onClick={handleClose}
              className='px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition'
            >
              Cancelar
            </button>
            <button
              type='submit'
              disabled={loadingAction || activeAccounts.length === 0}
              className='px-4 py-2 text-sm bg-[#F28C00] text-white font-semibold rounded-lg hover:bg-[#d97b00] transition disabled:opacity-50 flex items-center gap-1.5'
            >
              <Send size={14} />
              {loadingAction ? 'Enviando...' : 'Transferir'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
