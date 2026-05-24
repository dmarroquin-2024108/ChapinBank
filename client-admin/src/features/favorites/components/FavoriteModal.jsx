import { useEffect, useState } from 'react';
import { useFavoriteStore } from '../store/favoriteStore.js';
import { showSuccess, showError } from '../../../shared/utils/toast.js';

export const FavoriteModal = ({ isOpen, onClose, mode = 'add', initialData = {} }) => {
  const { addFavorite, updateFavorite, loadings } = useFavoriteStore();
  const [formData, setFormData] = useState({ accountNumber: '', alias: '' });
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({
          accountNumber: initialData.accountNumber || '',
          alias: initialData.alias || '',
        });
      } else {
        setFormData({ accountNumber: '', alias: '' });
      }
    }
  }, [isOpen, mode, initialData]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  const handleChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;

    if (mode === 'add') {
      result = await addFavorite({
        accountNumber: formData.accountNumber.trim().toUpperCase(),
        alias: formData.alias.trim(),
      });
    } else {
      result = await updateFavorite(initialData._id, formData.alias.trim());
    }

    if (result.success) {
      showSuccess(
        mode === 'add' ? 'Cuenta agregada a favoritos' : 'Alias actualizado correctamente'
      );
      onClose();
    } else {
      showError(result.error);
    }
  };

  return (
    <div className='fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4'>
      <div className='bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden border-t-[12px] border-[#0d1f35]'>
        <div className='px-8 pt-6 pb-4'>
          <h2 className='text-[#0d1f35] text-2xl font-bold'>
            {mode === 'add' ? 'Agregar favorito' : 'Editar alias'}
          </h2>
          <p className='text-gray-500 text-sm mt-1'>
            {mode === 'add'
              ? 'Guarda una cuenta para transferencias rápidas.'
              : `Editando: ${initialData.accountNumber} · ${initialData.accountType}`}
          </p>
        </div>

        <form onSubmit={handleSubmit} className='px-8 pb-8'>
          <div className='flex flex-col gap-4'>
            {mode === 'add' && (
              <div className='flex flex-col gap-1'>
                <label className='text-gray-600 text-sm font-medium'>Número de cuenta</label>
                <input
                  className='border border-gray-300 rounded-md p-2.5 text-gray-700 uppercase outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all'
                  value={formData.accountNumber}
                  onChange={(e) => handleChange('accountNumber', e.target.value)}
                  placeholder='Ej. AH12345678'
                  required
                />
              </div>
            )}

            <div className='flex flex-col gap-1'>
              <label className='text-gray-600 text-sm font-medium'>Alias</label>
              <input
                className='border border-gray-300 rounded-md p-2.5 text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all'
                value={formData.alias}
                onChange={(e) => handleChange('alias', e.target.value)}
                placeholder='Ej. María - Trabajo'
                maxLength={50}
                required
              />
            </div>
          </div>

          <div className='flex justify-end gap-4 mt-8'>
            <button
              type='button'
              onClick={onClose}
              className='px-6 py-2.5 text-gray-500 hover:bg-gray-100 rounded-md font-medium transition-colors'
            >
              Cancelar
            </button>
            <button
              type='submit'
              disabled={loadings.action}
              className='px-8 py-2.5 bg-[#f59e0b] hover:bg-[#d97706] text-white rounded-md font-bold shadow-md transition-all active:scale-95 disabled:opacity-50'
            >
              {loadings.action
                ? 'Guardando...'
                : mode === 'add'
                  ? 'Agregar favorito'
                  : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
