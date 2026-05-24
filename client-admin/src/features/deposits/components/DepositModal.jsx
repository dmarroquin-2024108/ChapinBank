import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { ChevronDown, AlertCircle, Loader2 } from 'lucide-react';
import { getCurrency } from '../../../shared/apis/deposits.js';

const DEPOSIT_METHODS = [
  { value: 'EFECTIVO', label: 'Efectivo' },
  { value: 'CHEQUE', label: 'Cheque' },
];

const CURRENCIES = [
  { value: 'GTQ', label: 'GTQ · Q' },
  { value: 'USD', label: 'USD · $' },
  { value: 'EUR', label: 'EUR · €' },
  { value: 'MXN', label: 'MXN · $' },
];

const CustomSelect = ({ value, onChange, options, disabled = false }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className='relative' ref={ref}>
      <button
        type='button'
        disabled={disabled}
        onClick={() => setOpen((p) => !p)}
        className={`w-full flex items-center justify-between px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F28C00]/30 focus:border-[#F28C00] transition-all duration-150 ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-gray-300 cursor-pointer'}`}
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
                className={`w-full text-left px-3 py-2 text-sm transition-colors duration-100 ${value === opt.value ? 'bg-[#F28C00]/10 text-[#F28C00] font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
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

const Field = ({ label, error, children }) => (
  <div className='space-y-1.5'>
    <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wide'>
      {label}
    </label>
    {children}
    {error && (
      <p className='flex items-center gap-1 text-xs text-red-500 mt-1'>
        <AlertCircle size={12} />
        {error}
      </p>
    )}
  </div>
);

const inputClass = (error) =>
  `w-full px-3 py-2.5 text-sm border rounded-lg bg-white text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 transition-all duration-150 ${error ? 'border-red-400 focus:ring-red-200 focus:border-red-400' : 'border-gray-200 focus:ring-[#F28C00]/30 focus:border-[#F28C00] hover:border-gray-300'}`;

export const DepositModal = ({ accounts, accountsLoading, accountsError, onSubmit, loading }) => {
  const [depositMethod, setDepositMethod] = useState('EFECTIVO');
  const [currency, setCurrency] = useState('GTQ');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [exchangeRate, setExchangeRate] = useState(null);

  useEffect(() => {
    if (accounts.length > 0) setSelectedAccount(accounts[0].accountNumber);
  }, [accounts]);

  useEffect(() => {
    if (currency === 'GTQ') {
      setExchangeRate(null);
      return;
    }
    getCurrency(currency)
      .then(({ data }) => setExchangeRate(data.data.exchangeRate))
      .catch(() => setExchangeRate(null));
  }, [currency]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { amount: '', description: '' },
  });

  const amount = watch('amount');

  const accountOptions = accounts
    .filter((acc) => acc.status)
    .map((acc) => ({
      value: acc.accountNumber,
      label: `${
        acc.accountType === 'AHORRO' ? 'Cuenta de Ahorro' : 'Cuenta Monetaria'
      } · •••• ${acc.accountNumber.slice(-4)} · Q ${parseFloat(acc.balance).toLocaleString(
        'es-GT',
        {
          minimumFractionDigits: 2,
        }
      )}`,
    }));

  const currentAccount = accounts.find((a) => a.accountNumber === selectedAccount);

  const handleFormSubmit = (formData) => {
    onSubmit({ accountNumber: selectedAccount, currency, depositMethod, ...formData });
  };

  return (
    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6'>
      <h2 className='text-sm font-bold text-[#032340] mb-5'>Detalles del depósito</h2>

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
      ) : (
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className='space-y-5'>
          <Field label='Cuenta destino'>
            <CustomSelect
              value={selectedAccount}
              onChange={setSelectedAccount}
              options={accountOptions}
            />
          </Field>

          {currentAccount && (
            <div className='bg-gray-50 rounded-xl px-4 py-3'>
              <p className='text-xs text-gray-400'>Saldo actual</p>
              <p className='text-lg font-extrabold text-[#032340] mt-0.5'>
                Q{' '}
                {parseFloat(currentAccount.balance).toLocaleString('es-GT', {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          )}

          <Field label='Método de depósito'>
            <CustomSelect
              value={depositMethod}
              onChange={setDepositMethod}
              options={DEPOSIT_METHODS}
            />
          </Field>

          <div className='grid grid-cols-2 gap-4'>
            <Field label='Moneda'>
              <CustomSelect value={currency} onChange={setCurrency} options={CURRENCIES} />
            </Field>
            <Field label='Monto a depositar' error={errors.amount?.message}>
              <div className='relative'>
                <span className='absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400'>
                  Q
                </span>
                <input
                  type='number'
                  step='0.01'
                  min='1'
                  max={999999999.99}
                  placeholder='0.00'
                  onInput={(e) => {
                    if (e.target.value.length > 12) e.target.value = e.target.value.slice(0, 12);
                  }}
                  {...register('amount', {
                    required: 'El monto es requerido',
                    min: { value: 1, message: 'El monto mínimo es Q 1.00' },
                    max: { value: 999999999.99, message: 'El monto máximo es Q 999,999,999.99' },
                    validate: (val) => /^\d+(\.\d{1,2})?$/.test(val) || 'Máximo 2 decimales',
                  })}
                  className={`${inputClass(errors.amount)} pl-8`}
                />
              </div>
            </Field>
          </div>

          {/* Bloque de conversión */}
          {currency !== 'GTQ' && exchangeRate && parseFloat(amount) > 0 && (
            <div className='bg-[#F28C00]/5 border border-[#F28C00]/20 rounded-xl px-4 py-3'>
              <p className='text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2'>
                Conversión a Quetzales
              </p>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-bold text-gray-600'>
                  $ {parseFloat(amount).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                </span>
                <span className='text-[#F28C00] font-bold'>→</span>
                <span className='text-lg font-extrabold text-[#F28C00]'>
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

          <Field label='Referencia (opcional)' error={errors.description?.message}>
            <textarea
              rows={3}
              placeholder='Agrega una nota o referencia para este depósito'
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
              disabled={loading}
              className='flex-1 bg-[#F28C00] hover:bg-[#d97b00] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold py-3 rounded-xl transition-colors duration-150 shadow-lg shadow-orange-900/20'
            >
              {loading ? 'Procesando…' : 'Confirmar depósito'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
