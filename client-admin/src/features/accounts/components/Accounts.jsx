import { useEffect, useState } from 'react';
import { ChevronRight, Plus } from 'lucide-react';
import { useAccountStore } from '../store/accountsStore.js';
import { CuentasModal } from './AccountsModal.jsx';
import { DetailModal } from './DetailModal.jsx';
import { formatDate, formatAmount } from '../../../shared/utils/formatters.js'

const AccountCard = ({ account, onDetail }) => {
  const dark = account.accountType === 'AHORRO';
  return (
    <div
      className={`relative rounded-2xl p-5 flex flex-col justify-between min-h-[155px] overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl ${
        dark ? 'bg-[#032340] text-white' : 'bg-[#F28C00] text-white'
      }`}
    >
      <div
        className='absolute -right-6 -top-6 w-28 h-28 rounded-full opacity-10'
        style={{ background: 'rgba(255,255,255,0.4)' }}
      />
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className={`w-6 h-6 rounded-full ${dark ? 'bg-[#F28C00]/20' : 'bg-white/20'}`} />
          <span className='text-xs font-bold tracking-wider opacity-90'>
            CUENTA {account.accountType}
          </span>
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${dark ? 'bg-white/10' : 'bg-white/20'}`}
        >
          GTQ
        </span>
      </div>
      <div>
        <p className='text-2xl font-extrabold tracking-tight'>Q {formatAmount(account.balance)}</p>
        <p className='text-xs opacity-60 mt-0.5'>•••• {account.accountNumber.slice(-4)}</p>
      </div>
      <div className='flex items-center justify-between mt-1'>
        <span className='text-xs opacity-60'>
          {account.createdAt
            ? formatDate(account.createdAt)
            : '—'}
        </span>
        <button
          onClick={() => onDetail(account.accountNumber)}
          className='text-xs font-semibold flex items-center gap-0.5 opacity-80 hover:opacity-100 transition-opacity cursor-pointer'
        >
          Ver detalle <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
};

export const Cuentas = () => {
  const { accounts, loading, fetchAccounts } = useAccountStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedAccountNumber, setSelectedAccountNumber] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const canCreateAccount = accounts.length < 2;

  const handleDetail = (accountNumber) => {
    setSelectedAccountNumber(accountNumber);
  };

  const handleCloseDetail = () => {
    setSelectedAccountNumber(null);
  };

  return (
    <section>
      <div className='flex items-center justify-between mb-3'>
        <h2 className='text-sm font-bold text-[#032340]'>Sus cuentas registradas</h2>
        <div className='flex items-center gap-2'>
          <span className='text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium'>
            {loading ? '...' : `${accounts.length} cuentas activas`}
          </span>
          {canCreateAccount && (
            <button
              onClick={() => setShowModal(true)}
              className='flex items-center gap-1 text-xs font-semibold text-white bg-[#F28C00] hover:bg-[#d97b00] px-3 py-1 rounded-full transition-colors cursor-pointer'
            >
              <Plus size={13} />
              Nueva cuenta
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {[1, 2].map((i) => (
            <div key={i} className='rounded-2xl bg-gray-100 animate-pulse min-h-[155px]' />
          ))}
        </div>
      ) : accounts.length === 0 ? (
        <div className='bg-white rounded-2xl border border-gray-100 p-10 text-center'>
          <p className='text-sm font-medium text-gray-400'>No tienes cuentas registradas</p>
          <p className='text-xs text-gray-300 mt-1'>Crea tu primera cuenta para comenzar</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {accounts.map((acc) => (
            <AccountCard key={acc.accountNumber} account={acc} onDetail={handleDetail} />
          ))}
        </div>
      )}

      <CuentasModal isOpen={showModal} onClose={() => setShowModal(false)} />

      <DetailModal
        isOpen={!!selectedAccountNumber}
        onClose={handleCloseDetail}
        accountNumber={selectedAccountNumber}
      />
    </section>
  );
};
