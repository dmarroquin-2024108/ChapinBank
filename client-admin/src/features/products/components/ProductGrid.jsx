import { PackageX } from 'lucide-react';
import { ProductCard } from './ProductCard.jsx';
import { Spinner } from '../../auth/components/Spinner.jsx';

const EmptyState = ({ message }) => (
  <div className='w-full py-24 flex flex-col items-center justify-center gap-3 text-gray-400'>
    <PackageX size={40} strokeWidth={1.5} />
    <p className='text-sm font-medium'>{message}</p>
  </div>
);

export const ProductGrid = ({
  products = [],
  loading = false,
  emptyMessage = 'No hay productos disponibles.',
  ownedProductIds = [],
  canEdit = false,
  canDelete = false,
  canBuy = false,
  onEdit,
  onDelete,
  onBuy,
}) => {
  const ownedSet = new Set(ownedProductIds);

  if (loading) return <Spinner />;

  if (products.length === 0) return <EmptyState message={emptyMessage} />;

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          canEdit={canEdit}
          canDelete={canDelete}
          canBuy={canBuy}
          alreadyOwned={ownedSet.has(product._id)}
          onEdit={onEdit}
          onDelete={onDelete}
          onBuy={onBuy}
        />
      ))}
    </div>
  );
};
