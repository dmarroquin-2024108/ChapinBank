import { create } from 'zustand';

export const useProductStore = create((set) => ({
  products: [
    { id: 1, name: 'Seguro de Vida Gold', description: 'Cobertura total', price: 250.00, category: 'Seguros' },
    { id: 2, name: 'Tarjeta Infinite',    description: 'Tasa 1.5%',       price: 0.00,   category: 'Créditos' },
  ],

  // CREATE
  addProduct: (data) =>
    set((state) => ({
      products: [
        ...state.products,
        { ...data, id: Date.now(), price: parseFloat(data.price) },
      ],
    })),

  // UPDATE
  updateProduct: (id, data) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...data, price: parseFloat(data.price) } : p
      ),
    })),

  // DELETE
  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
}));