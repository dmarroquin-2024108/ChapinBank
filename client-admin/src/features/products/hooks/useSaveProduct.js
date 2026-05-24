import { useProductStore } from '../store/productStore.js';

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
      await updateProduct(productId, payload);
    } else {
      const newProduct = await createProduct(payload);
      targetId = newProduct?._id;
    }

    if (data.image && targetId) {
      await uploadImage(targetId, data.image);
    }
  };

  return { saveProduct };
};
