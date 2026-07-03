import { accountsClient } from './authClient';
import { ENDPOINTS } from '../constants/endpoints';

export const getAccountsRequest = async () => {
  return await accountsClient.get(ENDPOINTS.ACCOUNT.ACCOUNTS);
};

export const createAccountRequest = async ({ accountType }) => {
  return await accountsClient.post(ENDPOINTS.ACCOUNT.ACCOUNTS, { accountType });
};

export const getAccountByIdRequest = async (accountNumber) => {
  return await accountsClient.get(`${ENDPOINTS.ACCOUNT.ACCOUNT_BY_ID}/${accountNumber}`);
};

export const updateAccountRequest = async (accountNumber, data) => {
  return await accountsClient.patch(`${ENDPOINTS.ACCOUNT.ACCOUNT_BY_ID}/${accountNumber}`, data);
};

export const getAccountsListRequest = async () => {
  return await accountsClient.get(ENDPOINTS.ACCOUNT.ACCOUNTS_ADMIN_ALL);
};

export const toggleAccountStatusRequest = async (accountNumber, status) => {
  return await accountsClient.patch(`${ENDPOINTS.ACCOUNT.ACCOUNTS_ADMIN_STATUS}/${accountNumber}`, { status });
};

export const getAccountsSummaryRequest = async () => {
  return await accountsClient.get(ENDPOINTS.ACCOUNT.ACCOUNTS_ADMIN_SUMMARY);
};

export const getAccountHistoryRequest = async (accountNumber) => {
  return await accountsClient.get(`${ENDPOINTS.ACCOUNT.ACCOUNT_HISTORY}/${accountNumber}`);
};
