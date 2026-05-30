import { Edit, Trash2, ShoppingCart, CheckCircle } from 'lucide-react';

const CATEGORY_CONFIG = {
  SEGURO: {
    label: 'Seguro',
    gradient: 'from-yellow-200 to-amber-500',
    badge: 'bg-yellow-200 text-amber-700',
  },
  VIAJE: {
    label: 'Viaje',
    gradient: 'from-amber-500 to-orange-600',
    badge: 'bg-amber-100 text-amber-700',
  },
  SUSCRIPCION: {
    label: 'Suscripción',
    gradient:  'from-blue-700 to-indigo-900',
    badge: 'bg-blue-100 text-blue-700',
  },
};

const DEFAULT_CONFIG = {
  label: 'Producto',
  gradient: 'from-slate-500 to-slate-700',
  badge: 'bg-slate-100 text-slate-700',
};

export const ProductCard = ({
  product,
  canEdit = false,
  canDelete = false,
  canBuy = false,
  alreadyOwned = false,
  onEdit,
  onDelete,
  onBuy,
}) => {
  const config = CATEGORY_CONFIG[product.type] ?? DEFAULT_CONFIG;

  return (
    <article className='group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col'>
      <div className={`relative h-44 bg-gradient-to-br ${config.gradient} overflow-hidden`}>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className='absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500'
          />
        ) : (
          <div className='absolute inset-0 opacity-10'>
            <svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
              <defs>
                <pattern
                  id={`grid-${product._id}`}
                  width='20'
                  height='20'
                  patternUnits='userSpaceOnUse'
                >
                  <path d='M 20 0 L 0 0 0 20' fill='none' stroke='white' strokeWidth='0.5' />
                </pattern>
              </defs>
              <rect width='100%' height='100%' fill={`url(#grid-${product._id})`} />
            </svg>
          </div>
        )}
        <div className='absolute top-3 left-3'>
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.badge} backdrop-blur-sm`}
          >
            {product.type}
          </span>
        </div>

        {alreadyOwned && (
          <div className='absolute top-3 right-3'>
            <span className='flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 text-emerald-600 shadow-sm'>
              <CheckCircle size={11} />
              Contratado
            </span>
          </div>
        )}
        <div className='absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/60 to-transparent'>
          <h3 className='text-white font-bold text-base leading-tight line-clamp-2 drop-shadow'>
            {product.name}
          </h3>
        </div>
      </div>

      <div className='flex flex-col flex-1 p-4 gap-3'>
        {product.description && (
          <p className='text-gray-500 text-xs leading-relaxed line-clamp-2'>
            {product.description}
          </p>
        )}

        <div className='mt-auto'>
          <p className='text-[10px] text-gray-400 uppercase tracking-wider font-medium'>
            Precio mensual
          </p>
          <p className='text-xl font-extrabold text-[#0d1f35]'>
            Q {Number(product.price).toFixed(2)}
          </p>
        </div>
      </div>

      <div className='px-4 pb-4 flex gap-2'>
        {canBuy && (
          <button
            onClick={() => onBuy?.(product)}
            disabled={alreadyOwned}
            className={`
              flex-1 flex items-center justify-center gap-1.5
              py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95
              ${
                alreadyOwned
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#f59e0b] hover:bg-[#d97706] text-white shadow-md shadow-amber-200/60 cursor-pointer'
              }
            `}
          >
            {alreadyOwned ? (
              <>
                <CheckCircle size={14} />
                Ya contratado
              </>
            ) : (
              <>
                <ShoppingCart size={14} />
                Contratar
              </>
            )}
          </button>
        )}

        {canEdit && (
          <button
            onClick={() => onEdit?.(product)}
            title='Editar'
            className='p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-all active:scale-90 cursor-pointer'
          >
            <Edit size={16} />
          </button>
        )}

        {canDelete && (
          <button
            onClick={() => onDelete?.(product)}
            title='Eliminar'
            className='p-2.5 text-orange-400 hover:bg-orange-50 rounded-xl transition-all active:scale-90 cursor-pointer'
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </article>
  );
};
