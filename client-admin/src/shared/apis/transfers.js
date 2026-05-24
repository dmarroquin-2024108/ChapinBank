import { axiosAccounts } from './api.js';

export const createTransfer = async (data) => {
  return await axiosAccounts.post('/transfers', data);
};

export const confirmTransfer = async ({ transferToken, action }) => {
  return await axiosAccounts.post('/transfers/confirm', { transferToken, action });
};

export const getCurrencyRates = async (base = 'GTQ') => {
  return await axiosAccounts.get(`/transfers/currency?base=${base}`);
};

export const getDailyLimit = async (accountNumber) => {
  return await axiosAccounts.get(`/transfers/daily-limit?accountNumber=${accountNumber}`);
};
