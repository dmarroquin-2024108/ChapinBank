import { useAuthStore } from '../../../features/auth/store/authStore.js';
import { AvatarUser } from '../ui/AvatarUser.jsx';
import { Menu } from 'lucide-react';

export const Navbar = ({ onLogout, title, onMenuClick }) => {
  const { user } = useAuthStore();
  return (
    <nav className='min-h-14 bg-[#032340] flex items-center justify-between px-3 sm:px-6 py-2 gap-3'>
      <div className='flex items-center gap-3 min-w-0'>
        <button
          onClick={onMenuClick}
          className='text-white md:hidden shrink-0 p-1'
          aria-label='Abrir menú'
        >
          <Menu size={22} />
        </button>
        <div className='min-w-0'>
          <span className='text-white font-extrabold text-sm sm:text-lg mt-0.5'>{title}</span>
        </div>
      </div>
      <div className='flex items-center gap-2 self-end sm:self-auto'>
        <span className='bg-orange text-[10px] sm:text-xs border border-orange text-white px-2 sm:px-3 py-1 rounded-full font-medium flex items-center gap-1 text-center'>
          Modo Administrador
        </span>
        <AvatarUser onLogout={onLogout} />
      </div>
    </nav>
  );
};