import React, { useState } from 'react';
import { ProductTable } from '../components/ProductTable';
import { ProductModal } from '../components/ProductModal';
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal';
import { useProductStore } from '../store/useProductStore';

export const AdminProductsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({}); 
  const [modalMode, setModalMode] = useState('add');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const products      = useProductStore((state) => state.products);
  const addProduct    = useProductStore((state) => state.addProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const deleteProduct = useProductStore((state) => state.deleteProduct);

  const handleAddClick = () => {
    setModalMode('add');
    setSelectedProduct({}); 
    setIsModalOpen(true);
  };

  const handleEditClick = (product) => {
    setModalMode('edit');
    setSelectedProduct(product || {}); 
    setIsModalOpen(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteProduct(productToDelete.id);
    setConfirmOpen(false);
    setProductToDelete(null);
  };

  const handleSubmit = (formData) => {
    if (modalMode === 'add') {
      addProduct(formData);
    } else {
      updateProduct(selectedProduct.id, formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Productos</h1>
          <p className="text-gray-600 text-sm">Administre el catálogo de servicios de ChapinBank</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all active:scale-95"
        >
          + Agregar Producto
        </button>
      </div>

      <ProductTable 
        products={products} 
        onEdit={handleEditClick} 
        onDelete={handleDeleteClick} 
      />

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        mode={modalMode}
        initialData={selectedProduct} 
        onSubmit={handleSubmit}
      />

      
      <ConfirmModal
        isOpen={confirmOpen}
        title="¿Eliminar producto?"
        description={`Estás a punto de eliminar "${productToDelete?.name}". Esta acción no se puede deshacer.`}
        confirmLabel="Sí, eliminar"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

    </div>
  );
};