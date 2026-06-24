import { create } from 'zustand';
import {
  adminCreateUserRequest,
  adminDeleteUserRequest,
  getAllUsersRequest,
} from '../../../shared/api/users.requests';
import {
  getAccountsSummaryRequest,
  getAccountsListRequest,
  toggleAccountStatusRequest,
} from '../../../shared/api/accounts.requests';
import { errorMessage } from '../../../shared/utils/errorMessage';

export const useAdminStore = create((set, get) => ({
  users: [],
  accounts: null,
  accountsList: [],
  loadings: {
    users: false,
    accounts: false,
    accountsList: false,
    action: false,
  },
  error: null,

  createUser: async (formData) => {
    try {
      set((s) => ({ loadings: { ...s.loadings, action: true }, error: null }));
      const { data } = await adminCreateUserRequest(formData);
      set((s) => ({ loadings: { ...s.loadings, action: false } }));
      return { success: true, data };
    } catch (err) {
      const message = errorMessage(err, 'Error al crear el usuario');
      set((s) => ({ error: message, loadings: { ...s.loadings, action: false } }));
      return { success: false, error: message };
    }
  },

  deleteUser: async (userId) => {
    try {
      set((s) => ({ loadings: { ...s.loadings, action: true } }));
      await adminDeleteUserRequest(userId);
      set((s) => ({
        users: s.users.map((u) =>
          u.idUserResponse === userId ? { ...u, isDeleted: true, status: false } : u
        ),
        loadings: { ...s.loadings, action: false },
      }));
      return { success: true };
    } catch (err) {
      const message = errorMessage(err, 'Error al eliminar el usuario');
      set((s) => ({ error: message, loadings: { ...s.loadings, action: false } }));
      return { success: false, error: message };
    }
  },

  getUsers: async () => {
    try {
      set((s) => ({ loadings: { ...s.loadings, users: true }, error: null }));
      const response = await getAllUsersRequest();
      set((s) => ({
        users: response.data?.data ?? response.data,
        loadings: { ...s.loadings, users: false },
      }));
    } catch (err) {
      const message = errorMessage(err, 'Error al obtener los usuarios');
      set((s) => ({ error: message, loadings: { ...s.loadings, users: false } }));
      return { success: false, error: message };
    }
  },

  getAllAccounts: async () => {
    try {
      set((s) => ({ loadings: { ...s.loadings, accounts: true }, error: null }));
      const response = await getAccountsSummaryRequest();
      set((s) => ({
        accounts: response.data.data,
        loadings: { ...s.loadings, accounts: false },
      }));
    } catch (err) {
      const message = errorMessage(err, 'Error al obtener el resumen de cuentas');
      set((s) => ({ error: message, loadings: { ...s.loadings, accounts: false } }));
      return { success: false, error: message };
    }
  },

  getAccountsList: async () => {
    try {
      set((s) => ({ loadings: { ...s.loadings, accountsList: true }, error: null }));
      const response = await getAccountsListRequest();
      set((s) => ({
        accountsList: response.data.data ?? [],
        loadings: { ...s.loadings, accountsList: false },
      }));
    } catch (err) {
      const message = errorMessage(err, 'Error al obtener la lista de cuentas');
      set((s) => ({ error: message, loadings: { ...s.loadings, accountsList: false } }));
      return { success: false, error: message };
    }
  },

  toggleAccount: async ({ accountNumber, currentStatus }) => {
    const newStatus = !currentStatus;
    try {
      set((s) => ({ loadings: { ...s.loadings, action: true }, error: null }));
      await toggleAccountStatusRequest(accountNumber, newStatus);
      set((s) => {
        const updatedAccountsList = s.accountsList.map((acc) =>
          acc.accountNumber === accountNumber ? { ...acc, status: newStatus } : acc
        );

        const active = updatedAccountsList.filter((acc) => acc.status).length;
        const disabled = updatedAccountsList.filter((acc) => !acc.status).length;

        return {
          accountsList: updatedAccountsList,
          accounts: s.accounts
            ? {
                ...s.accounts,
                total: updatedAccountsList.length,
                active,
                disabled,
              }
            : s.accounts,
          loadings: { ...s.loadings, action: false },
        };
      });
      return { success: true, newStatus };
    } catch (err) {
      const message = errorMessage(err, 'Error al cambiar el estado de la cuenta');
      set((s) => ({ error: message, loadings: { ...s.loadings, action: false } }));
      return { success: false, error: message };
    }
  },
}));
