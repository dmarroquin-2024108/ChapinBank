import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownToLine, ArrowLeft } from 'lucide-react';
import { useDepositStore } from '../store/depositStore.js';
import { getMyAccounts } from '../../../shared/apis/accounts.js';
import { DepositModal } from '../components/DepositModal.jsx';
import { DepositSuccessCard } from '../components/DepositSuccessCard.jsx';

export const DepositPage = () => {
  const { createDeposit, revertDeposit, loading, lastDeposit, clearLastDeposit } =
    useDepositStore();
  const [accounts, setAccounts] = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accountsError, setAccountsError] = useState(null);
  const [revertLoading, setRevertLoading] = useState(false);

  useEffect(() => {
    getMyAccounts()
      .then(({ data }) => {
        const list = data.data ?? data.accounts ?? data ?? [];
        setAccounts(list);
      })
      .catch(() => setAccountsError('No se pudieron cargar las cuentas'))
      .finally(() => setAccountsLoading(false));
  }, []);

  const handleSubmit = async (formData) => {
    await createDeposit({
      accountNumber: formData.accountNumber,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      depositMethod: formData.depositMethod,
      description: formData.description?.trim() || undefined,
    });
  };

  const handleRevert = async (depositId) => {
    setRevertLoading(true);
    await revertDeposit(depositId);
    setRevertLoading(false);
    clearLastDeposit();
  };

  return (
    <div className='max-w-2xl mx-auto px-4 py-6'>
      <div className='flex items-center gap-4 mb-8'>
        <div className='w-12 h-12 rounded-2xl bg-[#F28C00]/10 flex items-center justify-center shrink-0'>
          <ArrowDownToLine size={22} className='text-[#F28C00]' />
        </div>
        <div>
          <h1 className='text-xl font-extrabold text-[#032340] leading-tight'>
            Realizar un depósito
          </h1>
          <p className='text-sm text-gray-400 mt-0.5'>Acredita fondos en tus cuentas ChapinBank</p>
        </div>
      </div>

      {lastDeposit ? (
        <DepositSuccessCard
          deposit={lastDeposit}
          onRevert={handleRevert}
          onDismiss={clearLastDeposit}
          revertLoading={revertLoading}
        />
      ) : (
        <DepositModal
          accounts={accounts}
          accountsLoading={accountsLoading}
          accountsError={accountsError}
          onSubmit={handleSubmit}
          loading={loading}
        />
      )}
    </div>
  );
};
