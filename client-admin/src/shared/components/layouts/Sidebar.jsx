import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, CreditCard, History, LogOut } from 'lucide-react';
import imgLogo from '../../../assets/img/ChapinLogo.png';

export const Sidebar = ({ onLogout }) => {
  const location = useLocation();

  const items = [
    { label: 'Resumen', icon: LayoutDashboard, to: '/dashboard', exact: true },
    { label: 'Productos', icon: Package, to: '/dashboard/products' },
    { label: 'Usuarios', icon: Users, to: '/dashboard/users' },
    { label: 'Cuentas', icon: CreditCard, to: '/dashboard/accounts' },
    { label: 'Historial', icon: History, to: '/dashboard/historial' },
  ];

  return (
    <aside className='w-16 sm:w-20 md:w-50 min-h-screen bg-[#032340] flex flex-col transition-all duration-300'>
      <div className='px-5 py-5 border-b-1 border-gray-600'>
        <div className='flex items-center justify-center md:justify-start gap-2'>
          <div className='w-8 h-8 flex items-center justify-center shrink-0'>
            <img src={imgLogo} alt='ChapinBank Logo' />
          </div>
          <span className='hidden md:block text-white font-bold text-lg whitespace-nowrap'>
            Chapin<span className='text-orange'>Bank</span>
          </span>
        </div>
      </div>

      <nav className='flex-1 mt-2'>
        {items.map(({ label, icon: Icon, to, exact }) => {
          const active = exact
            ? location.pathname === to
            : location.pathname === to || location.pathname.startsWith(to + '/');
          return (
            <Link
              key={label}
              to={to}
              className={`flex items-center justify-center md:justify-start gap-3 px-3 md:px-5 py-3 text-sm font-medium transition-colors duration-150
                            ${
                              active
                                ? 'bg-orange text-white rounded-lg mx-2'
                                : 'text-gray-400 hover:text-white hover:bg-white/5 mx-2 rounded-lg'
                            }`}
            >
              <Icon size={17} className='shrink-0' />
              <span className='hidden md:inline whitespace-nowrap'>{label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        className='flex items-center justify-center md:justify-start gap-3 px-3 md:px-7 py-5 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer border-t border-gray-600'
        onClick={onLogout}
      >
        <LogOut size={16} className='shrink-0' />
        <span className='hidden md:inline whitespace-nowrap'>Cerrar Sesión</span>
      </button>
    </aside>
  );
};
