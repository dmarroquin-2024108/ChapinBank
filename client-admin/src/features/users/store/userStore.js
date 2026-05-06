import { create } from "zustand";
import {
    getPerfil as getPerfilRequest,
    editPerfil as editPerfilRequest
} from "../../../shared/apis";

export const useUserStore = create((set) => ({
    profile: null,
    loading: false,
    error: null,

    getPerfil: async () => {
        try {
            set({ loading: true, error: null });
            const { data } = await getPerfilRequest();
            set({ profile: data.data, loading: false });
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || "No se pudo obtener el perfil";
            set({ error: message, loading: false });
            return { success: false, error: message };
        }
    },

    editPerfil: async (formData) => {
        try {
            set({ loading: true, error: null });
            const { data } = await editPerfilRequest(formData);
            set({ profile: data, loading: false });
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || "Error al actualizar el perfil";
            set({ error: message, loading: false });
            return { success: false, error: message };
        }
    }
}));