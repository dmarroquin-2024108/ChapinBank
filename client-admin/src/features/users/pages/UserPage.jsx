import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowDownToLine,
  ArrowLeftRight,
  Clock,
  Package,
  ArrowUpRight,
  Loader2,
} from 'lucide-react';
import { Cuentas } from '../../accounts/components/Accounts.jsx';
import { useAccountStore } from '../../accounts/store/accountsStore.js';
import { useHistoryStore } from '../../history/store/Historystore.js';
import { MovementCard } from '../../history/components/Movementcard.jsx';

const QUICK_ACTIONS = [
  { label: 'Depositos', sub: 'Acredita fondos', icon: ArrowDownToLine, to: '/inicio/depositos' },
  {
    label: 'Transferencias',
    sub: 'Envia dinero',
    icon: ArrowLeftRight,
    to: '/inicio/transferencias',
  },
  { label: 'Historial', sub: 'Tus movimientos', icon: Clock, to: '/inicio/historial' },
  { label: 'Mis productos', sub: '0 contratados', icon: Package, to: '/inicio/misProductos' },
];

export const UserPage = () => {
  const navigate = useNavigate();
  const { accounts = [] } = useAccountStore();
  const { userRecentMovements, loadings, fetchUserRecentMovements } = useHistoryStore();

  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);
  const fmt = (n) =>
    new Intl.NumberFormat('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
      n
    );

  useEffect(() => {
    fetchUserRecentMovements();
  }, []);

  return (
    <div className='max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-6'>
      {/* Banner saldo total */}
      <section className='bg-[#032340] rounded-2xl px-4 sm:px-6 lg:px-8 py-5 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden'>
        <div
          className='absolute right-0 top-0 w-64 h-full opacity-5 pointer-events-none'
          style={{ background: 'radial-gradient(circle at 80% 50%, #F28C00 0%, transparent 70%)' }}
        />
        <div>
          <p className='text-gray-400 text-xs font-medium uppercase tracking-widest mb-1'>
            Bienvenido
          </p>
          <p className='text-gray-500 text-xs font-semibold uppercase tracking-widest mb-2'>
            Saldo Total Disponible
          </p>
          <p className='text-white text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight break-all'>
            Q &nbsp;{accounts.length > 0 ? fmt(totalBalance) : '—'}
          </p>
        </div>
        <button
          onClick={() => navigate('/inicio/transferencias')}
          className='bg-[#F28C00] hover:bg-[#d97b00] cursor-pointer text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors duration-150 shrink-0 shadow-lg shadow-orange-900/30 w-full sm:w-auto'
        >
          Transferir <ArrowUpRight size={16} />
        </button>
      </section>

      {/* Acciones rapidas */}
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

      {/* Cuentas + Movimientos recientes */}
      <div className='grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6'>
        <Cuentas />

        <section className='bg-white rounded-2xl border border-gray-100 overflow-hidden'>
          <div className='flex items-center justify-between px-5 py-4 border-b border-gray-100'>
            <h2 className='text-sm font-bold text-[#032340]'>Movimientos recientes</h2>
            <Link
              to='/inicio/historial'
              className='text-xs text-[#F28C00] font-semibold hover:underline'
            >
              Ver todo
            </Link>
          </div>

          {loadings.userRecent ? (
            <div className='flex items-center justify-center py-10 gap-2 text-gray-400'>
              <Loader2 size={16} className='animate-spin' />
              <span className='text-sm'>Cargando...</span>
            </div>
          ) : userRecentMovements.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-10 text-center'>
              <p className='text-sm font-medium text-gray-400'>Sin movimientos recientes</p>
              <p className='text-xs text-gray-300 mt-1'>Tus movimientos apareceran aqui</p>
            </div>
          ) : (
            <div>
              {userRecentMovements.map((mov) => (
                <MovementCard key={mov.id ?? mov._id} mov={mov} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
