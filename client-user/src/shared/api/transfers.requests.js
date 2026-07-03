import { accountsClient } from './authClient';
import { ENDPOINTS } from '../constants/endpoints';

export const createTransferRequest = async (data) => {
  return await accountsClient.post(ENDPOINTS.ACCOUNT.TRANSFERS, data);
};

export const confirmTransferRequest = async ({ transferToken, action }) => {
  return await accountsClient.post(ENDPOINTS.ACCOUNT.TRANSFERS_CONFIRM, { transferToken, action });
};

export const getCurrencyRatesRequest = async (base = 'GTQ') => {
  return await accountsClient.get(`${ENDPOINTS.ACCOUNT.TRANSFERS_CURRENCY}?base=${base}`);
};

export const getDailyLimitRequest = async (accountNumber) => {
  return await accountsClient.get(`${ENDPOINTS.ACCOUNT.TRANSFERS_DAILY_LIMIT}?accountNumber=${accountNumber}`);
};
