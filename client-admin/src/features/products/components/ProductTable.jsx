import { ProductRow } from './ProductRow.jsx';

const TableSpinner = () => (
  <div className='w-full py-20 flex items-center justify-center'>
    <div className='animate-spin rounded-full h-10 w-10 border-4 border-[#0d1f35] border-t-transparent' />
  </div>
);

export const ProductTable = ({
  products = [],
  loading = false,
  emptyMessage = 'No hay productos disponibles.',
  canEdit = false,
  canDelete = false,
  canBuy = false,
  onEdit,
  onDelete,
  onBuy,
}) => {
  if (loading) {
    return <TableSpinner />;
  }

  return (
    <div className='overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm'>
      <table className='min-w-full leading-normal'>
        <thead>
          <tr className='bg-gray-50/60 text-gray-500 uppercase text-[11px] font-bold tracking-widest border-b border-gray-100'>
            <th className='py-5 px-6 text-left'>Producto</th>
            <th className='py-5 px-6 text-left'>Categoría</th>
            <th className='py-5 px-6 text-center'>Precio</th>
            <th className='py-5 px-6 text-center'>Acción</th>
          </tr>
        </thead>

        <tbody className='text-gray-700 text-sm'>
          {products.length === 0
            ? null
            : products.map((product) => (
                <ProductRow
                  key={product._id}
                  product={product}
                  canEdit={canEdit}
                  canDelete={canDelete}
                  canBuy={canBuy}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onBuy={onBuy}
                />
              ))}
        </tbody>
      </table>
    </div>
  );
};
