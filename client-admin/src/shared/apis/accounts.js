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