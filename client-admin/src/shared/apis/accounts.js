import { axiosAccounts } from './api.js';

export const getAccounts = async () => {
  return await axiosAccounts.get('/accounts');
};

export const createAccount = async ({ accountType }) => {
  return await axiosAccounts.post('/accounts', { accountType });
};

export const getAccountById = async (accountNumber) => {
  return await axiosAccounts.get(`/accounts/${accountNumber}`);
};

export const updateAccount = async (accountNumber, data) => {
  return await axiosAccounts.patch(`/accounts/${accountNumber}`, data);
};

export const getMyAccounts = async () => {
  return await axiosAccounts.get('/accounts');
};

export const getFavorites = async () => {
  return await axiosAccounts.get('/favorite');
};

export const addFavorite = async ({ accountNumber, alias }) => {
  return await axiosAccounts.post('/favorite', { accountNumber, alias });
};

export const updateFavorite = async (id, { alias }) => {
  return await axiosAccounts.patch(`/favorite/${id}`, { alias });
};

export const deleteFavorite = async (id) => {
  return await axiosAccounts.delete(`/favorite/${id}`);
};

export const quickTransfer = async (favoriteId, data) => {
  return await axiosAccounts.post(`/transfers/quick/${favoriteId}`, data);
};

export const getMyNotifications = async () => {
  return await axiosAccounts.get('/notifications/my');
};

export const markNotificationRead = async (notificationId) => {
  return await axiosAccounts.patch(`/notifications/${notificationId}/read`);
};

export const getAccountHistory = async (accountNumber) => {
  return await axiosAccounts.get(`/history/account/${accountNumber}`);
};
