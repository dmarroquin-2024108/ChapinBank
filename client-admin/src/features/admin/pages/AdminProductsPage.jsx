import React, { useState } from 'react';
import { ProductTable } from '../components/ProductTable';
import { ProductModal } from '../components/ProductModal';

export const AdminProductsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({}); 
  const [modalMode, setModalMode] = useState('add');

  const [products] = useState([
    { id: 1, name: 'Seguro de Vida Gold', description: 'Cobertura total', price: 250.00, category: 'Seguros' },
    { id: 2, name: 'Tarjeta Infinite', description: 'Tasa 1.5%', price: 0.00, category: 'Créditos' },
  ]);

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

  // Función para manejar la eliminación (puedes conectar tu API aquí)
  const handleDeleteClick = (id) => {
    if (window.confirm('¿Desea eliminar este producto del catálogo permanentemente?')) {
      console.log('Solicitud de eliminación para ID:', id);
      // Aquí iría la lógica de tu Store o API
    }
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
      />
    </div>
  );
};