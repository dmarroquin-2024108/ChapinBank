import { create } from "zustand";
import {
    getUsers as getUsersRequest,
    adminCreateUser as adminCreateUserRequest,
    adminDeleteUser as adminDeleteUserRequest,
    requestSelfDelete as requestSelfDeleteRequest,
    confirmSelfDelete as confirmSelfDeleteRequest,
    getHistoryBank as getHistoryBankRequest,
    getAllProducts as getAllProductsRequest,
    getAllAccounts as getAllAccountsRequest,
    getAllUsers as getAllUsersRequest
} from '../../../shared/apis';
import { errorMessage } from "../../../shared/utils/errorMessage.js";

export const useAdminStore = create((set, get) => ({
    users: [],
    history: [],
    products: [],
    accounts: null,
    loadings: {
        users: false,
        history: false,
        products: false,
        accounts: false,

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
            const message = errorMessage(err, "Error al crear el usuario");
            set((s) => ({ error: message, loadings: { ...s.loadings, action: false } }));
            return { success: false, error: message };
        }
    },

    deleteUser: async (userId) => {
        try {
            set((s) => ({ loadings: { ...s.loadings, action: true }, error: null }));
            await adminDeleteUserRequest(userId);
            set((s) => ({
                users: s.users.filter((u) => u.idUserResponse !== userId),
                loadings: { ...s.loadings, action: false },
            }));
            return { success: true };
        } catch (err) {
            const message = errorMessage(err, "Error al eliminar el usuario");
            set((s) => ({ error: message, loadings: { ...s.loadings, action: false } }));
            return { success: false, error: message };
        }
    },

    requestSelfDelete: async () => {
        try {
            set((s) => ({ loadings: { ...s.loadings, action: true }, error: null }));
            await requestSelfDeleteRequest();
            set((s) => ({ loadings: { ...s.loadings, action: false } }));
            return { success: true };
        } catch (err) {
            const message = errorMessage(err, "Error al solicitar eliminación");
            set((s) => ({ error: message, loadings: { ...s.loadings, action: false } }));
            return { success: false, error: message };
        }
    },

    confirmSelfDelete: async ({token}) => {
        try {
            set((s) => ({ loadings: { ...s.loadings, action: true }, error: null }));
            await confirmSelfDeleteRequest({token});
            set((s) => ({ loadings: { ...s.loadings, action: false } }));
            return { success: true };
        } catch (err) {
            const message = errorMessage(err, "Token inválido o expirado");
            set((s) => ({ error: message, loadings: { ...s.loadings, action: false } }));
            return { success: false, error: message };
        }
    },

    getUsers: async () => {
        try {
            set((s) => ({ loadings: { ...s.loadings, users: true }, error: null }));
            const response = await getUsersRequest();
            set((s) => ({
                users: response.data?.data ?? response.data,
                loadings: { ...s.loadings, users: false },
            }));
        } catch (err) {
            const message = errorMessage(err, "Error al obtener los usuarios");
            set((s) => ({ error: message, loadings: { ...s.loadings, users: false } }));
            return { success: false, error: message };
        }
    },

    getHistoryBank: async () => {
        try {
            set((s) => ({ loadings: { ...s.loadings, history: true }, error: null }));
            const response = await getHistoryBankRequest();
            set((s) => ({ history: response.data.data, loadings: { ...s.loadings, history: false } }));
        } catch (err) {
            const message = errorMessage(err, "Error al obtener el historial");
            set((s) => ({ error: message, loadings: { ...s.loadings, history: false } }));
            return { success: false, error: message };
        }
    },

    getAllProducts: async () => {
        try {
            set((s) => ({ loadings: { ...s.loadings, products: true }, error: null }));
            const response = await getAllProductsRequest();
            set((s) => ({ products: response.data.data, loadings: { ...s.loadings, products: false } }));
        } catch (err) {
            const message = errorMessage(err, "Error al obtener los productos");
            set((s) => ({ error: message, loadings: { ...s.loadings, products: false } }));
            return { success: false, error: message };
        }
    },

    getAllAccounts: async () => {
        try {
            set((s) => ({ loadings: { ...s.loadings, accounts: true }, error: null }));
            const response = await getAllAccountsRequest();
            set((s) => ({ accounts: response.data.data, loadings: { ...s.loadings, accounts: false } }));
        } catch (err) {
            const message = errorMessage(err, "Error al obtener las cuentas");
            set((s) => ({ error: message, loadings: { ...s.loadings, accounts: false } }));
            return { success: false, error: message };
        }
    },

    getAllUsers: async () => {
        try {
            set((s) => ({ loadings: { ...s.loadings, users: true }, error: null }));
            const response = await getAllUsersRequest();
            set((s) => ({ users: response.data.data, loadings: { ...s.loadings, users: false } }));
        } catch (err) {
            const message = errorMessage(err, "Error al obtener los usuarios");
            set((s) => ({ error: message, loadings: { ...s.loadings, users: false } }));
            return { success: false, error: message };
        }
    },
}));