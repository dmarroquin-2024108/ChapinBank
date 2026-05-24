import { useEffect, useRef, useState } from 'react';

export const ProductModal = ({ isOpen, onClose, onSubmit, mode = 'add', initialData = {} }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    type: 'SEGURO',
    description: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({
          name: initialData.name || '',
          price: initialData.price || '',
          type: initialData.type || 'SEGURO',
          description: initialData.description || '',
          image: null,
        });
        setImagePreview(initialData.imageUrl || null);
      } else {
        setFormData({
          name: '',
          price: '',
          type: 'SEGURO',
          description: '',
          image: null,
        });
        setImagePreview(null);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    handleChange('image', file);
    setImagePreview(URL.createObjectURL(file));
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
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto border-t-[10px] border-[#0d1f35]'>
        <div className='px-4 sm:px-8 pt-5 sm:pt-6 pb-4'>
          <h2 className='text-[#0d1f35] text-xl sm:text-2xl font-bold'>
            {mode === 'add' ? 'Crear nuevo producto' : 'Actualizar producto'}
          </h2>

          <p className='text-gray-500 text-sm mt-1'>
            Complete los campos para gestionar el catálogo del banco.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='px-4 sm:px-8 pb-6 sm:pb-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 sm:gap-y-4'>
            <div className='flex flex-col gap-1'>
              <label className='text-gray-600 text-sm font-medium'>Nombre del producto</label>

              <input
                className='border border-gray-300 rounded-lg p-2.5 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all'
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
                className='border border-gray-300 rounded-lg p-2.5 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all'
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder='0.00'
                required
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label className='text-gray-600 text-sm font-medium'>Tipo</label>

              <select
                className='border border-gray-300 rounded-lg p-2.5 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all'
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
                className='border border-gray-300 rounded-lg p-2.5 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all'
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder='Detalles del producto'
              />
            </div>

            {/* Campo de imagen - ocupa las 2 columnas */}
            <div className='flex flex-col gap-2 md:col-span-2'>
              <label className='text-gray-600 text-sm font-medium'>Imagen del producto</label>

              <div
                className='border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center gap-3 cursor-pointer hover:border-blue-400 transition-colors'
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt='Preview'
                    className='h-24 sm:h-32 object-contain rounded-xl'
                  />
                ) : (
                  <div className='text-gray-400 text-sm text-center'>
                    <p className='font-medium'>Haz clic para seleccionar una imagen</p>
                    <p className='text-xs mt-1'>JPG, PNG o WEBP · Máx. 5MB</p>
                  </div>
                )}

                {imagePreview && (
                  <p className='text-xs text-blue-500'>Haz clic para cambiar la imagen</p>
                )}
              </div>

              <input
                ref={fileInputRef}
                type='file'
                accept='image/jpeg,image/png,image/webp'
                className='hidden'
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className='flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8'>
            <button
              type='button'
              onClick={onClose}
              className='w-full sm:w-auto px-6 py-2.5 text-sm text-gray-500 hover:bg-gray-100 rounded-xl font-medium transition-colors'
            >
              Cancelar
            </button>

            <button
              type='submit'
              className='w-full sm:w-auto px-8 py-2.5 bg-[#f59e0b] hover:bg-[#d97706] text-white text-sm rounded-xl font-bold shadow-md transition-all active:scale-95'
            >
              {mode === 'add' ? 'Crear producto' : 'Actualizar producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
