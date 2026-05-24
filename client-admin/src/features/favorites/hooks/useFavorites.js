import { useEffect, useState } from 'react';
import { useFavoriteStore } from '../store/favoriteStore.js';

export const useFavorites = () => {
  const { favorites, loadings, error, getFavorites } = useFavoriteStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    getFavorites();
  }, []);

  const filtered = favorites.filter(
    (f) =>
      f.alias.toLowerCase().includes(search.toLowerCase()) ||
      f.accountNumber.toLowerCase().includes(search.toLowerCase())
  );
  const ahorro = favorites.filter((f) => f.accountType === 'AHORRO').length;
  const monetaria = favorites.filter((f) => f.accountType === 'MONETARIA').length;

  return {
    favorites,
    filtered,
    loadings,
    error,
    search,
    setSearch,
    ahorro,
    monetaria,
  };
};
