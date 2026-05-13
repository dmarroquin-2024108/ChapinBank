import { Edit, Trash2, ShoppingCart } from 'lucide-react';

const CATEGORY_STYLES = {
  SEGURO: 'bg-blue-50 text-blue-600',
  VIAJE: 'bg-amber-50 text-amber-600',
  SUSCRIPCION: 'bg-green-50 text-green-700',
};

export const ProductRow = ({
  product,
  canEdit = false,
  canDelete = false,
  canBuy = false,
  onEdit,
  onDelete,
  onBuy,
}) => {
  const badgeClass = CATEGORY_STYLES[product.type] ?? 'bg-gray-100 text-gray-600';

  return (
    <tr className='border-b border-gray-100 hover:bg-gray-50/80 transition-colors'>
      <td className='py-3 px-6'>
        <div className='flex items-center gap-4'>
          {product.imageUrl ? (
            <div className='relative shrink-0'>
              <img
                src={product.imageUrl}
                alt={product.name}
                className='w-20 h-20 rounded-2xl object-cover shadow-lg'
              />
              <div className='absolute inset-0 rounded-2xl ring-1 ring-black/8' />
            </div>
          ) : (
            <div className='w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shrink-0 shadow-sm'>
              <span className='text-gray-400 text-[10px] font-medium'>Sin img</span>
            </div>
          )}

          <div className='flex flex-col gap-0.5'>
            <span className='font-semibold text-gray-900 text-sm'>{product.name}</span>
            <span className='text-xs text-gray-400 truncate max-w-xs leading-relaxed'>{product.description}</span>
          </div>
        </div>
      </td>
      <td className='py-3 px-6'>
        <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${badgeClass}`}>
          {product.type}
        </span>
      </td>

      <td className='py-3 px-6 text-center'>
        <span className='font-bold text-gray-900 text-sm'>Q {Number(product.price).toFixed(2)}</span>
      </td>

      <td className='py-3 px-6 text-center'>
        <div className='flex justify-center items-center gap-2'>
          {canEdit && (
            <button
              onClick={() => onEdit(product)}
              className='p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all active:scale-90'
            >
              <Edit size={16} />
            </button>
          )}

          {canDelete && (
            <button
              onClick={() => onDelete(product)}
              className='p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all active:scale-90'
            >
              <Trash2 size={16} />
            </button>
          )}

          {canBuy && (
            <button
              onClick={() => onBuy?.(product)}
              className='inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-sm shadow-amber-200 transition-all active:scale-95'
            >
              <ShoppingCart size={13} />
              Adquirir
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};