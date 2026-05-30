import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { ChevronDown, CheckCircle, AlertCircle, Star, Loader2 } from 'lucide-react';
import { Favorites } from './Favorites.jsx';
import { getCurrencyRates } from '../../../shared/apis/transfers.js';

const CURRENCIES = [
  { value: 'GTQ', label: 'GTQ · Q' },
  { value: 'USD', label: 'USD · $' },
  { value: 'EUR', label: 'EUR · €' },
  { value: 'MXN', label: 'MXN · $' },
];

const AVATAR_COLORS = [
  'bg-main-blue',
  'bg-gold',
  'bg-orange',
];

const getInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || '?';

const avatarColor = (str = '') => {
  let h = 0;
  for (const c of str) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
};

const inputClass = (error) =>
  `w-full px-3 py-2.5 text-sm border rounded-lg bg-white text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 transition-all duration-150 ${
    error
      ? 'border-red-400 focus:ring-red-200 focus:border-red-400'
      : 'border-gray-200 focus:ring-orange/30 focus:border-orange hover:border-gray-300'
  }`;

const Field = ({ label, error, children, hint }) => (
  <div className='space-y-1.5'>
    <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide'>
      {label}
    </label>
    {children}
    {hint && !error && <p className='text-xs text-gray-400'>{hint}</p>}
    {error && (
      <p className='flex items-center gap-1 text-xs text-red-500 mt-1'>
        <AlertCircle size={12} />
        {error}
      </p>
    )}
  </div>
);

