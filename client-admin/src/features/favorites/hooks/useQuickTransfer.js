import { useEffect } from 'react';
import { useAccountStore } from '../../accounts/store/accountsStore.js';
import { useFavoriteStore } from '../store/favoriteStore.js';

export const useQuickTransfer = () => {
  const { accounts, loading, fetchAccounts } = useAccountStore();
  const { quickTransfer, loadings } = useFavoriteStore();

  useEffect(() => {
    if (accounts.length === 0) fetchAccounts();
  }, []);

  return {
    accounts,
    loadingAccounts: loading,
    quickTransfer,
    loadingAction: loadings.action,
  };
};
