import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore.js';

export const LoginForm = ({ onForgot, onTempPassword, onActivate }) => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const res = await login(data);
    if (res.success) {
      const role = useAuthStore.getState().user?.role;
      if (role === 'USER_ROLE') {
        navigate('/inicio');
      } else {
        navigate('/dashboard');
      }
      toast.success('¡Bienvenido!', { duration: 3000 });
    } else if (res.requiresPasswordChange) {
      onTempPassword();
    } else {
      toast.error(res.error, { duration: 3000 });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 sm:space-y-5'>
      <div>
        <label
          htmlFor='emailOrUsername'
          className='block text-xs sm:text-sm font-semibold text-main-blue mb-1.5'
        >
          Email o Username
        </label>
        <div className='relative'>
          <Mail size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
          <input
            type='text'
            id='emailOrUsername'
            placeholder='correo@example.com o Username'
            className='w-full bg-white pl-9 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold placeholder-gray-400 text-sm min-w-0'
            {...register('emailOrUsername', {
              required: 'Este campo es obligatorio',
            })}
          />
        </div>
        {errors.emailOrUsername && (
          <p className='text-red-600 text-xs mt-1'>{errors.emailOrUsername.message}</p>
        )}
      </div>

      <div>
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-1'>
          <label
            htmlFor='password'
            className='block text-xs sm:text-sm font-semibold text-main-blue mb-1.5'
          >
            Contraseña
          </label>

          <button
            type='button'
            onClick={onForgot}
            className='text-orange text-xs hover:underline hover:cursor-pointer sm:ml-1 text-left'
          >
            ¿Olvidaste Contraseña?
          </button>
        </div>

        <div className='relative'>
          <Lock size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
          <input
            type='password'
            id='password'
            placeholder='* * * * * * *'
            className='w-full bg-white pl-9 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold placeholder-gray-400 text-sm min-w-0'
            {...register('password', {
              required: 'Este campo es obligatorio',
            })}
          />
        </div>
        {errors.password && <p className='text-red-600 text-xs mt-1'>{errors.password.message}</p>}
      </div>
      {error && <p className='text-red-600 text-sm text-center'>{error}</p>}
      <button
        type='submit'
        disabled={loading}
        className='w-full bg-orange hover:bg-[#c07018] text-white font-bold py-2.5 sm:py-3 rounded-xl transition-colors duration-200 text-sm sm:text-base hover:cursor-pointer'
      >
        {loading ? 'Iniciando...' : 'Iniciar Sesión'}
      </button>

      <p className='text-center text-xs sm:text-sm text-main-blue leading-relaxed'>
        ¿No Tienes Activa tu Cuenta?
        <button
          type='button'
          className='text-orange hover:underline hover:cursor-pointer ml-1'
          onClick={onActivate}
        >
          Activar Cuenta
        </button>
      </p>
    </form>
  );
};
