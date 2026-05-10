import { create } from 'zustand';
import {
  getPerfil as getPerfilRequest,
  editPerfil as editPerfilRequest,
  getAllUsers as getAllUsersRequest,
} from '../../../shared/apis';
import { errorMessage } from '../../../shared/utils/errorMessage';

export const useUserStore = create((set) => ({
  users: [],
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
      const message = errorMessage(err, 'No se pudo obtener el perfil');
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
      const message = errorMessage(err, 'Error al actualizar el perfil');
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  getAllUsers: async (apiFn = getAllUsersRequest, options = {}) => {
    try {
      const { force = false } = options;
      const state = get();

      if (state.loading) return;
      if (!force && state.users.length > 0) return;

      set({ loading: true, error: null });
      const fetcher = typeof apiFn === 'function' ? apiFn : getAllUsersRequest;
      const response = await fetcher();

      set({
        users: response.users || response,
        loading: false,
      });
    } catch (e) {
      const message = errorMessage(err, 'Error al listar usuarios');
      set({
        error: message,
        loading: false,
      });
      return { success: false, error: message };
    }
  },
}));
