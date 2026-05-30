import { useEffect, useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useAccountStore } from '../../accounts/store/accountsStore.js';
import { HistoryList } from '../components/HistoryList.jsx';

export const UserHistoryPage = () => {
  const {
    accounts,
    fetchAccounts,
    accountHistory,
    loadingHistory,
    fetchAccountHistory,
    loading,
    error,
  } = useAccountStore();

  const [selectedAccountNumber, setSelectedAccountNumber] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    if (accounts.length === 0) fetchAccounts();
  }, []);

  useEffect(() => {
    if (accounts.length > 0 && !selectedAccountNumber) {
      const first = accounts[0].accountNumber;
      setSelectedAccountNumber(first);
      fetchAccountHistory(first);
    }
  }, [accounts]);

  const handleAccountChange = (accountNumber) => {
    setSelectedAccountNumber(accountNumber);
    if (accountNumber) fetchAccountHistory(accountNumber);
    setSearch('');
    setTypeFilter('all');
  };

  const selectedAccountData = accounts.find((acc) => acc.accountNumber === selectedAccountNumber);

  //filtrar localmente sobre los 5 que ya llegarn
  const filteredMovements = useMemo(() => {
    return accountHistory.filter((mov) => {
      const matchType = typeFilter === 'all' || mov.type === typeFilter;
      const matchSearch =
        search === '' ||
        (mov.description ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (mov.type ?? '').toLowerCase().includes(search.toLowerCase());
      return matchType && matchSearch;
    });
  }, [accountHistory, search, typeFilter]);

  return (
    <div className='p-6 space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-[#0d1f35]'>Historial de movimientos</h1>
        <p className='text-gray-500 text-sm mt-1'>Tus movimientos por cuenta</p>
      </div>

      {loading ? (
        <div className='h-10 bg-gray-100 rounded-lg animate-pulse w-full' />
      ) : error ? (
        <p className='text-sm text-orange-500 bg-orange-50 border border-orange-100 rounded-lg px-4 py-3'>
          {error}
        </p>
      ) : accounts.length > 0 ? (
        <div className='flex flex-col sm:flex-row gap-3'>
          <div className='relative flex-1'>
            <Search size={15} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
            <input
              type='text'
              placeholder='Buscar por descripción...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all'
            />
          </div>

          {/*ya no puedo maps... */}
          <select
            value={selectedAccountNumber || ''}
            onChange={(e) => handleAccountChange(e.target.value)}
            className='px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all'
          >
            {accounts.map((acc) => (
              <option key={acc.accountNumber} value={acc.accountNumber}>
                {acc.accountType} ···· {acc.accountNumber?.slice(-4)}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className='px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all'
          >
            <option value='all'>Todos los tipos</option>
            <option value='DEPOSIT'>Depósito</option>
            <option value='TRANSFER'>Transferencia</option>
            <option value='TRANSACTION'>Transacción</option>
          </select>
        </div>
      ) : (
        <p className='text-sm text-gray-400'>No tienes cuentas registradas.</p>
      )}

      <HistoryList
        movements={filteredMovements}
        title={
          selectedAccountData
            ? `Movimientos — ${selectedAccountData.accountType} ···· ${selectedAccountNumber?.slice(-4)}`
            : 'Movimientos'
        }
        loading={loadingHistory}
      />
    </div>
  );
};
