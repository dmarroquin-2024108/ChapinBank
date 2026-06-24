import { accountsClient } from './authClient';
import { ENDPOINTS } from '../constants/endpoints';

export const getFavoritesRequest = async () => {
  return await accountsClient.get(ENDPOINTS.ACCOUNT.FAVORITES);
};

export const addFavoriteRequest = async ({ accountNumber, alias }) => {
  return await accountsClient.post(ENDPOINTS.ACCOUNT.FAVORITES, { accountNumber, alias });
};

export const updateFavoriteRequest = async (id, { alias }) => {
  return await accountsClient.patch(`${ENDPOINTS.ACCOUNT.FAVORITE_BY_ID}/${id}`, { alias });
};

export const deleteFavoriteRequest = async (id) => {
  return await accountsClient.delete(`${ENDPOINTS.ACCOUNT.FAVORITE_BY_ID}/${id}`);
};

export const quickTransferRequest = async (favoriteId, data) => {
  return await accountsClient.post(`${ENDPOINTS.ACCOUNT.QUICK_TRANSFER}/${favoriteId}`, data);
};
