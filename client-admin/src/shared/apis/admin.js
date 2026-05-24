import { axiosAccounts, axiosAuth, axiosProduct } from './api.js';

export const getHistoryBank = async () => {
  return await axiosAccounts.get('/history/bank/movements');
};

export const getAllProducts = async () => {
  return await axiosProduct.get('/products/');
};

export const getAllUsers = async () => {
  return await axiosAuth.get('/auth/admin/users/summary');
};

export const getAllAccounts = async () => {
  return await axiosAccounts.get('/accounts/admin/summary');
};

export const createProduct = async (data) => {
  return await axiosProduct.post(`/products`, data);
};

export const updateProduct = async (id, data) => {
  return await axiosProduct.put(`/products/${id}`, data);
};

export const deleteProduct = async (id) => {
  return await axiosProduct.delete(`/products/${id}`);
};

export const uploadProductImage = async (id, file) => {
  const formData = new FormData();
  formData.append('image', file);

  return await axiosProduct.post(`/products/${id}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getAccountsList = async () => {
  return await axiosAccounts.get('accounts/admin/all');
};

export const toggleAccountStatus = async (accountNumber, status) => {
  return await axiosAccounts.patch(`/accounts/admin/${accountNumber}/status`, { status });
};
