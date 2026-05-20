import { Link } from 'react-router-dom';
import { ArrowDownToLine, ArrowLeftRight, Clock, Package, ArrowUpRight } from 'lucide-react';
import { Cuentas } from '../../accounts/components/Accounts.jsx';
import { useAccountStore } from '../../accounts/store/accountsStore.js';

const QUICK_ACTIONS = [
  { label: 'Depósitos', sub: 'Acredita fondos', icon: ArrowDownToLine, to: '/inicio/depositos' },
  { label: 'Transferencias', sub: 'Envía dinero', icon: ArrowLeftRight, to: '/inicio/transferencias' },
  { label: 'Historial', sub: 'Tus movimientos', icon: Clock, to: '/inicio/historial' },
  { label: 'Mis productos', sub: '0 contratados', icon: Package, to: '/inicio/misProductos' },
];

export const UserPage = () => {
  const { accounts = [] } = useAccountStore();
  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);
  const fmt = (n) =>
    new Intl.NumberFormat('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
      n
    );

  return (
    <div className='max-w-7xl mx-auto px-6 py-6 space-y-6'>
      <section className='bg-[#032340] rounded-2xl px-8 py-6 flex items-center justify-between relative overflow-hidden'>
        <div
          className='absolute right-0 top-0 w-64 h-full opacity-5'
          style={{ background: 'radial-gradient(circle at 80% 50%, #F28C00 0%, transparent 70%)' }}
        />
        <div>
          <p className='text-gray-400 text-xs font-medium uppercase tracking-widest mb-1'>
            Bienvenido
          </p>
          <p className='text-gray-500 text-xs font-semibold uppercase tracking-widest mb-2'>
            Saldo Total Disponible
          </p>
          <p className='text-white text-4xl font-extrabold tracking-tight'>
            Q &nbsp;{accounts.length > 0 ? fmt(totalBalance) : '—'}
          </p>
        </div>
        <Link
          to='/inicio/transferencias'
          className='bg-[#F28C00] hover:bg-[#d97b00] text-white font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors duration-150 shrink-0 shadow-lg shadow-orange-900/30'
        >
          Transferir <ArrowUpRight size={16} />
        </Link>
      </section>

      <section className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {QUICK_ACTIONS.map(({ label, sub, icon: Icon, to }) => (
          <Link
            key={label}
            to={to}
            className='bg-white rounded-2xl p-5 flex flex-col gap-3 text-left border border-gray-100 hover:border-[#F28C00]/30 hover:shadow-md transition-all duration-200 group'
          >
            <div className='w-9 h-9 rounded-xl bg-[#F28C00]/10 flex items-center justify-center group-hover:bg-[#F28C00]/20 transition-colors'>
              <Icon size={18} className='text-[#F28C00]' />
            </div>
            <div>
              <p className='text-sm font-semibold text-[#032340]'>{label}</p>
              <p className='text-xs text-gray-400 mt-0.5'>{sub}</p>
            </div>
          </Link>
        ))}
      </section>

      <div className='grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6'>
        <Cuentas />
        <section className='bg-white rounded-2xl border border-gray-100 p-5'>
          <div className='flex items-center justify-between mb-1'>
            <h2 className='text-sm font-bold text-[#032340]'>Actividad reciente</h2>
            <Link
              to='/inicio/historial'
              className='text-xs text-[#F28C00] font-semibold hover:underline'
            >
              Ver todo
            </Link>
          </div>
          <div className='flex flex-col items-center justify-center py-10 text-center'>
            <p className='text-sm font-medium text-gray-400'>Sin actividad reciente</p>
            <p className='text-xs text-gray-300 mt-1'>Tus movimientos aparecerán aquí</p>
          </div>
        </section>
      </div>
    </div>
  );
};
