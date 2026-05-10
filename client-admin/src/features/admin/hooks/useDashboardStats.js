import { useEffect } from 'react';
import { useAdminStore } from '../store/adminStore.js';

export const useDashboardStats = () => {
  const {
    history,
    products,
    accounts,
    users,
    loadings,
    error,
    getHistoryBank,
    getAllProducts,
    getAllAccounts,
    getAllUsers,
  } = useAdminStore();

  useEffect(() => {
    getHistoryBank();
    getAllProducts();
    getAllAccounts();
    getAllUsers();
  }, []);

  const loading = Object.values(loadings).some(Boolean);

  return { history, products, accounts, users, loadings, loading, error };
};
