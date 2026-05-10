import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useAdminStore } from '../../admin/store/adminStore.js';
import { useAuthStore } from '../../auth/store/authStore.js';
import toast from 'react-hot-toast';

// step: "confirm" → muestra advertencia y botón para pedir token
//       "token"   → muestra input para ingresar el token
export const DeleteAccountModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('confirm');
  const [token, setToken] = useState('');
  const { requestSelfDelete, confirmSelfDelete, loading } = useAdminStore();
  const logout = useAuthStore((state) => state.logout);

  const handleRequestDelete = async () => {
    const response = await requestSelfDelete();
    if (response.success) {
      toast.success('Se envió un token de confirmación a tu correo.');
      setStep('token');
    } else {
      toast.error(response.error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!token.trim()) {
      toast.error('Ingresa el token que recibiste por correo.');
      return;
    }
    const response = await confirmSelfDelete(token.trim());
    if (response.success) {
      toast.success('Tu cuenta fue eliminada.');
      logout();
      onClose();
    } else {
      toast.error(response.error);
    }
  };

  const handleClose = () => {
    setStep('confirm');
    setToken('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden'>
        <div className='relative h-20 bg-red-600'>
          <button
            onClick={handleClose}
            className='absolute top-3 right-3 text-white/60 hover:text-white transition'
          >
            <X size={20} />
          </button>
          <div className='absolute -bottom-8 left-6'>
            <div className='w-16 h-16 rounded-full bg-red-500 border-4 border-white flex items-center justify-center text-white shadow'>
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>

        <div className='pt-10 px-6 pb-6'>
          {step === 'confirm' ? (
            <>
              <h2 className='text-lg font-bold text-gray-800'>Eliminar mi cuenta</h2>
              <p className='text-sm text-gray-500 mt-2'>
                Esta acción es <span className='font-semibold text-red-500'>irreversible</span>. Se
                enviará un token de confirmación a tu correo registrado.
              </p>
              <div className='flex gap-2 mt-6'>
                <button
                  onClick={handleClose}
                  className='flex-1 px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition'
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRequestDelete}
                  disabled={loading}
                  className='flex-1 px-4 py-2 text-sm bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition disabled:opacity-50'
                >
                  {loading ? 'Enviando...' : 'Solicitar eliminación'}
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className='text-lg font-bold text-gray-800'>Confirmar eliminación</h2>
              <p className='text-sm text-gray-500 mt-2'>
                Ingresa el token que recibiste en tu correo para confirmar.
              </p>
              <input
                type='text'
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder='Token de confirmación'
                className='w-full mt-4 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300'
              />
              <div className='flex gap-2 mt-4'>
                <button
                  onClick={handleClose}
                  className='flex-1 px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition'
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={loading}
                  className='flex-1 px-4 py-2 text-sm bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition disabled:opacity-50'
                >
                  {loading ? 'Eliminando...' : 'Confirmar'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
