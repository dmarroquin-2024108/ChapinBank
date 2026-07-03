import { create } from 'zustand';
import {
  adminCreateUserRequest,
  adminDeleteUserRequest,
  getAllUsersRequest,
  getUsersSummaryRequest,
} from '../../../shared/api/users.requests';
import {
  getAccountsSummaryRequest,
  getAccountsListRequest,
  toggleAccountStatusRequest,
} from '../../../shared/api/accounts.requests';
import {
  getBankHistoryRequest
} from '../../../shared/api/history.requests.js';
import {
  getAllProductsRequest,
  createProductRequest,
  updateProductRequest,
  deleteProductRequest,
  uploadProductImageRequest,
} from '../../../shared/api/products.requests';
import { errorMessage } from '../../../shared/utils/errorMessage';
import { showToast } from '../../../shared/components/common/Toast.jsx';

export const useAdminStore = create((set, get) => ({
  users: [],
  usersSummary: null,
  accounts: null,
  accountsList: [],
  history: [],
  products: [],
  loadings: {
    users: false,
    usersSummary: false,
    accounts: false,
    accountsList: false,
    action: false,
    history: false,
    products: false,
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
      showToast(message, 'error');
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
      showToast(message, 'error');
      return { success: false, error: message };
    }
  },

  getAllUsers: async () => {
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
      showToast(message, 'error');
      return { success: false, error: message };
    }
  },

  getUsersSummary: async () => {
    try {
      set((s) => ({ loadings: { ...s.loadings, usersSummary: true }, error: null }));
      const response = await getUsersSummaryRequest();
      set((s) => ({
        usersSummary: response.data?.data ?? response.data,
        loadings: { ...s.loadings, usersSummary: false },
      }));
    } catch (err) {
      const message = errorMessage(err, 'Error al obtener el resumen de usuarios');
      set((s) => ({ error: message, loadings: { ...s.loadings, usersSummary: false } }));
      showToast(message, 'error');
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
      showToast(message, 'error');
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
      showToast(message, 'error');
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
      showToast(message, 'error');
      return { success: false, error: message };
    }
  },

  getHistoryBank: async () => {
    try {
      set((s) => ({ loadings: { ...s.loadings, history: true }, error: null }));
      const response = await getBankHistoryRequest();
      set((s) => ({
        history: response.data?.data ?? response.data,
        loadings: { ...s.loadings, history: false },
      }));
    } catch (err) {
      const message = errorMessage(err, 'Error al obtener el historial');
      set((s) => ({ error: message, loadings: { ...s.loadings, history: false } }))
      showToast(message, 'error');
      return { success: false, error: message };
    }
  },

  getAllProducts: async () => {
    try {
      set((s) => ({ loadings: { ...s.loadings, products: true }, error: null }));
      const response = await getAllProductsRequest();
      set((s) => ({
        products: response.data?.data ?? response.data,
        loadings: { ...s.loadings, products: false },
      }));
    } catch (err) {
      const message = errorMessage(err, 'Error al obtener los productos');
      set((s) => ({ error: message, loadings: { ...s.loadings, products: false } }));
      showToast(message, 'error');
      return { success: false, error: message };
    }
  },

  createProduct: async (data) => {
    try {
      set((s) => ({ loadings: { ...s.loadings, action: true }, error: null }));
      const response = await createProductRequest(data);
      set((s) => ({
        products: [...s.products, response.data?.data ?? response.data],
        loadings: { ...s.loadings, action: false },
      }));
      return { success: true, data: response.data };
    } catch (err) {
      const message = errorMessage(err, 'Error al crear el producto');
      set((s) => ({ error: message, loadings: { ...s.loadings, action: false } }));
      showToast(message, 'error');
      return { success: false, error: message };
    }
  },

  updateProduct: async (id, data) => {
    try {
      set((s) => ({ loadings: { ...s.loadings, action: true }, error: null }));
      const response = await updateProductRequest(id, data);
      const updated = response.data?.data ?? response.data;
      set((s) => ({
        products: s.products.map((p) => (p.id === id ? { ...p, ...updated } : p)),
        loadings: { ...s.loadings, action: false },
      }));
      return { success: true, data: updated };
    } catch (err) {
      const message = errorMessage(err, 'Error al actualizar el producto');
      set((s) => ({ error: message, loadings: { ...s.loadings, action: false } }));
      showToast(message, 'error');
      return { success: false, error: message };
    }
  },

  deleteProduct: async (id) => {
    try {
      set((s) => ({ loadings: { ...s.loadings, action: true }, error: null }));
      await deleteProductRequest(id);
      set((s) => ({
        products: s.products.filter((p) => p.id !== id),
        loadings: { ...s.loadings, action: false },
      }));
      return { success: true };
    } catch (err) {
      const message = errorMessage(err, 'Error al eliminar el producto');
      set((s) => ({ error: message, loadings: { ...s.loadings, action: false } }));
      showToast(message, 'error');
      return { success: false, error: message };
    }
  },

  uploadProductImage: async (id, file) => {
    try {
      set((s) => ({ loadings: { ...s.loadings, action: true }, error: null }));
      const response = await uploadProductImageRequest(id, file);
      const updated = response.data?.data ?? response.data;
      set((s) => ({
        products: s.products.map((p) => (p.id === id ? { ...p, ...updated } : p)),
        loadings: { ...s.loadings, action: false },
      }));
      return { success: true, data: updated };
    } catch (err) {
      const message = errorMessage(err, 'Error al subir la imagen del producto');
      set((s) => ({ error: message, loadings: { ...s.loadings, action: false } }));
      showToast(message, 'error');
      return { success: false, error: message };
    }
  },
}));