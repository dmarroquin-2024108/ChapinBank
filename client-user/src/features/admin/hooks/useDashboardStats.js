import { useEffect } from 'react';
import { useAdminStore } from '../store/adminStore';

export const useDashboardStats = () => {
  const {
    history,
    products,
    accounts,
    usersSummary,
    loadings,
    error,
    getHistoryBank,
    getAllProducts,
    getAllAccounts,
    getUsersSummary,
  } = useAdminStore();

  useEffect(() => {
    getHistoryBank();
    getAllProducts();
    getAllAccounts();
    getUsersSummary();
  }, []);

  const loading = Object.values(loadings).some(Boolean);

  return { history, products, accounts, usersSummary, loadings, loading, error };
};