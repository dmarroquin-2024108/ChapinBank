import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, User, LogOut, Trash2 } from 'lucide-react';
import imgLogo from '../../../assets/img/ChapinLogo.png';
import { useAuthStore } from '../../../features/auth/store/authStore.js';
import { ProfileModal } from '../../../features/users/components/ProfileModal.jsx';
import { NotificationPanel } from '../../../features/notifications/components/Notification.jsx';
import { useNotificationStore } from '../../../features/notifications/store/notificationStore.js';

const NAV_ITEMS = [
  { label: 'Inicio', to: '/inicio', exact: true },
  { label: 'Depósitos', to: '/inicio/depositos', exact: true },
  { label: 'Transferencias', to: '/inicio/transferencias' },
  { label: 'Historial', to: '/inicio/historial', exact: true },
  { label: 'Productos', to: '/inicio/productos' },
  { label: 'Mis productos', to: '/inicio/misProductos' },
  { label: 'Favoritos', to: '/inicio/favoritos' },
];

export const UserNavbar = ({ onLogout }) => {
  const location = useLocation();
  const { user } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const { unreadCount, fetchNotifications } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenProfile = () => {
    setDropdownOpen(false);
    setTimeout(() => setShowProfile(true), 50);
  };

  const handleOpenDeleteAccount = () => {
    setDropdownOpen(false);
    setTimeout(() => setShowDeleteAccount(true), 50);
  };

  const isActive = (to, exact) =>
    exact
      ? location.pathname === to
      : location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <>
      <header className='bg-[#032340] sticky top-0 z-40 shadow-md'>
        <div className='max-w-7xl mx-auto px-6 h-14 flex items-center justify-between'>
          <div className='flex items-center gap-4 flex-1 min-w-0'>
            <div className='flex items-center gap-2 mr-2'>
              <img
                src={imgLogo}
                alt='ChapinBank Logo'
                className='w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 object-contain'
              />
              <span className='text-white font-extrabold text-xs sm:text-sm lg:text-base'>
                Chapin<span className='text-[#F28C00]'>Bank</span>
              </span>
            </div>
            <nav className='flex items-center gap-1 overflow-x-auto whitespace-nowrap flex-1 min-w-0 no-scrollbar'>
              {NAV_ITEMS.map(({ label, to, exact }) => (
                <Link
                  key={label}
                  to={to}
                  className={`flex-shrink-0 px-2 lg:px-3 py-1.5 text-xs lg:text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap ${
                    isActive(to, exact)
                      ? 'bg-[#F28C00] text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className='flex items-center gap-3'>
            <div className='relative' ref={notifRef}>
              <button
                onClick={() => setNotifOpen((prev) => !prev)}
                className='relative text-gray-400 hover:text-white cursor-pointer transition-colors p-1.5'
                aria-label='Notificaciones'
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className='absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-0.5 bg-[#F28C00] rounded-full flex items-center justify-center text-[10px] font-bold text-white leading-none'>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
            </div>

            <div className='relative' ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className='w-8 h-8 rounded-full bg-[#F28C00] flex items-center justify-center text-white text-xs font-black cursor-pointer hover:opacity-90 transition-opacity'
              >
                {user?.username?.slice(0, 2).toUpperCase() ?? 'MJ'}
              </button>

              {dropdownOpen && (
                <div className='absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50'>
                  <div className='px-4 py-3 border-b border-gray-100 text-center'>
                    <p className='text-sm font-semibold text-[#032340] truncate'>
                      {user?.name && user?.surname ? `${user.name} ${user.surname}` : 'Usuario'}
                    </p>
                    <p className='text-xs text-gray-400 mt-0.5 break-all'>{user?.email ?? ''}</p>
                  </div>

                  <button
                    className='w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition cursor-pointer'
                    onClick={handleOpenProfile}
                  >
                    <User size={15} />
                    Mi Perfil
                  </button>
                  <div className='border-t border-gray-100 my-1' />
                  <button
                    onClick={onLogout}
                    className='w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition cursor-pointer'
                  >
                    <LogOut size={15} />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} userBase={user} />
    </>
  );
};
