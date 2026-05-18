import { useEffect, useMemo, useState } from 'react';
import { HistoryList } from '../../transactions/components/HistoryList.jsx';
import { useAdminStore } from '../store/adminStore.js';

export const AdminHistoryPage = () => {
  const { history, users, loadings } = useAdminStore();
  const [selectedUserId, setSelectedUserId] = useState('all');
  const [selectedAccountNumber, setSelectedAccountNumber] = useState('all');
  const [filteredMovements, setFilteredMovements] = useState([]);

  const userAccounts = useMemo(() => {
    if (selectedUserId === 'all') {
      const accounts = new Map();
      history.forEach((mov) => {
        if (mov.accountNumber && !accounts.has(mov.accountNumber)) {
          accounts.set(mov.accountNumber, {
            accountNumber: mov.accountNumber,
            holder: mov.originHolder || mov.accountNumber,
          });
        }
      });
      return Array.from(accounts.values());
    }

    const user = Array.isArray(users)
      ? users.find((u) => u.idUserResponse === selectedUserId)
      : null;
    if (!user || !user.accounts) return [];

    return user.accounts.map((acc) => ({
      accountNumber: acc.accountNumber,
      holder: acc.accountType || acc.accountNumber,
    }));
  }, [selectedUserId, history, users]);

  useEffect(() => {
    let filtered = history;

    if (selectedUserId !== 'all' && Array.isArray(users)) {
      const user = users.find((u) => u.idUserResponse === selectedUserId);
      if (user && user.accounts) {
        const accountNumbers = user.accounts.map((a) => a.accountNumber);
        filtered = filtered.filter((mov) => accountNumbers.includes(mov.accountNumber));
      }
    }

    if (selectedAccountNumber !== 'all') {
      filtered = filtered.filter((mov) => mov.accountNumber === selectedAccountNumber);
    }

    setFilteredMovements(filtered.slice(0, 5));
  }, [selectedUserId, selectedAccountNumber, history, users]);

  useEffect(() => {
    setSelectedAccountNumber('all');
  }, [selectedUserId]);

  return (
    <div className='p-6 space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-[#0d1f35]'>Historial de movimientos</h1>
        <p className='text-gray-500 text-sm mt-1'>Transacciones del banco y sus clientes</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-[#0d1f35] mb-2'>Cliente</label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-transparent transition-all'
          >
            <option value='all'>Todos los clientes</option>
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <option key={user.idUserResponse} value={user.idUserResponse}>
                  {user.firstName} {user.lastName}
                </option>
              ))
            ) : (
              <option disabled>Cargando clientes...</option>
            )}
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-[#0d1f35] mb-2'>Cuenta</label>
          <select
            value={selectedAccountNumber}
            onChange={(e) => setSelectedAccountNumber(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-transparent transition-all'
          >
            <option value='all'>Todas las cuentas</option>
            {userAccounts.length > 0 ? (
              userAccounts.map((acc) => (
                <option key={acc.accountNumber} value={acc.accountNumber}>
                  {acc.holder} • {acc.accountNumber?.slice(-4)}
                </option>
              ))
            ) : (
              <option disabled>
                {selectedUserId === 'all' ? 'Selecciona un cliente' : 'Sin cuentas'}
              </option>
            )}
          </select>
        </div>
      </div>

      <HistoryList
        movements={filteredMovements}
        title={`Últimos 5 movimientos ${selectedAccountNumber !== 'all' ? `(${selectedAccountNumber})` : ''}`}
        loading={loadings?.history}
      />
    </div>
  );
};
