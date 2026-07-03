import { accountsClient } from './authClient';
import { ENDPOINTS } from '../constants/endpoints';

export const createDepositRequest = async (depositData) => {
  return await accountsClient.post(ENDPOINTS.ACCOUNT.DEPOSITS, depositData);
};

export const revertDepositRequest = async (depositId) => {
  return await accountsClient.patch(`${ENDPOINTS.ACCOUNT.DEPOSIT_REVERT}/${depositId}/revert`);
};

export const getCurrencyRequest = async (currency) => {
  return await accountsClient.get(`${ENDPOINTS.ACCOUNT.DEPOSITS_CURRENCY}?currency=${currency}`);
};
