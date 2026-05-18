import { useEffect, useMemo } from 'react';
import { useAccountStore } from '../accounts/store/accountsStore.js';
import { HistoryList } from './HistoryList.jsx';

export const ClientHistory = () => {
  const { accounts, accountHistory, loadingHistory, fetchAccountHistory } = useAccountStore();

  // Obtener historial de todas las cuentas activas
  useEffect(() => {
    if (accounts.length > 0) {
      const activeAccounts = accounts.filter((acc) => acc.status === 'ACTIVE');
      if (activeAccounts.length > 0) {
        fetchAccountHistory(activeAccounts[0].accountNumber);
      }
    }
  }, [accounts, fetchAccountHistory]);

  // Combinar y ordenar últimos 5 movimientos
  const latestMovements = useMemo(() => {
    if (accounts.length === 0) return [];

    const allMovements = [];
    accounts.forEach((account) => {
      if (account.accountNumber && accountHistory.length > 0) {
        allMovements.push(
          ...accountHistory.map((mov) => ({
            ...mov,
            accountNumber: account.accountNumber,
            originHolder: account.accountType || account.accountNumber,
          }))
        );
      }
    });

    return allMovements.slice(0, 5);
  }, [accounts, accountHistory]);

  return (
    <section className='bg-white rounded-2xl border border-gray-100 p-5'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-sm font-bold text-[#032340]'>Actividad reciente</h2>
      </div>

      {accounts.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-10 text-center'>
          <p className='text-sm font-medium text-gray-400'>Sin cuentas activas</p>
          <p className='text-xs text-gray-300 mt-1'>Abre una cuenta para ver tu actividad</p>
        </div>
      ) : (
        <HistoryList
          movements={latestMovements}
          title={`Últimos movimientos (${accounts.length} cuenta${accounts.length !== 1 ? 's' : ''})`}
          loading={loadingHistory}
        />
      )}
    </section>
  );
};
