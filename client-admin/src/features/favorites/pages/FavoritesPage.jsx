import { useState } from 'react';
import { Plus, Star, Search, Send, Pencil, Trash2 } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites.js';
import { FavoriteModal } from '../components/FavoriteModal.jsx';
import { DeleteFavoriteModal } from '../components/DeleteFavoriteModal.jsx';
import { QuickTransferModal } from '../components/QuickTransferModal.jsx';
import { formatDate } from '../../../shared/utils/formatters.js';

const AVATAR_COLORS = [
  'bg-orange text-white',
  'bg-main-blue text-white',
  'bg-gold text-white',
];

const getInitials = (alias) =>
  alias
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

const getAvatarColor = (id) => AVATAR_COLORS[id.charCodeAt(id.length - 1) % AVATAR_COLORS.length];

export const FavoritesPage = () => {
  const { favorites, filtered, loadings, search, setSearch, ahorro, monetaria } = useFavorites();
  const [modalState, setModalState] = useState({ open: false, mode: 'add', data: {} });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [txTarget, setTxTarget] = useState(null);
  const openAdd = () => setModalState({ open: true, mode: 'add', data: {} });
  const openEdit = (fav) => setModalState({ open: true, mode: 'edit', data: fav });
  const closeModal = () => setModalState((s) => ({ ...s, open: false }));

  return (
    <div className='space-y-5'>
      <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-3'>
        <div>
          <h1 className='text-xl font-bold text-[#0d1f35]'>Cuentas favoritas</h1>
          <p className='text-xs text-gray-400 mt-0.5'>
            Administra tus cuentas de transferencia frecuente
          </p>
        </div>
        <button
          onClick={openAdd}
          className='w-full sm:w-auto flex items-center justify-center gap-1.5 text-sm font-semibold text-white bg-[#F28C00] hover:bg-[#d97b00] px-4 py-2 rounded-xl transition-colors'
        >
          <Plus size={15} />
          Agregar favorito
        </button>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3'>
        <div className='rounded-2xl bg-main-blue p-4 flex items-center justify-between'>
          <div>
            <p className='text-[10px] font-bold tracking-widest text-white uppercase mb-1'>
              Total
            </p>
            <p className='text-2xl sm:text-3xl font-extrabold text-white'>{favorites.length}</p>
          </div>
          <div className='w-9 h-9 rounded-full bg-white/10 flex items-center justify-center'>
            <Star size={17} className='text-white' />
          </div>
        </div>

        <div className='rounded-2xl bg-orange p-4 flex items-center justify-between'>
          <div>
            <p className='text-[10px] font-bold tracking-widest text-white uppercase mb-1'>
              Ahorro
            </p>
            <p className='text-3xl font-extrabold text-white'>{ahorro}</p>
          </div>
          <div className='w-9 h-9 rounded-full bg-white/10 flex items-center justify-center'>
            <Star size={17} className='text-white' />
          </div>
        </div>

        <div className='rounded-2xl bg-gold p-4 flex items-center justify-between'>
          <div>
            <p className='text-[10px] font-bold tracking-widest text-white uppercase mb-1'>
              Monetaria
            </p>
            <p className='text-3xl font-extrabold text-white'>{monetaria}</p>
          </div>
          <div className='w-9 h-9 rounded-full bg-white/10 flex items-center justify-center'>
            <Star size={17} className='text-white' />
          </div>
        </div>
      </div>

      <div className='relative'>
        <Search size={15} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
        <input
          type='text'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Buscar por alias o número de cuenta...'
          className='w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white min-w-0'
        />
      </div>

      <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden'>
        {loadings.favorites ? (
          <div className='p-8 space-y-3'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='h-12 bg-gray-100 animate-pulse rounded-xl' />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className='p-6 sm:p-12 text-center'>
            <Star size={32} className='text-gray-200 mx-auto mb-3' />
            <p className='text-sm font-medium text-gray-400'>
              {search ? 'Sin resultados para tu búsqueda' : 'No tienes favoritos registrados'}
            </p>
            {!search && (
              <p className='text-xs text-gray-300 mt-1'>
                Agrega una cuenta para hacer transferencias rápidas
              </p>
            )}
          </div>
        ) : (
          <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden'>
            <div className='overflow-x-auto scrollbar-thin'>
              <table className='w-full text-sm min-w-[720px]'>
                <thead>
                  <tr className='border-b border-gray-100'>
                    <th className='text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3'>
                      Favorito
                    </th>
                    <th className='text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3'>
                      No. Cuenta
                    </th>
                    <th className='text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3'>
                      Tipo
                    </th>
                    <th className='text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3'>
                      Agregado
                    </th>
                    <th className='text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3'>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((fav) => (
                    <tr
                      key={fav._id}
                      className='border-b border-gray-50 hover:bg-gray-50/60 transition-colors'
                    >
                      <td className='px-5 py-3'>
                        <div className='flex items-center gap-3'>
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${getAvatarColor(fav._id)}`}
                          >
                            {getInitials(fav.alias)}
                          </div>
                          <span className='font-semibold text-[#0d1f35] truncate max-w-[140px] block'>
                            {fav.alias}
                          </span>
                        </div>
                      </td>
                      <td className='px-5 py-3 text-gray-500 font-mono text-xs'>
                        {fav.accountNumber}
                      </td>
                      <td className='px-5 py-3'>
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${fav.accountType === 'AHORRO' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}
                        >
                          {fav.accountType}
                        </span>
                      </td>
                      <td className='px-5 py-3 text-gray-400 text-xs'>
                        {formatDate(fav.createdAt)}
                      </td>
                      <td className='px-5 py-3'>
                        <div className='flex items-center gap-1.5 min-w-max'>
                          <button
                            onClick={() => setTxTarget(fav)}
                            title='Transferencia rápida'
                            className='w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gold hover:bg-gold/10 transition-colors'
                          >
                            <Send size={13} />
                          </button>

                          <button
                            onClick={() => openEdit(fav)}
                            title='Editar alias'
                            className='w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors'
                          >
                            <Pencil size={13} />
                          </button>

                          <button
                            onClick={() => setDeleteTarget(fav)}
                            title='Eliminar'
                            className='w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-orange-400 hover:bg-orange-50 transition-colors'
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <FavoriteModal
        isOpen={modalState.open}
        onClose={closeModal}
        mode={modalState.mode}
        initialData={modalState.data}
      />
      <DeleteFavoriteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        favorite={deleteTarget}
      />
      <QuickTransferModal
        isOpen={!!txTarget}
        onClose={() => setTxTarget(null)}
        favorite={txTarget}
      />
    </div>
  );
};
