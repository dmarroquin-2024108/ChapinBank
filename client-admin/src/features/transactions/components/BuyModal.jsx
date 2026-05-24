import { useEffect, useRef, useState } from 'react';
import { ShoppingCart, X } from 'lucide-react';

export const BuyModal = ({
  isOpen,
  product,
  accounts = [],
  onClose,
  onConfirm,
  loading = false,
}) => {
  const [selectedAccount, setSelectedAccount] = useState('');
  const selectRef = useRef(null);
  const activeAccounts = accounts.filter((acc) => acc.status);
  useEffect(() => {
    if (isOpen) {
      setSelectedAccount(activeAccounts[0]?.accountNumber ?? '');
    }
  }, [isOpen, activeAccounts]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen || !product) return null;

  const handleConfirm = async () => {
    if (!selectedAccount) return;
    await onConfirm({ productId: product._id, accountNumber: selectedAccount });
  };

  return (
    <div className='fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border-t-[10px] border-[#0d1f35]'>
        <div className='px-6 pt-6 pb-4 flex justify-between items-start'>
          <div>
            <h2 className='text-[#0d1f35] text-xl font-bold'>Contratar servicio</h2>
            <p className='text-gray-400 text-sm mt-0.5'>Selecciona la cuenta a debitar</p>
          </div>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100 cursor-pointer'
          >
            <X size={20} />
          </button>
        </div>

        <div className='mx-6 mb-5 p-4 rounded-xl bg-gray-50 border border-gray-100 flex gap-4 items-center'>
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              className='w-14 h-14 rounded-xl object-cover shrink-0'
            />
          )}
          <div className='min-w-0'>
            <p className='font-semibold text-[#0d1f35] truncate'>{product.name}</p>
            <p className='text-gray-400 text-xs mt-0.5'>{product.type}</p>
            <p className='text-amber-500 font-extrabold text-lg mt-1'>
              Q {Number(product.price).toFixed(2)}
              <span className='text-xs font-normal text-gray-400'>/mes</span>
            </p>
          </div>
        </div>

        <div className='px-6 mb-6'>
          <label className='block text-sm font-medium text-gray-600 mb-2'>Cuenta bancaria</label>
          {activeAccounts.length === 0 ? (
            <p className='text-sm text-red-500 bg-red-50 rounded-lg p-3'>
              No tienes cuentas disponibles para realizar esta compra.
            </p>
          ) : (
            <select
              ref={selectRef}
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className='w-full border border-gray-300 rounded-xl p-3 text-gray-700 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all'
            >
              {activeAccounts.map((acc) => (
                <option key={acc.accountNumber} value={acc.accountNumber}>
                  {acc.accountNumber} — Q {Number(acc.balance).toFixed(2)} ({acc.accountType})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className='px-6 pb-6 flex gap-3 justify-end'>
          <button
            type='button'
            onClick={onClose}
            disabled={loading}
            className='px-5 py-2.5 text-gray-500 hover:bg-gray-100 rounded-xl font-medium transition-colors text-sm cursor-pointer'
          >
            Cancelar
          </button>

          <button
            type='button'
            onClick={handleConfirm}
            disabled={loading || activeAccounts.length === 0}
            className='inline-flex items-center gap-2 px-6 py-2.5 bg-[#f59e0b] hover:bg-[#d97706] disabled:opacity-60 text-white rounded-xl font-bold shadow-md shadow-amber-200 transition-all active:scale-95 text-sm cursor-pointer'
          >
            {loading ? (
              <span className='animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full' />
            ) : (
              <ShoppingCart size={15} />
            )}
            {loading ? 'Procesando...' : 'Confirmar compra'}
          </button>
        </div>
      </div>
    </div>
  );
};
