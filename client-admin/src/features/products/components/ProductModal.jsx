import { useEffect, useState } from 'react';

export const ProductModal = ({ isOpen, onClose, onSubmit, mode = 'add', initialData = {} }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    type: 'Seguro',
    description: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({
          name: initialData.name || '',
          price: initialData.price || '',
          type: initialData.type || 'Seguros',
          description: initialData.description || '',
        });
      } else {
        setFormData({
          name: '',
          price: '',
          type: 'Seguros',
          description: '',
        });
      }
    }
  }, [isOpen, mode, initialData]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: Number(formData.price),
    });
  };

  return (
    <div className='fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4'>
      <div className='bg-white rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden border-t-[12px] border-[#0d1f35]'>
        <div className='px-8 pt-6 pb-4'>
          <h2 className='text-[#0d1f35] text-2xl font-bold'>
            {mode === 'add' ? 'Crear nuevo producto' : 'Actualizar producto'}
          </h2>

          <p className='text-gray-500 text-sm mt-1'>
            Complete los campos para gestionar el catálogo del banco.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='px-8 pb-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
            <div className='flex flex-col gap-1'>
              <label className='text-gray-600 text-sm font-medium'>Nombre del producto</label>

              <input
                className='border border-gray-300 rounded-md p-2.5 text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all'
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder='Ej. Seguro Gold'
                required
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label className='text-gray-600 text-sm font-medium'>Precio mensual (Q)</label>

              <input
                type='number'
                className='border border-gray-300 rounded-md p-2.5 text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all'
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder='0.00'
                required
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label className='text-gray-600 text-sm font-medium'>Tipo</label>

              <select
                className='border border-gray-300 rounded-md p-2.5 text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all'
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
              >
                <option value='SEGURO'>Seguro</option>

                <option value='VIAJE'>Viaje</option>

                <option value='SUSCRIPCION'>Suscripcion</option>
              </select>
            </div>

            <div className='flex flex-col gap-1'>
              <label className='text-gray-600 text-sm font-medium'>Breve descripción</label>

              <input
                className='border border-gray-300 rounded-md p-2.5 text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all'
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder='Detalles del producto'
              />
            </div>
          </div>

          <div className='flex justify-end gap-4 mt-10'>
            <button
              type='button'
              onClick={onClose}
              className='px-6 py-2.5 text-gray-500 hover:bg-gray-100 rounded-md font-medium transition-colors'
            >
              Cancelar
            </button>

            <button
              type='submit'
              className='px-8 py-2.5 bg-[#f59e0b] hover:bg-[#d97706] text-white rounded-md font-bold shadow-md transition-all active:scale-95'
            >
              {mode === 'add' ? 'Crear producto' : 'Actualizar producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
