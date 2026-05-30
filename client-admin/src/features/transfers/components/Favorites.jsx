import { useEffect } from 'react';
import { Star, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { useFavoriteStore } from '../../favorites/store/favoriteStore.js';
import { Link } from 'react-router-dom';

const AVATAR_COLORS = [
  'bg-main-blue',
  'bg-gold',
  'bg-orange',
];

const getInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || '?';

const avatarColor = (str = '') => {
  let h = 0;
  for (const c of str) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
};

export const Favorites = ({ selectedFavorite, onSelect }) => {
  const { favorites, loadings, getFavorites, deleteFavorite } = useFavoriteStore();

  useEffect(() => {
    getFavorites();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    await deleteFavorite(id);
    if (selectedFavorite?._id === id) onSelect(null);
  };

  if (loadings.favorites) {
    return (
      <div className='flex items-center justify-center py-10 gap-2 text-gray-400'>
        <Loader2 size={16} className='animate-spin' />
        <span className='text-sm'>Cargando favoritos…</span>
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <label className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
          Tus cuentas favoritas
          <span className='ml-1.5 text-gray-300 font-normal normal-case tracking-normal'>
            ({favorites.length})
          </span>
        </label>
      </div>

      {favorites.length === 0 && (
        <div className='text-center py-10 text-gray-400'>
          <div className='w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3'>
            <Star size={22} className='opacity-40' />
          </div>
          <p className='text-sm font-medium text-gray-500'>Sin cuentas favoritas</p>
          <p className='text-xs text-gray-400 mt-1 mb-3'>
            Ve al módulo de{' '}
            <Link to='/inicio/favoritos' className='text-orange font-semibold hover:underline'>
              Favoritos
            </Link>{' '}
            para agregar cuentas.
          </p>
        </div>
      )}

      {favorites.length > 0 && (
        <div className='space-y-2'>
          {favorites.map((fav) => (
            <button
              key={fav._id}
              type='button'
              onClick={() => onSelect(fav)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-150 ${
                selectedFavorite?._id === fav._id
                  ? 'border-orange bg-orange/5 shadow-sm ring-1 ring-orange/20'
                  : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${avatarColor(fav.alias)}`}
              >
                {getInitials(fav.alias)}
              </div>
              <div className='flex-1 min-w-0 text-left'>
                <p className='text-sm font-semibold text-main-blue truncate'>{fav.alias}</p>
                <p className='text-xs text-gray-400 truncate'>{fav.accountType}</p>
                <p className='text-xs text-gray-300 font-mono mt-0.5'>
                  •••• {fav.accountNumber.slice(-4)}
                </p>
              </div>
              {selectedFavorite?._id === fav._id && (
                <div className='w-2 h-2 rounded-full bg-orange shrink-0' />
              )}
              <div
                role='button'
                tabIndex={0}
                onClick={(e) => handleDelete(e, fav._id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleDelete(e, fav._id);
                }}
                className='p-1.5 text-gray-300 hover:text-red-400 transition-colors duration-150 shrink-0 rounded-md hover:bg-red-50 cursor-pointer'
              >
                <Trash2 size={15} />
              </div>
            </button>
          ))}
        </div>
      )}

      {favorites.length > 0 && !selectedFavorite && (
        <p className='flex items-center gap-1.5 text-xs text-amber-500 bg-amber-50 rounded-lg px-3 py-2'>
          <AlertCircle size={12} className='shrink-0' />
          Selecciona una cuenta favorita para continuar.
        </p>
      )}
    </div>
  );
};
