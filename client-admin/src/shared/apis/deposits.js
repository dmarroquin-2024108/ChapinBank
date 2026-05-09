import { axiosAccount } from './api.js';

export const createDeposit = async (depositData) => {
    return await axiosAccount.post('/deposits', depositData);
};

export const revertDeposit = async (depositId) => {
    return await axiosAccount.patch(`/deposits/${depositId}/revert`);
};