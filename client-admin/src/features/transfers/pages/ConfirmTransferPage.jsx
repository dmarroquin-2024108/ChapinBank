import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useTransferStore } from '../store/transferStore.js';

const DetailRow = ({ label, value, accent = false }) => (
  <div className='flex justify-between'>
    <span className='text-xs text-gray-400'>{label}</span>
    <span className={`text-xs font-semibold ${accent ? 'text-orange' : 'text-main-blue'}`}>
      {value}
    </span>
  </div>
);

const ResultCard = ({ action, result }) => {
  const accepted = action === 'ACEPTAR';

  return (
    <div
      className={`rounded-2xl border p-6 text-center ${accepted ? 'border-orange/20 bg-orange/5' : 'border-main-blue/20 bg-main-blue/5'}`}
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${accepted ? 'bg-orange/10' : 'bg-main-blue/10'}`}
      >
        {accepted ? (
          <CheckCircle2 size={28} className='text-orange' />
        ) : (
          <XCircle size={28} className='text-main-blue' />
        )}
      </div>

      <h2
        className={`text-base font-extrabold mb-1 ${accepted ? 'text-orange' : 'text-main-blue'}`}
      >
        {accepted ? 'Transferencia aceptada' : 'Transferencia rechazada'}
      </h2>
      <p className='text-xs text-gray-500 mb-5'>
        {accepted
          ? 'El monto fue acreditado a tu cuenta. El emisor recibirá una notificación.'
          : 'El monto fue reembolsado al emisor. El emisor recibirá una notificación.'}
      </p>

      {result && (
        <div className='bg-white rounded-xl p-4 text-left space-y-2 mb-5 border border-gray-100'>
          {result.transfer?.noOperacion && (
            <DetailRow label='N° operación' value={result.transfer.noOperacion} />
          )}
          {result.nuevoBalanceDestino && (
            <DetailRow
              label='Nuevo saldo'
              value={`Q ${parseFloat(result.nuevoBalanceDestino).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`}
              accent
            />
          )}
          {result.reembolso && (
            <DetailRow
              label='Reembolso al emisor'
              value={`Q ${parseFloat(result.reembolso).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`}
            />
          )}
          {result.transfer?.status && (
            <div className='flex justify-between'>
              <span className='text-xs text-gray-400'>Estado</span>
              <span
                className={`text-xs font-semibold ${accepted ? 'text-orange' : 'text-main-blue'}`}
              >
                {result.transfer.status}
              </span>
            </div>
          )}
          {result.transfer?.description && (
            <DetailRow label='Descripción' value={result.transfer.description} />
          )}
        </div>
      )}

      <Link
        to='/inicio'
        className='inline-flex items-center justify-center w-full bg-main-blue hover:bg-main-blue/90 text-white text-sm font-bold py-3 rounded-xl transition-colors duration-150'
      >
        Ir al inicio
      </Link>
    </div>
  );
};

const AutoConfirmScreen = ({ action }) => {
  const accepted = action === 'ACEPTAR';
  return (
    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-10 flex flex-col items-center gap-4 text-center'>
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center ${accepted ? 'bg-orange/10' : 'bg-red-50'}`}
      >
        <Loader2
          size={26}
          className={`animate-spin ${accepted ? 'text-orange' : 'text-red-400'}`}
        />
      </div>
      <div>
        <p className='text-sm font-bold text-main-blue'>
          {accepted ? 'Aceptando transferencia…' : 'Rechazando transferencia…'}
        </p>
        <p className='text-xs text-gray-400 mt-1'>Por favor espera un momento.</p>
      </div>
    </div>
  );
};

export const ConfirmTransferPage = () => {
  const { confirmTransfer } = useTransferStore();
  const [searchParams] = useSearchParams();

  const urlToken = searchParams.get('token') ?? '';
  const urlAction = searchParams.get('action') ?? '';

  const isAutoFlow = Boolean(urlToken && (urlAction === 'ACEPTAR' || urlAction === 'RECHAZAR'));
  const [loading, setLoading] = useState(isAutoFlow);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const autoFiredRef = useRef(false);

  useEffect(() => {
    if (!isAutoFlow || autoFiredRef.current) return;
    autoFiredRef.current = true;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await confirmTransfer({ transferToken: urlToken, action: urlAction });
        if (res.success) {
          setResult({ action: urlAction, data: res.data });
        } else {
          setError(
            res.error ?? 'No se pudo procesar la transferencia. El token puede haber expirado.'
          );
        }
      } catch {
        setError('Ocurrió un error inesperado. Intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='max-w-lg mx-auto px-4 py-6'>
      <div className='flex items-center gap-4 mb-8'>
        <div className='w-12 h-12 rounded-2xl bg-orange/10 flex items-center justify-center shrink-0'>
          <ShieldCheck size={22} className='text-orange' />
        </div>
        <div>
          <h1 className='text-xl font-extrabold text-main-blue leading-tight'>
            Confirmar transferencia
          </h1>
          <p className='text-sm text-gray-400 mt-0.5'>
            {isAutoFlow
              ? 'Procesando tu respuesta…'
              : 'Acepta o rechaza una transferencia recibida'}
          </p>
        </div>
      </div>

      {result && <ResultCard action={result.action} result={result.data} />}

      {!result && loading && isAutoFlow && <AutoConfirmScreen action={urlAction} />}

      {!result && !loading && error && (
        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4'>
          <div className='flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3.5'>
            <AlertCircle size={16} className='text-red-400 shrink-0 mt-0.5' />
            <p className='text-xs text-red-600 leading-relaxed'>{error}</p>
          </div>
          <Link
            to='/inicio'
            className='inline-flex items-center justify-center w-full border border-gray-200 text-gray-600 text-sm font-semibold py-3 rounded-xl hover:bg-gray-50 transition-all duration-150'
          >
            Volver al inicio
          </Link>
        </div>
      )}
    </div>
  );
};
