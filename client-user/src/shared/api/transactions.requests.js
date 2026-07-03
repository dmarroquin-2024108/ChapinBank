import { productClient } from './authClient';
import { ENDPOINTS } from '../constants/endpoints';

export const buyProductRequest = async (productId, body) => {
  return await productClient.post(`${ENDPOINTS.PRODUCT.TRANSACTIONS_BUY}/${productId}`, body);
};

export const getMyTransactionsRequest = async () => {
  return await productClient.get(ENDPOINTS.PRODUCT.MY_TRANSACTIONS);
};
