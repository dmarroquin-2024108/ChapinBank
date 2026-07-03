import { productClient } from './authClient';
import { ENDPOINTS } from '../constants/endpoints';

export const getAllProductsRequest = async () => {
  return await productClient.get(ENDPOINTS.PRODUCT.PRODUCTS);
};

export const createProductRequest = async (data) => {
  return await productClient.post(ENDPOINTS.PRODUCT.PRODUCTS, data);
};

export const updateProductRequest = async (id, data) => {
  return await productClient.put(`${ENDPOINTS.PRODUCT.PRODUCT_BY_ID}/${id}`, data);
};

export const deleteProductRequest = async (id) => {
  return await productClient.delete(`${ENDPOINTS.PRODUCT.PRODUCT_BY_ID}/${id}`);
};

export const uploadProductImageRequest = async (id, file) => {
  const formData = new FormData();
  formData.append('image', {
    uri: file.uri,
    name: file.name ?? 'photo.jpg',
    type: file.type ?? 'image/jpeg',
  });
  return await productClient.post(
    `${ENDPOINTS.PRODUCT.PRODUCT_IMAGE}/${id}/image`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    }
  );
};
