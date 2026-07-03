import { useProductStore } from '../store/productStore';
import { showToast } from '../../../shared/components/common/Toast';

export const useSaveProduct = () => {
  const createProduct = useProductStore((state) => state.createProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const uploadImage = useProductStore((state) => state.uploadImage);

  const saveProduct = async (data, productId = null) => {
    const payload = {
      name: data.name,
      description: data.description,
      type: data.type,
      price: Number(data.price),
    };

    let targetId = productId;

    if (productId) {
      const result = await updateProduct(productId, payload);
      if (!result?.success) return { success: false };
    } else {
      const newProduct = await createProduct(payload);
      if (!newProduct || newProduct.success === false) return { success: false };
      targetId = newProduct._id;
    }

    if (data.image && targetId) {
      const imageResult = await uploadImage(targetId, data.image);
      if (imageResult?.success === false) {
        showToast('Producto guardado, pero hubo un error al subir la imagen.', 'warning');
        return { success: true, imageError: true };
      }
    }

    return { success: true };
  };

  return { saveProduct };
};