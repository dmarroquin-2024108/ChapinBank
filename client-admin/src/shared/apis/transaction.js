import { axiosProduct } from './api.js';

export const buyProduct = async (productId, body) => {
  return await axiosProduct.post(`/transactions/buy/${productId}`, body);
};

export const getMyTransactions = async () => {
  return await axiosProduct.get('/transactions/my-transactions');
};
