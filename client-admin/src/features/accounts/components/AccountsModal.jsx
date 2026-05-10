import { useState } from 'react';
import { X, PiggyBank, Wallet } from 'lucide-react';
import { useAccountStore } from '../store/accountsStore.js';
import toast from 'react-hot-toast';

const ACCOUNT_TYPES = [
  {
    type: 'AHORRO',
    label: 'Cuenta de Ahorro',
    description: 'Ideal para guardar tu dinero y generar rendimientos.',
    icon: PiggyBank,
  },
  {
    type: 'MONETARIA',
    label: 'Cuenta Monetaria',
    description: 'Para tus transacciones y pagos del día a día.',
    icon: Wallet,
  },
];

export const CuentasModal = ({ isOpen, onClose }) => {
  const { createAccount, loading } = useAccountStore();
  const [selected, setSelected] = useState(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!selected) return;
    const res = await createAccount({ accountType: selected });
    if (res.success) {
      toast.success('¡Cuenta creada exitosamente!', { duration: 3000 });
      setSelected(null);
      onClose();
    } else {
      toast.error(res.error, { duration: 3000 });
    }
  };

  const handleClose = () => {
    setSelected(null);
    onClose();
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 animate-fadeIn'>
        <div className='flex items-center justify-between mb-1'>
          <h2 className='text-lg font-bold text-[#032340]'>Nueva Cuenta</h2>
          <button
            onClick={handleClose}
            className='text-gray-400 hover:text-gray-600 transition-colors cursor-pointer'
          >
            <X size={20} />
          </button>
        </div>
        <p className='text-sm text-gray-400 mb-5'>Selecciona el tipo de cuenta que deseas abrir</p>

        <div className='space-y-3 mb-6'>
          {ACCOUNT_TYPES.map(({ type, label, description, icon: Icon }) => {
            const isSelected = selected === type;
            return (
              <button
                key={type}
                onClick={() => setSelected(type)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'border-[#F28C00] bg-[#F28C00]/5'
                    : 'border-gray-100 hover:border-[#F28C00]/40 hover:bg-gray-50'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-[#F28C00] text-white' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <p
                    className={`text-sm font-semibold ${isSelected ? 'text-[#032340]' : 'text-gray-600'}`}
                  >
                    {label}
                  </p>
                  <p className='text-xs text-gray-400 mt-0.5'>{description}</p>
                </div>
                <div
                  className={`ml-auto w-4 h-4 rounded-full border-2 shrink-0 ${
                    isSelected ? 'border-[#F28C00] bg-[#F28C00]' : 'border-gray-300'
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div className='flex justify-end gap-2'>
          <button
            type='button'
            onClick={handleClose}
            className='px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer'
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selected || loading}
            className='px-4 py-2 text-sm bg-[#F28C00] hover:bg-[#d97b00] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition cursor-pointer'
          >
            {loading ? 'Creando...' : 'Abrir Cuenta'}
          </button>
        </div>
      </div>
    </div>
  );
};
