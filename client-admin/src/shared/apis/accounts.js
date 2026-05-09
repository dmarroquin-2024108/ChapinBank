import { axiosAccount } from './api.js';

/**
 * Obtiene todas las cuentas del usuario autenticado.
 */
export const getMyAccounts = async () => {
    return await axiosAccount.get('/accounts');
};