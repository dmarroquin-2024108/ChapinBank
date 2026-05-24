import { useState, useRef, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import { useAuthStore } from '../../../features/auth/store/authStore.js';
import { ProfileModal } from '../../../features/users/components/ProfileModal.jsx';

export const AvatarUser = ({ onLogout }) => {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpen = () => {
    setOpen(false);
    setTimeout(() => setShowProfile(true), 50);
  };

  const roleLabel = {
    SUPERADMIN_ROLE: 'SuperAdmin',
    ADMIN_ROLE: 'Administrador',
    USER_ROLER: 'Usuario',
  };

  return (
    <>
      <div className='relative' ref={dropdownRef}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className='w-9 h-9 rounded-full bg-orange text-white flex items-center justify-center text-sm font-bold hover:opacity-80 transition cursor-pointer border-2 border-orange/30'
        >
          {user?.username?.slice(0, 2).toUpperCase() ?? 'AD'}
        </button>

        {open && (
          <div className='absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50'>
            <div className='px-4 py-3 border-b border-gray-100 text-center'>
              <p className='text-sm font-semibold text-main-blue truncate text-center'>
                {user.name + ' ' + user.surname ?? 'Administrador'}
              </p>
              <p className='text-xs text-gray-400 mt-0.5 break-all'>{user?.email ?? ''}</p>
            </div>

            <button
              className='w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition cursor-pointer'
              onClick={handleOpen}
            >
              <User size={15} />
              Mi Perfil
            </button>
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
      <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} userBase={user} />
    </>
  );
};
