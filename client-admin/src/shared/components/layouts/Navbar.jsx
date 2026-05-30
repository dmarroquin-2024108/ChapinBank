import { useAuthStore } from '../../../features/auth/store/authStore.js';
import { AvatarUser } from '../ui/AvatarUser.jsx';

export const Navbar = ({ onLogout }) => {
  const { user } = useAuthStore();
  return (
    <nav className='min-h-14 bg-[#032340] flex items-center justify-between px-3 sm:px-6 py-2 gap-3'>
      <div className='min-w-0'>
        <span className='text-white font-extrabold text-sm sm:text-lg mt-0.5'>Hola</span>{' '}
        <span className='text-[#F28C00] font-extrabold text-sm sm:text-lg mt-0.5 truncate'>
          {user.name}
        </span>
        <p className='hidden sm:block text-xs font-bold text-white mt-0.5 mb-0.5'>
          ¿Qué vamos a realizar hoy?
        </p>
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
