import { create } from 'zustand';
import {
  getAccountsRequest,
  createAccountRequest,
  getAccountByIdRequest,
  updateAccountRequest,
  getAccountHistoryRequest,
} from '../../../shared/api/accounts.requests';
import { errorMessage } from '../../../shared/utils/errorMessage';
import { showToast } from '../../../shared/components/common/Toast';

export const useAccountStore = create((set) => ({
  accounts: [],
  selectedAccount: null,
  loading: false,
  loadingDetail: false,
  error: null,
  accountHistory: [],
  loadingHistory: false,

  fetchAccounts: async () => {
    try {
      set({ loading: true, error: null });
      const { data } = await getAccountsRequest();
      set({ accounts: data.data ?? [], loading: false });
    } catch (err) {
      const message = errorMessage(err, 'Error al obtener las cuentas');
      set({ error: message, loading: false });
      showToast(message, 'error');
      return { success: false, error: message };
    }
  },

  createAccount: async ({ accountType }) => {
    try {
      set({ loading: true, error: null });
      const { data } = await createAccountRequest({ accountType });
      set((state) => ({
        accounts: [...state.accounts, data.data],
        loading: false,
      }));
      return { success: true, data: data.data };
    } catch (err) {
      const message = errorMessage(err, 'Error al crear la cuenta');
      set({ error: message, loading: false });
      showToast(message, 'error');
      return { success: false, error: message };
    }
  },

  fetchAccountById: async (accountNumber) => {
    try {
      set({ loadingDetail: true, error: null });
      const { data } = await getAccountByIdRequest(accountNumber);
      set({ selectedAccount: data.data, loadingDetail: false });
      return { success: true, data: data.data };
    } catch (err) {
      const message = errorMessage(err, 'Error al obtener el detalle de la cuenta');
      set({ error: message, loadingDetail: false });
      showToast(message, 'error');
      return { success: false, error: message };
    }
  },

  updateAccount: async (accountNumber, payload) => {
    try {
      set({ loading: true, error: null });
      const { data } = await updateAccountRequest(accountNumber, payload);
      set((state) => ({
        accounts: state.accounts.map((acc) =>
          acc.accountNumber === accountNumber ? data.data : acc
        ),
        selectedAccount: data.data,
        loading: false,
      }));
      return { success: true, data: data.data };
    } catch (err) {
      const message = errorMessage(err, 'Error al actualizar la cuenta');
      set({ error: message, loading: false });
      showToast(message, 'error');
      return { success: false, error: message };
    }
  },

  fetchAccountHistory: async (accountNumber) => {
    try {
      set({ loadingHistory: true, error: null });
      const { data } = await getAccountHistoryRequest(accountNumber);
      set({ accountHistory: data.data ?? [], loadingHistory: false });
    } catch (err) {
      const message = errorMessage(err, 'Error al obtener el historial de la cuenta');
      set({ accountHistory: [], loadingHistory: false, error: message });
      showToast(message, 'error');
      return { success: false, error: message };
    }
  },

  updateAccountBalance: (accountNumber, newBalance) => {
    set((s) => ({
      accounts: s.accounts.map((acc) =>
        acc.accountNumber === accountNumber
          ? { ...acc, balance: parseFloat(newBalance) }
          : acc
      ),
    }));
  },

  clearSelectedAccount: () => set({ selectedAccount: null }),
}));
