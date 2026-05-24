import { create } from 'zustand';
import {
  getFavorites as getFavoritesRequest,
  addFavorite as addFavoriteRequest,
  updateFavorite as updateFavoriteRequest,
  deleteFavorite as deleteFavoriteRequest,
  quickTransfer as quickTransferRequest,
} from '../../../shared/apis';
import { errorMessage } from '../../../shared/utils/errorMessage.js';

export const useFavoriteStore = create((set) => ({
  favorites: [],
  loadings: {
    favorites: false,
    action: false,
  },
  error: null,

  getFavorites: async () => {
    try {
      set((s) => ({ loadings: { ...s.loadings, favorites: true }, error: null }));
      const response = await getFavoritesRequest();
      set((s) => ({
        favorites: response.data?.data ?? [],
        loadings: { ...s.loadings, favorites: false },
      }));
    } catch (err) {
      const message = errorMessage(err, 'Error al obtener los favoritos');
      set((s) => ({ error: message, loadings: { ...s.loadings, favorites: false } }));
      return { success: false, error: message };
    }
  },

  addFavorite: async ({ accountNumber, alias }) => {
    try {
      set((s) => ({ loadings: { ...s.loadings, action: true }, error: null }));
      const { data } = await addFavoriteRequest({ accountNumber, alias });
      set((s) => ({
        favorites: [...s.favorites, data.data],
        loadings: { ...s.loadings, action: false },
      }));
      return { success: true };
    } catch (err) {
      const message = errorMessage(err, 'Error al agregar el favorito');
      set((s) => ({ error: message, loadings: { ...s.loadings, action: false } }));
      return { success: false, error: message };
    }
  },

  updateFavorite: async (id, alias) => {
    try {
      set((s) => ({ loadings: { ...s.loadings, action: true }, error: null }));
      const { data } = await updateFavoriteRequest(id, { alias });
      set((s) => ({
        favorites: s.favorites.map((f) => (f._id === id ? data.data : f)),
        loadings: { ...s.loadings, action: false },
      }));
      return { success: true };
    } catch (err) {
      const message = errorMessage(err, 'Error al actualizar el favorito');
      set((s) => ({ error: message, loadings: { ...s.loadings, action: false } }));
      return { success: false, error: message };
    }
  },

  deleteFavorite: async (id) => {
    try {
      set((s) => ({ loadings: { ...s.loadings, action: true }, error: null }));
      await deleteFavoriteRequest(id);
      set((s) => ({
        favorites: s.favorites.filter((f) => f._id !== id),
        loadings: { ...s.loadings, action: false },
      }));
      return { success: true };
    } catch (err) {
      const message = errorMessage(err, 'Error al eliminar el favorito');
      set((s) => ({ error: message, loadings: { ...s.loadings, action: false } }));
      return { success: false, error: message };
    }
  },

  quickTransfer: async (favoriteId, transferData) => {
    try {
      set((s) => ({ loadings: { ...s.loadings, action: true }, error: null }));
      const { data } = await quickTransferRequest(favoriteId, transferData);
      set((s) => ({ loadings: { ...s.loadings, action: false } }));
      return { success: true, data };
    } catch (err) {
      const message = errorMessage(err, 'Error al realizar la transferencia');
      set((s) => ({ error: message, loadings: { ...s.loadings, action: false } }));
      return { success: false, error: message };
    }
  },
}));
