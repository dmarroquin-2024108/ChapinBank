import { useAuthStore } from '../../../features/auth/store/authStore.js';
import { AvatarUser } from '../ui/AvatarUser.jsx';

export const Navbar = ({ onLogout }) => {
  const { user } = useAuthStore();
  return (
    <nav className='h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0'>
      <div>
        <h1 className='text-xl font-semibold text-slate-800'>{`¡Hola ` + user.name + `!`}</h1>
        <p className='text-xs text-gray-400 mt-0.5'>¿Qué vamos a realizar hoy?</p>
      </div>
      <div className='flex items-center gap-3'>
        <span className='text-xs border border-orange text-orange px-3 py-1 rounded-full font-medium flex items-center gap-1'>
          Modo Administrador
        </span>
        <AvatarUser onLogout={onLogout} />
      </div>
    </nav>
  );
};
