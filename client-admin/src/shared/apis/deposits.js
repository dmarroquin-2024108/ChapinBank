import { axiosAccount } from './api.js';

const BASE_URL = '/deposits';

/**
 * Registra un nuevo depósito en la cuenta indicada.
 * @param {Object} depositData
 * @param {string} depositData.accountNumber
 * @param {number} depositData.amount
 * @param {string} depositData.currency - 'GTQ | USD'
 * @param {string} depositData.depositMethod - 'EFECTIVO' | 'CHEQUE'
 * @param {string} [depositData.description]
 */
export const createDeposit = async (depositData) => {
    return await axiosAccount.post(BASE_URL, depositData);
};

/**
 * Revierte un depósito activo (solo dentro del primer minuto).
 * @param {string} depositId - ObjectId del depósito
 */
export const revertDeposit = async (depositId) => {
    return await axiosAccount.patch(`${BASE_URL}/${depositId}/revert`);
};