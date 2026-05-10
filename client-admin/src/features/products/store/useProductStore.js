import { create } from 'zustand';
import {
  getAllProducts as getAllProductsRequest,
  createProduct as createProductRequest,
  updateProduct as updateProductRequest,
  deleteProduct as deleteProductRequest,
} from '../../../shared/apis';
import { errorMessage } from '../../../shared/utils/errorMessage';

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,

  getAllProducts: async () => {
    try {
      set({ loading: true, error: null });
      const response = await getAllProductsRequest();

      set({
        products: response.data.data,
        loading: false,
      });
    } catch (err) {
      const message = errorMessage(err, 'No se pudieron obtener los productos');
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  createProduct: async (data) => {
    try {
      set({ loading: true, error: null });
      const response = await createProductRequest(data);

      set({
        products: [response.data.data, ...get().products],
        loading: false,
      });
    } catch (err) {
      const message = errorMessage(err, 'Error al crear el producto');
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  updateProduct: async (id, data) => {
    try {
      set({ loading: true, error: null });

      const response = await updateProductRequest(id, data);
      set({
        products: get().products.map((product) =>
          product._id === id ? response.data.data : product
        ),
        loading: false,
      });
    } catch (err) {
      const message = errorMessage(err, 'Error al actualizar el producto');
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  deleteProduct: async (id) => {
    try {
      set({ loading: true, error: null });
      await deleteProductRequest(id);
      set({
        products: get().products.filter((product) => product._id !== id),
        loading: false,
      });
    } catch (err) {
      const message = errorMessage(err, 'Error al eliminar el producto');
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },
}));
