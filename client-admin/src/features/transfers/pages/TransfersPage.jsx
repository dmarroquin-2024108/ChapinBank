import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftRight, CheckCircle, RotateCcw, Clock, Loader2 } from 'lucide-react';
import { useTransferStore } from '../store/transferStore.js';
import { getMyAccounts } from '../../../shared/apis/accounts.js';
import { TransferModal } from '../components/TransferModal.jsx';

const CANCEL_WINDOW_SECONDS = 30 * 60;

const DetailRow = ({ label, value, accent = false }) => (
  <div className='flex items-center justify-between'>
    <span className='text-xs text-gray-400'>{label}</span>
    <span className={`text-xs font-semibold ${accent ? 'text-orange' : 'text-main-blue'}`}>
      {value}
    </span>
  </div>
);

const TransferSuccessCard = ({ transfer, onCancel, onDismiss, cancelLoading }) => {
  const [secondsLeft, setSecondsLeft] = useState(CANCEL_WINDOW_SECONDS);
  const canCancel = secondsLeft > 0;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  return (
    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6'>
      <div className='flex items-start gap-3 mb-5'>
        <div className='w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0'>
          <CheckCircle size={20} className='text-green-500' />
        </div>
        <div>
          <p className='text-sm font-bold text-main-blue'>Transferencia enviada</p>
          <p className='text-xs text-gray-400 mt-0.5'>
            El destinatario recibirá un correo para aceptar o rechazar.
          </p>
        </div>
      </div>

      <div className='bg-gray-50 rounded-xl p-4 space-y-2 mb-5'>
        <DetailRow label='N° operación' value={transfer.noOperacion} />
        <DetailRow label='Cuenta origen' value={transfer.numberAccountOrigin} />
        <DetailRow label='Cuenta destino' value={transfer.numberAccountDestination} />
        <DetailRow
          label='Monto'
          value={`${transfer.currency} ${parseFloat(transfer.amount).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`}
          accent
        />
        {transfer.currency !== 'GTQ' && (
          <DetailRow
            label='Equivalente GTQ'
            value={`Q ${parseFloat(transfer.amountInGTQ).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`}
          />
        )}
        {transfer.currency !== 'GTQ' && (
          <DetailRow
            label='Tasa de cambio'
            value={`1 ${transfer.currency} = Q ${transfer.exchangeRate}`}
          />
        )}
        <DetailRow
          label='Comisión'
          value={`Q ${parseFloat(transfer.commision).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`}
        />
        <DetailRow
          label='Nuevo saldo origen'
          value={`Q ${parseFloat(transfer.nuevoBalanceOrigen).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`}
        />
        <DetailRow label='Estado' value={transfer.status} />
      </div>

      <div className='mb-4'>
        <div className='flex items-center justify-between mb-1.5'>
          <span className='text-xs text-gray-500 flex items-center gap-1'>
            <Clock size={12} />
            {canCancel ? 'Tiempo para cancelar' : 'Tiempo expirado'}
          </span>
          <span className={`text-xs font-bold ${canCancel ? 'text-orange' : 'text-gray-400'}`}>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>
        <div className='h-1.5 bg-gray-100 rounded-full overflow-hidden'>
          <div
            className='h-full bg-orange rounded-full transition-all duration-1000'
            style={{ width: `${(secondsLeft / CANCEL_WINDOW_SECONDS) * 100}%` }}
          />
        </div>
      </div>

      <div className='flex gap-3'>
        {canCancel && (
          <button
            type='button'
            disabled={cancelLoading}
            onClick={() => onCancel(transfer.transferToken)}
            className='flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer'
          >
            <RotateCcw size={14} className={cancelLoading ? 'animate-spin' : ''} />
            {cancelLoading ? 'Cancelando…' : 'Cancelar transferencia'}
          </button>
        )}
        <button
          type='button'
          onClick={onDismiss}
          className='flex-1 bg-main-blue hover:bg-main-blue/90 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors duration-150 cursor-pointer'
        >
          Nueva transferencia
        </button>
      </div>
    </div>
  );
};

export const TransferPage = () => {
  const { createTransfer, confirmTransfer, loading, lastTransfer, clearLastTransfer } =
    useTransferStore();

  const [accounts, setAccounts] = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accountsError, setAccountsError] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    getMyAccounts()
      .then(({ data }) => {
        const list = data.data ?? data.accounts ?? data ?? [];
        setAccounts(list);
      })
      .catch(() => setAccountsError('No se pudieron cargar las cuentas'))
      .finally(() => setAccountsLoading(false));
  }, []);

  const handleSubmit = async (transferData) => {
    await createTransfer(transferData);
  };

  const handleCancel = async (transferToken) => {
    setCancelLoading(true);
    await confirmTransfer({ transferToken, action: 'CANCELAR' });
    setCancelLoading(false);
    clearLastTransfer();
  };

  return (
    <div className='max-w-2xl mx-auto px-4 py-6'>
      <div className='flex items-center gap-4 mb-8'>
        <div className='w-12 h-12 rounded-2xl bg-orange/10 flex items-center justify-center shrink-0'>
          <ArrowLeftRight size={22} className='text-orange' />
        </div>
        <div>
          <h1 className='text-xl font-extrabold text-main-blue leading-tight'>
            Realizar transferencia
          </h1>
          <p className='text-sm text-gray-400 mt-0.5'>
            Envía dinero a cualquier cuenta o a tus favoritos
          </p>
        </div>
      </div>

      {lastTransfer ? (
        <TransferSuccessCard
          transfer={lastTransfer}
          onCancel={handleCancel}
          onDismiss={clearLastTransfer}
          cancelLoading={cancelLoading}
        />
      ) : accountsLoading ? (
        <div className='flex items-center justify-center py-16 gap-2 text-gray-400'>
          <Loader2 size={18} className='animate-spin' />
          <span className='text-sm'>Cargando…</span>
        </div>
      ) : (
        <TransferModal
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