const CustomSelect = ({ value, onChange, options, disabled = false }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className='relative' ref={ref}>
      <button
        type='button'
        disabled={disabled}
        onClick={() => setOpen((p) => !p)}
        className={`w-full flex items-center justify-between px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all duration-150 ${
          disabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-gray-300 cursor-pointer'
        }`}
      >
        <span className='truncate'>{selected?.label ?? 'Selecciona…'}</span>
        <ChevronDown
          size={15}
          className={`text-gray-400 shrink-0 ml-2 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <ul className='absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1'>
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type='button'
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors duration-100 ${
                  value === opt.value
                    ? 'bg-orange/10 text-orange font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const TransferModal = ({ accounts, accountsLoading, accountsError, onSubmit, loading }) => {
  const [transferType, setTransferType] = useState('externa');
  const [currency, setCurrency] = useState('GTQ');
  const [originAccount, setOriginAccount] = useState('');
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: '',
      description: '',
      numberAccountDestination: '',
      destinationHolder: '',
    },
  });

  const amount = watch('amount');

  const originOptions = accounts
    .filter((acc) => acc.status)
    .map((acc) => ({
      value: acc.accountNumber,
      label: `${acc.accountType === 'AHORRO' ? 'Ahorro' : 'Monetaria'} · •••• ${acc.accountNumber.slice(-4)} · Q ${parseFloat(
        acc.balance
      ).toLocaleString('es-GT', {
        minimumFractionDigits: 2,
      })}`,
    }));
  const hasActiveAccounts = accounts.some((acc) => acc.status);

  useEffect(() => {
    const activeAccount = accounts.find((acc) => acc.status);
    if (activeAccount) {
      setOriginAccount(activeAccount.accountNumber);
    }
  }, [accounts]);

  const currentOriginAccount = accounts.find((a) => a.accountNumber === originAccount);

  useEffect(() => {
    if (currency === 'GTQ') {
      setExchangeRate(null);
      return;
    }
    getCurrencyRates(currency)
      .then(({ data }) => setExchangeRate(data.data.rates?.GTQ ?? null))
      .catch(() => setExchangeRate(null));
  }, [currency]);

  const switchTab = (tab) => {
    setTransferType(tab);
    setSelectedFavorite(null);
  };

  const handleFormSubmit = async (formData) => {
    const originAcc = accounts.find((a) => a.accountNumber === originAccount);
    const destination =
      transferType === 'favorita' && selectedFavorite
        ? {
            numberAccountDestination: selectedFavorite.accountNumber,
            destinationHolder: selectedFavorite.alias,
          }
        : {
            numberAccountDestination: formData.numberAccountDestination,
            destinationHolder: formData.destinationHolder,
          };

    await onSubmit({
      numberAccountOrigin: originAccount,
      originHolder: originAcc?.accountType ?? '',
      ...destination,
      amount: parseFloat(formData.amount),
      currency,
      description: formData.description,
    });
  };
  const canSubmit =
    originAccount &&
    (transferType === 'externa' || (transferType === 'favorita' && selectedFavorite !== null));
  return (
    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6'>
      <h2 className='text-sm font-bold text-main-blue mb-5'>Detalles de la transferencia</h2>

      {accountsLoading ? (
        <div className='flex items-center justify-center py-10 gap-2 text-gray-400'>
          <Loader2 size={18} className='animate-spin' />
          <span className='text-sm'>Cargando cuentas…</span>
        </div>
      ) : accountsError ? (
        <div className='flex items-center gap-2 text-red-500 text-sm py-4'>
          <AlertCircle size={16} />
          {accountsError}
        </div>
      ) : accounts.length === 0 ? (
        <p className='text-center py-8 text-gray-400 text-sm'>No tienes cuentas registradas.</p>
      ) : !hasActiveAccounts ? (
        <div className='flex items-center gap-2 text-red-500 text-sm py-4'>
          <AlertCircle size={16} />
          No tienes cuentas activas para realizar transferencias.
        </div>
      ) : (
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className='space-y-5'>
          <Field label='Tipo de transferencia'>
            <div className='grid grid-cols-2 gap-2'>
              {[
                { id: 'externa', label: 'A otra cuenta' },
                { id: 'favorita', label: 'Favoritos', icon: <Star size={13} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type='button'
                  onClick={() => switchTab(tab.id)}
                  className={`py-2.5 px-4 text-sm font-semibold rounded-lg border transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 ${
                    transferType === tab.id
                      ? 'bg-white border-orange text-main-blue shadow-sm'
                      : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </Field>

          <Field
            label='Cuenta origen'
            hint={
              currentOriginAccount
                ? `Saldo disponible: Q ${parseFloat(currentOriginAccount.balance).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`
                : undefined
            }
          >
            <CustomSelect
              value={originAccount}
              onChange={setOriginAccount}
              options={originOptions}
            />
          </Field>
          {transferType === 'externa' ? (
            <>
              <Field
                label='Número de cuenta destino'
                error={errors.numberAccountDestination?.message}
              >
                <input
                  type='text'
                  placeholder='Ej. MO00000001'
                  {...register('numberAccountDestination', {
                    required: 'Este campo es obligatorio',
                  })}
                  className={inputClass(errors.numberAccountDestination)}
                />
              </Field>
              <Field label='Nombre del destinatario' error={errors.destinationHolder?.message}>
                <input
                  type='text'
                  placeholder='Nombre completo'
                  {...register('destinationHolder', { required: 'Este campo es obligatorio' })}
                  className={inputClass(errors.destinationHolder)}
                />
              </Field>
            </>
          ) : (
            <Favorites selectedFavorite={selectedFavorite} onSelect={setSelectedFavorite} />
          )}

          {(transferType === 'externa' || selectedFavorite) && (
            <>
              {transferType === 'favorita' && selectedFavorite && (
                <div className='flex items-center gap-2.5 bg-orange/5 border border-orange/20 rounded-xl px-3.5 py-2.5'>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${avatarColor(selectedFavorite.alias)}`}
                  >
                    {getInitials(selectedFavorite.alias)}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-xs font-bold text-main-blue'>{selectedFavorite.alias}</p>
                    <p className='text-xs text-gray-400 truncate'>
                      {selectedFavorite.accountNumber}
                    </p>
                  </div>
                  <CheckCircle size={15} className='text-orange shrink-0' />
                </div>
              )}

              <div className='grid grid-cols-2 gap-4'>
                <Field label='Moneda'>
                  <CustomSelect value={currency} onChange={setCurrency} options={CURRENCIES} />
                </Field>
                <Field label='Monto a transferir' error={errors.amount?.message}>
                  <div className='relative'>
                    <span className='absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400'>
                      Q
                    </span>
                    <input
                      type='number'
                      step='0.01'
                      min='10'
                      max='2000'
                      placeholder='0.00'
                      {...register('amount', {
                        required: 'El monto es requerido',
                        min: { value: 10, message: 'El monto mínimo es Q 10.00' },
                        max: { value: 2000, message: 'El monto máximo es Q 2,000.00' },
                        validate: (val) => /^\d+(\.\d{1,2})?$/.test(val) || 'Máximo 2 decimales',
                      })}
                      className={`${inputClass(errors.amount)} pl-8`}
                    />
                  </div>
                </Field>
              </div>

              {currency !== 'GTQ' && exchangeRate && parseFloat(amount) > 0 && (
                <div className='bg-orange/5 border border-orange/20 rounded-xl px-4 py-3'>
                  <p className='text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2'>
                    Conversión a Quetzales
                  </p>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-bold text-gray-600'>
                      {parseFloat(amount).toLocaleString('es-GT', { minimumFractionDigits: 2 })}{' '}
                      {currency}
                    </span>
                    <span className='text-orange font-bold'>→</span>
                    <span className='text-lg font-extrabold text-orange'>
                      Q{' '}
                      {(parseFloat(amount) * exchangeRate).toLocaleString('es-GT', {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <p className='text-xs text-gray-400 mt-1'>
                    Tipo de cambio: 1 {currency} = Q {exchangeRate}
                  </p>
                </div>
              )}

              <Field label='Descripción (opcional)' error={errors.description?.message}>
                <textarea
                  rows={3}
                  placeholder='Motivo o referencia'
                  {...register('description', {
                    maxLength: { value: 255, message: 'Máximo 255 caracteres' },
                  })}
                  className={`${inputClass(errors.description)} resize-none`}
                />
              </Field>

              <div className='flex gap-3 pt-1'>
                <Link
                  to='/inicio'
                  className='flex-1 flex items-center justify-center border border-gray-200 text-gray-600 text-sm font-semibold py-3 rounded-xl hover:bg-gray-50 transition-all duration-150 text-center'
                >
                  Cancelar movimiento
                </Link>
                <button
                  type='submit'
                  disabled={loading || !canSubmit}
                  className='flex-1 bg-orange hover:bg-[#c07018] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold py-3 rounded-xl transition-colors duration-150 shadow-lg shadow-orange-900/20 cursor-pointer'
                >
                  {loading ? 'Procesando…' : 'Transferir'}
                </button>
              </div>
            </>
          )}
        </form>
      )}
    </div>
  );
};
