import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
    ArrowDownToLine,
    ChevronDown,
    CheckCircle,
    RotateCcw,
    Clock,
    AlertCircle,
    ArrowLeft,
    Loader2,
} from 'lucide-react';
import { useDepositStore } from '../store/depositStore.js';
import { getMyAccounts } from '../../../shared/apis/accounts.js';

const DEPOSIT_METHODS = [
    { value: 'EFECTIVO', label: 'Efectivo' },
    { value: 'CHEQUE', label: 'Cheque' },
];

const CURRENCIES = [{ value: 'GTQ' , label: 'GTQ · Q' }];
const REVERT_LIMIT_SECONDS = 60;

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
        <div className="relative" ref={ref}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen((p) => !p)}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F28C00]/30 focus:border-[#F28C00] transition-all duration-150 ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-gray-300 cursor-pointer'}`}
            >
                <span className="truncate">{selected?.label ?? 'Selecciona…'}</span>
                <ChevronDown size={15} className={`text-gray-400 shrink-0 ml-2 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <ul className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                    {options.map((opt) => (
                        <li key={opt.value}>
                            <button
                                type="button"
                                onClick={() => { onChange(opt.value); setOpen(false); }}
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

const DetailRow = ({ label, value, accent = false }) => (
    <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">{label}</span>
        <span className={`text-xs font-semibold ${accent ? 'text-[#F28C00]' : 'text-[#032340]'}`}>{value}</span>
    </div>
);

const DepositSuccessCard = ({ deposit, onRevert, onDismiss, revertLoading }) => {
    const [secondsLeft, setSecondsLeft] = useState(REVERT_LIMIT_SECONDS);
    const canRevert = secondsLeft > 0;

    useEffect(() => {
        if (secondsLeft <= 0) return;
        const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
        return () => clearInterval(id);
    }, [secondsLeft]);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                    <CheckCircle size={20} className="text-green-500" />
                </div>
                <div>
                    <p className="text-sm font-bold text-[#032340]">Depósito registrado</p>
                    <p className="text-xs text-gray-400 mt-0.5">ID: <span className="font-mono">{deposit.depositId}</span></p>
                </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-2 mb-5">
                <DetailRow label="Cuenta" value={deposit.accountNumber} />
                <DetailRow label="Monto" value={`Q ${parseFloat(deposit.amount).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`} accent />
                <DetailRow label="Método" value={deposit.depositMethod === 'EFECTIVO' ? 'Efectivo' : 'Cheque'} />
                <DetailRow label="Moneda" value={deposit.currency} />
                <DetailRow label="Nuevo saldo" value={`Q ${parseFloat(deposit.balanceActual).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`} />
                {deposit.description && <DetailRow label="Referencia" value={deposit.description} />}
            </div>

            <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={12} />
                        {canRevert ? 'Tiempo para revertir' : 'Tiempo expirado'}
                    </span>
                    <span className={`text-xs font-bold ${canRevert ? 'text-[#F28C00]' : 'text-gray-400'}`}>{secondsLeft}s</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#F28C00] rounded-full transition-all duration-1000" style={{ width: `${(secondsLeft / REVERT_LIMIT_SECONDS) * 100}%` }} />
                </div>
            </div>

            <div className="flex gap-3">
                {canRevert && (
                    <button type="button" disabled={revertLoading} onClick={() => onRevert(deposit.depositId)}
                        className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed">
                        <RotateCcw size={14} className={revertLoading ? 'animate-spin' : ''} />
                        {revertLoading ? 'Revirtiendo…' : 'Revertir'}
                    </button>
                )}
                <button type="button" onClick={onDismiss}
                    className="flex-1 bg-[#032340] hover:bg-[#043a5e] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors duration-150">
                    Nuevo depósito
                </button>
            </div>
        </div>
    );
};

const Field = ({ label, error, children }) => (
    <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
        {children}
        {error && (
            <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                <AlertCircle size={12} />{error}
            </p>
        )}
    </div>
);

const inputClass = (error) =>
    `w-full px-3 py-2.5 text-sm border rounded-lg bg-white text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 transition-all duration-150 ${error ? 'border-red-400 focus:ring-red-200 focus:border-red-400' : 'border-gray-200 focus:ring-[#F28C00]/30 focus:border-[#F28C00] hover:border-gray-300'}`;

export const DepositPage = () => {
    const navigate = useNavigate();
    const { createDeposit, revertDeposit, loading, lastDeposit, clearLastDeposit } = useDepositStore();

    const [accounts, setAccounts] = useState([]);
    const [accountsLoading, setAccountsLoading] = useState(true);
    const [accountsError, setAccountsError] = useState(null);
    const [depositMethod, setDepositMethod] = useState('EFECTIVO');
    const [currency, setCurrency] = useState('GTQ');
    const [selectedAccount, setSelectedAccount] = useState('');
    const [revertLoading, setRevertLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: { amount: '', description: '' },
    });

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                setAccountsLoading(true);
                const { data } = await getMyAccounts();
                const list = data.data ?? data.accounts ?? data ?? [];
                setAccounts(list);
                if (list.length > 0) setSelectedAccount(list[0].accountNumber);
            } catch {
                setAccountsError('No se pudieron cargar las cuentas');
            } finally {
                setAccountsLoading(false);
            }
        };
        fetchAccounts();
    }, []);

    const onSubmit = async (formData) => {
        await createDeposit({
            accountNumber: selectedAccount,
            amount: formData.amount,
            currency,
            depositMethod,
            description: formData.description,
        });
    };

    const handleRevert = async (depositId) => {
        setRevertLoading(true);
        await revertDeposit(depositId);
        setRevertLoading(false);
        handleDismiss();
    };

    const handleDismiss = () => {
        clearLastDeposit();
        reset();
        setDepositMethod('EFECTIVO');
        setCurrency('GTQ');
    };

    const accountOptions = accounts.map((acc) => ({
        value: acc.accountNumber,
        label: `${acc.accountType === 'AHORRO' ? 'Cuenta de Ahorro' : 'Cuenta Monetaria'} · •••• ${acc.accountNumber.slice(-4)} · Q ${parseFloat(acc.balance).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`,
    }));

    const currentAccount = accounts.find((a) => a.accountNumber === selectedAccount);

    return (
        <div className="min-h-screen bg-gray-50 font-['Poppins',sans-serif]">
            <main className="max-w-2xl mx-auto px-4 py-10">

                <button onClick={() => navigate('/inicio')}
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#032340] mb-6 transition-colors">
                    <ArrowLeft size={15} /> Volver al inicio
                </button>

                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-[#F28C00]/10 flex items-center justify-center shrink-0">
                        <ArrowDownToLine size={22} className="text-[#F28C00]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold text-[#032340] leading-tight">Realizar un depósito</h1>
                        <p className="text-sm text-gray-400 mt-0.5">Acredita fondos en tus cuentas ChapinBank</p>
                    </div>
                </div>

                {lastDeposit ? (
                    <DepositSuccessCard deposit={lastDeposit} onRevert={handleRevert} onDismiss={handleDismiss} revertLoading={revertLoading} />
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-sm font-bold text-[#032340] mb-5">Detalles del depósito</h2>

                        {accountsLoading ? (
                            <div className="flex items-center justify-center py-10 gap-2 text-gray-400">
                                <Loader2 size={18} className="animate-spin" />
                                <span className="text-sm">Cargando cuentas…</span>
                            </div>
                        ) : accountsError ? (
                            <div className="flex items-center gap-2 text-red-500 text-sm py-4">
                                <AlertCircle size={16} />{accountsError}
                            </div>
                        ) : accounts.length === 0 ? (
                            <p className="text-center py-8 text-gray-400 text-sm">No tienes cuentas registradas.</p>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

                                <Field label="Cuenta destino">
                                    <CustomSelect value={selectedAccount} onChange={setSelectedAccount} options={accountOptions} />
                                </Field>

                                {currentAccount && (
                                    <div className="bg-gray-50 rounded-xl px-4 py-3">
                                        <p className="text-xs text-gray-400">Saldo actual</p>
                                        <p className="text-lg font-extrabold text-[#032340] mt-0.5">
                                            Q {parseFloat(currentAccount.balance).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                )}

                                <Field label="Método de depósito">
                                    <CustomSelect value={depositMethod} onChange={setDepositMethod} options={DEPOSIT_METHODS} />
                                </Field>

                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="Moneda">
                                        <CustomSelect value={currency} onChange={setCurrency} options={CURRENCIES} />
                                    </Field>
                                    <Field label="Monto a depositar" error={errors.amount?.message}>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">Q</span>
                                            <input type="number" step="0.01" min="1" placeholder="0.00"
                                                {...register('amount', {
                                                    required: 'El monto es requerido',
                                                    min: { value: 1, message: 'El monto mínimo es Q 1.00' },
                                                    validate: (val) => /^\d+(\.\d{1,2})?$/.test(val) || 'Máximo 2 decimales',
                                                })}
                                                className={`${inputClass(errors.amount)} pl-8`}
                                            />
                                        </div>
                                    </Field>
                                </div>

                                <Field label="Referencia (opcional)" error={errors.description?.message}>
                                    <textarea rows={3} placeholder="Agrega una nota o referencia para este depósito"
                                        {...register('description', { maxLength: { value: 255, message: 'Máximo 255 caracteres' } })}
                                        className={`${inputClass(errors.description)} resize-none`}
                                    />
                                </Field>

                                <div className="flex gap-3 pt-1">
                                    <button type="button" onClick={() => navigate('/inicio')}
                                        className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-3 rounded-xl hover:bg-gray-50 transition-all duration-150">
                                        Cancelar movimiento
                                    </button>
                                    <button type="submit" disabled={loading}
                                        className="flex-1 bg-[#F28C00] hover:bg-[#d97b00] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold py-3 rounded-xl transition-colors duration-150 shadow-lg shadow-orange-900/20">
                                        {loading ? 'Procesando…' : 'Confirmar depósito'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default DepositPage;