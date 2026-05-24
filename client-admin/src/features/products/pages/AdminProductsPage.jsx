import { useState, useEffect } from 'react';
import { PackagePlus } from 'lucide-react';
import { useProductStore } from '../store/productStore.js';
import { useSaveProduct } from '../../products/hooks/useSaveProduct.js';
import { useUIStore } from '../../auth/store/uiStore.js';
import { ProductModal } from '../components/ProductModal.jsx';
import { ProductGrid } from '../components/ProductGrid.jsx';
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal.jsx';
import { showError } from '../../../shared/utils/toast.js';

export const AdminProductsPage = () => {
  const { products, loading, error, getAllProducts, deleteProduct } = useProductStore();
  const { saveProduct } = useSaveProduct();
  const { openConfirm, closeConfirm, confirm } = useUIStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState('add');

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  useEffect(() => {
    if (error) showError(error);
  }, [error]);

  const openAdd = () => {
    setModalMode('add');
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const openEdit = (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteClick = (product) => {
    openConfirm({
      title: '¿Eliminar producto?',
      message: `Estás a punto de eliminar "${product.name}". Esta acción no se puede deshacer.`,
      onConfirm: async () => {
        await deleteProduct(product._id);
        closeConfirm();
      },
      onCancel: closeConfirm,
    });
  };

  const handleSubmit = async (formData) => {
    await saveProduct(formData, modalMode === 'edit' ? selectedProduct?._id : null);
    closeModal();
  };

  return (
    <div className='p-6'>
      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-[#0d1f35]'>Gestión de Productos</h1>
          <p className='text-gray-500 text-sm'>
            Catálogo Administrativo de ChapinBank
            {!loading && (
              <span className='ml-2 font-semibold text-[#0d1f35]'>
                · {products.length} producto{products.length !== 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>

        <button
          onClick={openAdd}
          className='inline-flex items-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] cursor-pointer text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all active:scale-95 text-sm'
        >
          + Agregar Producto
        </button>
      </div>

      <ProductGrid
        products={products}
        loading={loading}
        emptyMessage='No hay productos en el catálogo. ¡Agrega el primero!'
        canEdit
        canDelete
        onEdit={openEdit}
        onDelete={handleDeleteClick}
      />

      <ProductModal
        isOpen={isModalOpen}
        onClose={closeModal}
        mode={modalMode}
        initialData={selectedProduct ?? {}}
        onSubmit={handleSubmit}
      />

      {confirm && (
        <ConfirmModal
          isOpen
          title={confirm.title}
          description={confirm.message}
          confirmLabel='Sí, eliminar'
          variant='danger'
          onConfirm={confirm.onConfirm}
          onCancel={confirm.onCancel}
        />
      )}
    </div>
  );
};
