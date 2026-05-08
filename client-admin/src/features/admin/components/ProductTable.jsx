import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

export const ProductTable = ({ products = [], onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm">
            <table className="min-w-full leading-normal">
                <thead>
                    <tr className="bg-gray-50/50 text-gray-500 uppercase text-[11px] font-bold tracking-widest border-b border-gray-100">
                        <th className="py-5 px-6 text-left">Producto</th>
                        <th className="py-5 px-6 text-left">Categoría</th>
                        <th className="py-5 px-6 text-center">Precio</th>
                        <th className="py-5 px-6 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700 text-sm italic">
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="py-10 text-center text-gray-400">
                                No hay productos registrados.
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="py-4 px-6 text-left">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-800 not-italic">{product.name}</span>
                                        <span className="text-xs text-gray-400">{product.description}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-left">
                                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[11px] font-bold uppercase">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-center font-medium text-gray-900">
                                    Q {Number(product.price).toFixed(2)}
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <div className="flex justify-center items-center gap-3">
                                        {/* BOTÓN EDITAR */}
                                        <button 
                                            onClick={() => onEdit(product)} 
                                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all active:scale-90"
                                            title="Editar producto"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        
                                        {/* BOTÓN ELIMINAR */}
                                        <button 
                                            onClick={() => onDelete(product.id)} 
                                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all active:scale-90"
                                            title="Eliminar producto"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};