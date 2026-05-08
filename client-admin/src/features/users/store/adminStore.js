import { create } from "zustand";
import {
    getUsers as getUsersRequest,
    adminCreateUser as adminCreateUserRequest,
    adminDeleteUser as adminDeleteUserRequest,
    requestSelfDelete as requestSelfDeleteRequest,
    confirmSelfDelete as confirmSelfDeleteRequest,
} from "../../../shared/apis";
import { errorMessage } from "../../../shared/utils/errorMessage";

export const useAdminStore = create((set) => ({
    users: [],
    loadings:{
        users: false
    },
    loading: null,
    error: null,

    // Admin crea un usuario
    createUser: async (formData) => {
        try {
            set({ loading: true, error: null });
            const { data } = await adminCreateUserRequest(formData);
            set({ loading: false });
            return { success: true, data };
        } catch (err) {
            const message = err.response?.data?.message || "Error al crear el usuario";
            set({ error: message, loading: false });
            return { success: false, error: message };
        }
    },

    // Admin elimina a un usuario directamente
    deleteUser: async (userId) => {
        try {
            set({ loading: true, error: null });
            await adminDeleteUserRequest(userId);
            set({ loading: false });
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || "Error al eliminar el usuario";
            set({ error: message, loading: false });
            return { success: false, error: message };
        }
    },

    // Usuario solicita eliminar su propia cuenta (le llega token al correo)
    requestSelfDelete: async () => {
        try {
            set({ loading: true, error: null });
            await requestSelfDeleteRequest();
            set({ loading: false });
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || "Error al solicitar eliminación";
            set({ error: message, loading: false });
            return { success: false, error: message };
        }
    },

    // Usuario confirma la eliminación con el token que le llegó
    confirmSelfDelete: async (token) => {
        try {
            set({ loading: true, error: null });
            await confirmSelfDeleteRequest(token);
            set({ loading: false });
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || "Token inválido o expirado";
            set({ error: message, loading: false });
            return { success: false, error: message };
        }
    },

    getUsers: async () => {
        try {
            set((s) => ({loadings: { 
                ...s.loadings, 
                users: true },
                error: null }));
            const response = await getUsersRequest();
            set((s) => ({
                users: response.data,
                loadings: { ...s.loadings, users: false },
            }));
        } catch (err) {
            const message = errorMessage(err, "Error al obtener los usuarios");
            set({ error: message, loading: false });
            return { success: false, error: message }
        }
    },
}));