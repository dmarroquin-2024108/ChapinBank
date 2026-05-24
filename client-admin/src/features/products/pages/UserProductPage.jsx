import { useState, useEffect, useCallback } from 'react';
import { useProductStore } from '../store/productStore.js';
import { useTransactionStore } from '../../transactions/store/transactionStore.js';
import { useAccountStore } from '../../accounts/store/accountsStore.js';
import { ProductGrid } from '../components/ProductGrid.jsx';
import { BuyModal } from '../../transactions/components/BuyModal.jsx';
import { showError, showSuccess } from '../../../shared/utils/toast.js';

export const UserProductPage = () => {
  const { products, loading, error, getAllProducts } = useProductStore();
  const {
    ownedProductIds,
    buying,
    error: txError,
    getMyTransactions,
    buyProduct,
  } = useTransactionStore();
  const { accounts, fetchAccounts } = useAccountStore();
  const [buyTarget, setBuyTarget] = useState(null);

  useEffect(() => {
    getAllProducts();
    getMyTransactions();
    fetchAccounts();
  }, [getAllProducts, getMyTransactions, fetchAccounts]);

  useEffect(() => {
    if (error) showError(error);
  }, [error]);
  useEffect(() => {
    if (txError) showError(txError);
  }, [txError]);

  const handleBuyClick = useCallback((product) => setBuyTarget(product), []);
  const handleBuyConfirm = useCallback(
    async ({ productId, accountNumber }) => {
      const result = await buyProduct({ productId, accountNumber });
      if (result.success) {
        showSuccess('¡Producto contratado exitosamente!');
        setBuyTarget(null);
      }
    },
    [buyProduct]
  );

  return (
    <div className='p-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-[#0d1f35]'>Productos</h1>
        <p className='text-gray-500 text-sm'>Servicios financieros disponibles en ChapinBank</p>
      </div>

      <ProductGrid
        products={products}
        loading={loading}
        emptyMessage='No hay productos disponibles en este momento.'
        ownedProductIds={[...ownedProductIds]}
        canBuy
        onBuy={handleBuyClick}
      />

      <BuyModal
        isOpen={!!buyTarget}
        product={buyTarget}
        accounts={accounts}
        onClose={() => setBuyTarget(null)}
        onConfirm={handleBuyConfirm}
        loading={buying}
      />
    </div>
  );
};
