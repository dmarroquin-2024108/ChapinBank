import { create } from 'zustand';
import { axiosAccounts } from '../../../shared/apis/api.js';
import { errorMessage } from '../../../shared/utils/errorMessage.js';

const MOVEMENT_TYPE_LABELS = {
  DEPOSIT: 'Depósito',
  DEPOSIT_REVERT: 'Reversión de depósito',
  TRANSFER: 'Transferencia',
  TRANSACTION: 'Transacción',
};

const normalizeMovement = (mov) => ({
  ...mov,
  typeLabel: MOVEMENT_TYPE_LABELS[mov.type] ?? mov.type,
});

export const useHistoryStore = create((set, get) => ({
  accountHistory: [],
  bankHistory: [],
  accountsByMovements: [],

  selectedAccountNumber: '',

  loadings: {
    accountHistory: false,
    bankHistory: false,
    accountsByMovements: false,
  },

  errors: {
    accountHistory: null,
    bankHistory: null,
    accountsByMovements: null,
  },



  /**
   * @param {string} accountNumber 
   */
  fetchAccountHistory: async (accountNumber) => {
    if (!accountNumber) return;

    set((s) => ({
      selectedAccountNumber: accountNumber,
      loadings: { ...s.loadings, accountHistory: true },
      errors: { ...s.errors, accountHistory: null },
    }));

    try {
      const { data } = await axiosAccounts.get(`/history/account/${accountNumber}`);
      const normalized = (data.data ?? []).map(normalizeMovement);

      set((s) => ({
        accountHistory: normalized,
        loadings: { ...s.loadings, accountHistory: false },
      }));
    } catch (err) {
      const msg = errorMessage(err, 'Error al obtener el historial de la cuenta');
      set((s) => ({
        errors: { ...s.errors, accountHistory: msg },
        loadings: { ...s.loadings, accountHistory: false },
      }));
    }
  },

  fetchBankHistory: async () => {
    set((s) => ({
      loadings: { ...s.loadings, bankHistory: true },
      errors: { ...s.errors, bankHistory: null },
    }));

    try {
      const { data } = await axiosAccounts.get('/history/bank/movements');
      const normalized = (data.data ?? []).map(normalizeMovement);

      set((s) => ({
        bankHistory: normalized,
        loadings: { ...s.loadings, bankHistory: false },
      }));
    } catch (err) {
      const msg = errorMessage(err, 'Error al obtener el historial del banco');
      set((s) => ({
        errors: { ...s.errors, bankHistory: msg },
        loadings: { ...s.loadings, bankHistory: false },
      }));
    }
  },

  /**
   * @param {'asc' | 'desc'} order 
   */
  fetchAccountsByMovements: async (order = 'desc') => {
    set((s) => ({
      loadings: { ...s.loadings, accountsByMovements: true },
      errors: { ...s.errors, accountsByMovements: null },
    }));

    try {
      const { data } = await axiosAccounts.get('/history/bank/accounts-by-movements', {
        params: { order },
      });

      set((s) => ({
        accountsByMovements: data.data ?? [],
        loadings: { ...s.loadings, accountsByMovements: false },
      }));
    } catch (err) {
      const msg = errorMessage(err, 'Error al obtener cuentas por movimientos');
      set((s) => ({
        errors: { ...s.errors, accountsByMovements: msg },
        loadings: { ...s.loadings, accountsByMovements: false },
      }));
    }
  },

  clearAccountHistory: () =>
    set({ accountHistory: [], selectedAccountNumber: '' }),
}));