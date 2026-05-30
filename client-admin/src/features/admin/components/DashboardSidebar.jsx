import { useNavigate } from 'react-router-dom';
import { Plus, UserPlus, CreditCard, History, ChevronRight } from 'lucide-react';

const QUICK_ACTIONS = [
  {
    label: 'Agregar producto',
    icon: Plus,
    to: '/dashboard/products',
    color: 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20',
  },
  {
    label: 'Registrar usuario',
    icon: UserPlus,
    to: '/dashboard/users',
    color: 'bg-orange/10 text-orange hover:bg-orange/20',
  },
  {
    label: 'Gestionar cuentas',
    icon: CreditCard,
    to: '/dashboard/accounts',
    color: 'bg-gold/10 text-amber-800 hover:bg-gold/20',
  },
  {
    label: 'Ver historial',
    icon: History,
    to: '/dashboard/historial',
    color: 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20',
  },
];

const QuickAccess = () => {
  const navigate = useNavigate();
  return (
    <div className='bg-white rounded-2xl p-5 border border-gray-100'>
      <h2 className='text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4'>
        Accesos rápidos
      </h2>
      <div className='grid grid-cols-2 gap-3'>
        {QUICK_ACTIONS.map(({ label, icon: Icon, to, color }) => (
          <button
            key={label}
            onClick={() => navigate(to)}
            className={`flex flex-col items-center justify-center gap-2 rounded-xl p-3 sm:p-4 min-h-[110px] text-[11px] sm:text-xs font-medium transition-colors cursor-pointer ${color}`}
          >
            <div className='w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/60 flex items-center justify-center shrink-0'>
              <Icon size={15} className='sm:w-[18px] sm:h-[18px]' />
            </div>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

const AVATAR_COLORS = ['bg-main-blue',  'bg-orange', 'bg-gold'];

const getInitials = (name = '', surname = '') =>
  `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();

const RecentClients = ({ users = [] }) => {
  const navigate = useNavigate();
  return (
    <div className='bg-white rounded-2xl p-5 border border-gray-100'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-sm font-semibold text-gray-500 uppercase tracking-widest'>
          Clientes recientes
        </h2>
        <button
          onClick={() => navigate('/dashboard/users')}
          className='text-orange text-xs font-medium hover:underline cursor-pointer'
        >
          Ver todos
        </button>
      </div>
      <div className='flex flex-col gap-2'>
        {users.length === 0 ? (
          <p className='text-gray-400 text-sm text-center py-4'>Sin clientes recientes</p>
        ) : (
          users.map((user, i) => (
            <button
              key={user.idUser}
              //onClick={() => navigate(`/dashboard/usuarios/${user.idUser}`)}
              className='flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer w-full text-left'
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
              >
                {getInitials(user.name, user.surname)}
              </div>
              <p className='flex-1 text-sm font-medium text-gray-800 truncate'>
                {user.name} {user.surname}
              </p>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0
                                ${user.status ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-500'}`}
              >
                {user.status ? 'activo' : 'inhabilitado'}
              </span>
              <ChevronRight size={14} className='text-gray-400 shrink-0' />
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export const DashboardSidebar = ({ users }) => (
  <div className='flex flex-col gap-4 w-full xl:w-80 shrink-0'>
    <QuickAccess />
    <RecentClients users={users} />
  </div>
);
