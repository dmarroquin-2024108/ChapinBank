import { accountsClient } from './authClient';
import { ENDPOINTS } from '../constants/endpoints';

export const getAccountHistoryRequest = async (accountNumber) => {
  return await accountsClient.get(`${ENDPOINTS.ACCOUNT.ACCOUNT_HISTORY}/${accountNumber}`);
};

export const getBankHistoryRequest = async () => {
  return await accountsClient.get(ENDPOINTS.ACCOUNT.HISTORY_BANK);
};

export const getAdminFilteredHistoryRequest = async ({ accountNumber, accountType, limit }) => {
  return await accountsClient.get('/history/bank/account-filter', {
    params: {
      accountNumber: accountNumber || undefined,
      accountType: accountType || undefined,
      limit,
    },
  });
};

export const getAccountsByMovementsRequest = async (order = 'desc') => {
  return await accountsClient.get('/history/bank/accounts-by-movements', {
    params: { order },
  });
};
