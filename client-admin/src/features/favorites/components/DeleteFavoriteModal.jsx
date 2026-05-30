import { X, Trash2 } from 'lucide-react';
import { useFavoriteStore } from '../store/favoriteStore.js';
import { showSuccess, showError } from '../../../shared/utils/toast.js';

export const DeleteFavoriteModal = ({ isOpen, onClose, favorite }) => {
  const { deleteFavorite, loadings } = useFavoriteStore();
  const handleDelete = async () => {
    const result = await deleteFavorite(favorite._id);
    if (result.success) {
      showSuccess('Favorito eliminado');
      onClose();
    } else {
      showError(result.error);
    }
  };

  if (!isOpen || !favorite) return null;
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6'>
        <div className='flex items-start justify-between mb-4'>
          <div className='w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center'>
            <Trash2 size={18} className='text-orange-500' />
          </div>
          <button onClick={onClose} className='text-gray-400 hover:text-gray-600 transition'>
            <X size={18} />
          </button>
        </div>

        <h2 className='text-base font-bold text-[#0d1f35] mb-1'>Eliminar favorito</h2>
        <p className='text-sm text-gray-400 mb-6'>
          ¿Estás seguro que deseas eliminar{' '}
          <span className='font-semibold text-[#0d1f35]'>{favorite.alias}</span> de tus favoritos?
          Esta acción no se puede deshacer.
        </p>

        <div className='flex justify-end gap-2'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition'
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={loadings.action}
            className='px-4 py-2 text-sm bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition disabled:opacity-50'
          >
            {loadings.action ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
};
