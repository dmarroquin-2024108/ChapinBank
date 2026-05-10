import { axiosAccounts } from './api.js';

export const createDeposit = async (depositData) => {
  return await axiosAccounts.post('/deposits', depositData);
};

export const revertDeposit = async (depositId) => {
  return await axiosAccounts.patch(`/deposits/${depositId}/revert`);
};

export const getCurrency = async (currency) => {
  return await axiosAccounts.get(`/deposits/currency?currency=${currency}`);
};
