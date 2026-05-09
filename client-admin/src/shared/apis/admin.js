import { axiosAccounts, axiosAuth, axiosProduct } from './api.js'

export const getHistoryBank = async () => {
    const { data } = await axiosAccount.get('/history/bank/movements');
    return data;
}

export const getAllProducts = async () => {
    const { data } = await axiosProduct.get('/products/');
    return data;
}

export const getAllUsers = async () => {
    const { data } = await axiosAuth.get("/auth/admin/users/summary");
    return data
}

export const getAllAccounts = async () => {
    const { data } = await axiosAccounts.get("/accounts/admin/summary")
    return data;
}