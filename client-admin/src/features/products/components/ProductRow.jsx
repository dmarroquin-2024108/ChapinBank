import {
    Edit,
    Trash2,
    ShoppingCart
} from 'lucide-react';

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
    onBuy
}) => {

    const badgeClass =
        CATEGORY_STYLES[product.type] ??
        'bg-gray-100 text-gray-600';

    return (
        <tr className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
            <td className="py-4 px-6">
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">
                        {product.name}
                    </span>

                    <span className="text-xs text-gray-400 truncate max-w-xs">
                        {product.description}
                    </span>
                </div>
            </td>
            <td className="py-4 px-6">
                <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${badgeClass}`}
                >
                    {product.type}
                </span>
            </td>

            <td className="py-4 px-6 text-center font-medium text-gray-900">
                Q {Number(product.price).toFixed(2)}
            </td>

            <td className="py-4 px-6 text-center">
                <div className="flex justify-center items-center gap-2">
                    {canEdit && (
                        <button
                            onClick={() => onEdit(product)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all active:scale-90"
                        >
                            <Edit size={17} />
                        </button>
                    )}

                    {canDelete && (
                        <button
                            onClick={() => onDelete(product)}
                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all active:scale-90"
                        >
                            <Trash2 size={17} />
                        </button>
                    )}

                    {canBuy && (
                        <button
                            onClick={() => onBuy?.(product)}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#f59e0b] hover:bg-[#d97706] text-white text-xs font-bold rounded-lg transition-all active:scale-95"
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