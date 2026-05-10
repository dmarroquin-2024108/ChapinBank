import { useSearchParams, useNavigate, replace } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Lock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { AuthLayout } from '../../../app/layouts/AuthLayout.jsx';

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const { resetPassword, loading, error } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    const resultado = await resetPassword({ token, NewPassword: formData.NewPassword });
    if (resultado.success) {
      toast.success('Constraseña Actualizada', { duration: 3000 });
      navigate('/', { replace: true });
    } else {
      toast.error('El enlace ya expiró o no es válido, solicite uno nuevo', { duration: 4000 });
    }
  };

  return (
    <AuthLayout
      title={<span className='text-main-blue'>Cambiar Contraseña</span>}
      subtitle='Ingresa tu nueva contraseña'
    >
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
        <div>
          <label className='block text-sm font-semibold text-main-blue mb-1.5'>
            Nueva Contraseña
          </label>
          <div className='relative'>
            <Lock size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
            <input
              type='password'
              id='NewPassword'
              placeholder='* * * * * *'
              className='w-full bg-white pl-9 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold placeholder-gray-400 text-sm'
              {...register('NewPassword', { required: 'Este campo es obligatorio' })}
            />
          </div>
          {errors.NewPassword && (
            <p className='text-red-600 text-xs mt-1'>{errors.NewPassword.message}</p>
          )}

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-orange text-white font-bold py-2 rounded-lg hover:bg-[#F2CD88] hover:cursor-pointer transition disabled:opacity-60 mt-2'
          >
            {loading ? 'Cambiando...' : 'Cambiar contraseña'}
          </button>

          <p className='text-center text-sm'>
            ¿Recordaste tu contraseña?
            <button
              type='button'
              onClick={() => navigate('/', { replace: true })}
              className=' p-2 text-orange hover:underline hover:cursor-pointer'
            >
              Iniciar Sesión
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};
