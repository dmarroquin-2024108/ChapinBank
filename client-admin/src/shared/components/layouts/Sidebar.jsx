import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, CreditCard, History, LogOut, X } from 'lucide-react';
import imgLogo from '../../../assets/img/ChapinLogo.png';

export const Sidebar = ({ onLogout, isOpen, onClose }) => {
  const location = useLocation();

  const items = [
    { label: 'Resumen', icon: LayoutDashboard, to: '/dashboard', exact: true },
    { label: 'Productos', icon: Package, to: '/dashboard/products' },
    { label: 'Usuarios', icon: Users, to: '/dashboard/users' },
    { label: 'Cuentas', icon: CreditCard, to: '/dashboard/accounts' },
    { label: 'Historial', icon: History, to: '/dashboard/historial' },
  ];

  return (
    <>
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/40 z-30 md:hidden'
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0 h-screen min-h-screen z-40
          w-56 sm:w-64 md:w-50 bg-[#032340] flex flex-col
          transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className='px-5 py-5 border-b-1 border-gray-600 flex items-center justify-between'>
          <div className='flex items-center justify-center md:justify-start gap-2'>
            <div className='w-8 h-8 flex items-center justify-center shrink-0'>
              <img src={imgLogo} alt='ChapinBank Logo' />
            </div>
            <span className='block text-white font-bold text-lg whitespace-nowrap'>
              Chapin<span className='text-orange'>Bank</span>
            </span>
          </div>
          <button onClick={onClose} className='text-gray-400 hover:text-white md:hidden'>
            <X size={20} />
          </button>
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
                onClick={onClose}
                className={`flex items-center gap-3 px-3 md:px-5 py-3 text-sm font-medium transition-colors duration-150
                              ${
                                active
                                  ? 'bg-orange text-white rounded-lg mx-2'
                                  : 'text-gray-400 hover:text-white hover:bg-white/5 mx-2 rounded-lg'
                              }`}
              >
                <Icon size={17} className='shrink-0' />
                <span className='whitespace-nowrap'>{label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          className='flex items-center gap-3 px-3 md:px-7 py-5 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer border-t border-gray-600'
          onClick={onLogout}
        >
          <LogOut size={16} className='shrink-0' />
          <span className='whitespace-nowrap'>Cerrar Sesión</span>
        </button>
      </aside>
    </>
  );
};