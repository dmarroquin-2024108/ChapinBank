import { create } from 'zustand';
import {
  getAccountHistoryRequest,
  getBankHistoryRequest,
  getAdminFilteredHistoryRequest,
  getAccountsByMovementsRequest,
} from '../../../shared/api/history.requests';
import { accountsClient } from '../../../shared/api/authClient';
import { errorMessage } from '../../../shared/utils/errorMessage';

const MOVEMENT_TYPE_LABELS = {
  DEPOSIT: 'Deposito',
  DEPOSIT_REVERT: 'Reversion de deposito',
  TRANSFER: 'Transferencia',
  TRANSACTION: 'Transaccion',
};

const normalizeMovement = (mov) => ({
  ...mov,
  typeLabel: MOVEMENT_TYPE_LABELS[mov.type] ?? mov.type,
});

export const useHistoryStore = create((set) => ({
  accountHistory: [],
  bankHistory: [],
  accountsByMovements: [],
  userRecentMovements: [],
  adminFilteredHistory: [],
  selectedAccountNumber: '',

  loadings: {
    accountHistory: false,
    bankHistory: false,
    accountsByMovements: false,
    userRecent: false,
    adminFilter: false,
  },

  errors: {
    accountHistory: null,
    bankHistory: null,
    accountsByMovements: null,
    userRecent: null,
    adminFilter: null,
  },

  fetchAccountHistory: async (accountNumber) => {
    if (!accountNumber) return;
    set((s) => ({
      selectedAccountNumber: accountNumber,
      loadings: { ...s.loadings, accountHistory: true },
      errors: { ...s.errors, accountHistory: null },
    }));
    try {
      const { data } = await getAccountHistoryRequest(accountNumber);
      set((s) => ({
        accountHistory: (data.data ?? []).map(normalizeMovement),
        loadings: { ...s.loadings, accountHistory: false },
      }));
    } catch (err) {
      set((s) => ({
        errors: { ...s.errors, accountHistory: errorMessage(err, 'Error al obtener el historial') },
        loadings: { ...s.loadings, accountHistory: false },
      }));
    }
  },

  fetchUserRecentMovements: async () => {
    set((s) => ({
      loadings: { ...s.loadings, userRecent: true },
      errors: { ...s.errors, userRecent: null },
    }));
    try {
      const { data } = await accountsClient.get('/history/user/recent');
      set((s) => ({
        userRecentMovements: (data.data ?? []).map(normalizeMovement),
        loadings: { ...s.loadings, userRecent: false },
      }));
    } catch (err) {
      set((s) => ({
        errors: {
          ...s.errors,
          userRecent: errorMessage(err, 'Error al obtener movimientos recientes'),
        },
        loadings: { ...s.loadings, userRecent: false },
      }));
    }
  },

  fetchBankHistory: async () => {
    set((s) => ({
      loadings: { ...s.loadings, bankHistory: true },
      errors: { ...s.errors, bankHistory: null },
    }));
    try {
      const { data } = await getBankHistoryRequest();
      set((s) => ({
        bankHistory: (data.data ?? []).map(normalizeMovement),
        loadings: { ...s.loadings, bankHistory: false },
      }));
    } catch (err) {
      set((s) => ({
        errors: {
          ...s.errors,
          bankHistory: errorMessage(err, 'Error al obtener historial del banco'),
        },
        loadings: { ...s.loadings, bankHistory: false },
      }));
    }
  },

  fetchAdminFilteredHistory: async ({ accountNumber = '', accountType = '', limit = 5 } = {}) => {
    set((s) => ({
      loadings: { ...s.loadings, adminFilter: true },
      errors: { ...s.errors, adminFilter: null },
    }));
    try {
      const { data } = await getAdminFilteredHistoryRequest({ accountNumber, accountType, limit });
      set((s) => ({
        adminFilteredHistory: (data.data ?? []).map(normalizeMovement),
        loadings: { ...s.loadings, adminFilter: false },
      }));
    } catch (err) {
      set((s) => ({
        errors: { ...s.errors, adminFilter: errorMessage(err, 'Error al filtrar historial') },
        loadings: { ...s.loadings, adminFilter: false },
      }));
    }
  },

  fetchAccountsByMovements: async (order = 'desc') => {
    set((s) => ({
      loadings: { ...s.loadings, accountsByMovements: true },
      errors: { ...s.errors, accountsByMovements: null },
    }));
    try {
      const { data } = await getAccountsByMovementsRequest(order);
      set((s) => ({
        accountsByMovements: data.data ?? [],
        loadings: { ...s.loadings, accountsByMovements: false },
      }));
    } catch (err) {
      set((s) => ({
        errors: {
          ...s.errors,
          accountsByMovements: errorMessage(err, 'Error al obtener cuentas por movimientos'),
        },
        loadings: { ...s.loadings, accountsByMovements: false },
      }));
    }
  },

  clearAccountHistory: () => set({ accountHistory: [], selectedAccountNumber: '' }),
}));
