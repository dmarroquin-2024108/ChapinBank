import { useState, useEffect } from 'react';
import { CheckCircle, RotateCcw, Clock } from 'lucide-react';

const REVERT_LIMIT_SECONDS = 60;

const DetailRow = ({ label, value, accent = false }) => (
  <div className='flex items-center justify-between'>
    <span className='text-xs text-gray-400'>{label}</span>
    <span className={`text-xs font-semibold ${accent ? 'text-[#F28C00]' : 'text-[#032340]'}`}>
      {value}
    </span>
  </div>
);

export const DepositSuccessCard = ({ deposit, onRevert, onDismiss, revertLoading }) => {
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const elapsed = Math.floor((Date.now() - new Date(deposit.createdAt).getTime()) / 1000);
    return Math.max(0, REVERT_LIMIT_SECONDS - elapsed);
  });

  const canRevert = secondsLeft > 0;

  useEffect(() => {
    if (secondsLeft <= 0) {
      onDismiss();
      return;
    }
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6'>
      <div className='flex items-start gap-3 mb-5'>
        <div className='w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0'>
          <CheckCircle size={20} className='text-orange-500' />
        </div>
        <div>
          <p className='text-sm font-bold text-[#032340]'>Depósito registrado</p>
          <p className='text-xs text-gray-400 mt-0.5'>
            ID: <span className='font-mono'>{deposit.depositId}</span>
          </p>
        </div>
      </div>

      <div className='bg-gray-50 rounded-xl p-4 space-y-2 mb-5'>
        <DetailRow label='Cuenta' value={deposit.accountNumber} />
        <DetailRow
          label='Monto'
          value={`Q ${parseFloat(deposit.amount).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`}
          accent
        />
        <DetailRow
          label='Método'
          value={deposit.depositMethod === 'EFECTIVO' ? 'Efectivo' : 'Cheque'}
        />
        <DetailRow label='Moneda' value={deposit.currency} />
        {deposit.currency !== 'GTQ' && (
          <DetailRow
            label='Equivalente en GTQ'
            value={`Q ${parseFloat(deposit.amountInGTQ).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`}
          />
        )}
        {deposit.currency !== 'GTQ' && (
          <DetailRow
            label='Tasa de cambio'
            value={`1 ${deposit.currency} = Q ${deposit.exchangeRate}`}
          />
        )}
        <DetailRow
          label='Nuevo saldo'
          value={`Q ${parseFloat(deposit.balanceActual).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`}
        />
        {deposit.description && <DetailRow label='Referencia' value={deposit.description} />}
      </div>

      <div className='mb-4'>
        <div className='flex items-center justify-between mb-1.5'>
          <span className='text-xs text-gray-500 flex items-center gap-1'>
            <Clock size={12} />
            {canRevert ? 'Tiempo para revertir' : 'Tiempo expirado'}
          </span>
          <span className={`text-xs font-bold ${canRevert ? 'text-[#F28C00]' : 'text-gray-400'}`}>
            {secondsLeft}s
          </span>
        </div>
        <div className='h-1.5 bg-gray-100 rounded-full overflow-hidden'>
          <div
            className='h-full bg-[#F28C00] rounded-full transition-all duration-1000'
            style={{ width: `${(secondsLeft / REVERT_LIMIT_SECONDS) * 100}%` }}
          />
        </div>
      </div>

      <div className='flex gap-3'>
        {canRevert && (
          <button
            type='button'
            disabled={revertLoading}
            onClick={() => onRevert(deposit.depositId)}
            className='flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed'
          >
            <RotateCcw size={14} className={revertLoading ? 'animate-spin' : ''} />
            {revertLoading ? 'Revirtiendo…' : 'Revertir'}
          </button>
        )}
        <button
          type='button'
          onClick={onDismiss}
          className='flex-1 bg-[#032340] hover:bg-[#043a5e] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors duration-150'
        >
          Nuevo depósito
        </button>
      </div>
    </div>
  );
};
