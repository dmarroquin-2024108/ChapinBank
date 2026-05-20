import { useForm } from 'react-hook-form';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

export const ActivateRequest = ({ onSwitch }) => {
  const { resendActivate, error } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    const resultado = await resendActivate(formData);
    if (resultado.success) {
      toast.success('Correo enviado.', { duration: 3000 });
    } else {
      toast.error(resultado.error || 'Error al enviar el correo. Inténtelo de nuevo.', {
        duration: 3000,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
      <div>
        <label htmlFor='email' className='block text-sm font-semibold text-main-blue mb-1.5'>
          Email
        </label>
        <div className='relative'>
          <Mail size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
          <input
            type='email'
            id='email'
            placeholder='correo@example.com'
            className='w-full bg-white pl-9 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold placeholder-gray-400 text-sm'
            {...register('email', {
              required: 'Este campo es obligatorio',
            })}
          />
        </div>
        {errors.email && <p className='text-red-600 text-xs mt-1'>{errors.email.message}</p>}
      </div>
      {error && <p className='text-red-600 text-xs text-center'>{error}</p>}
      <button
        type='submit'
        className='w-full bg-orange text-white font-bold py-2 rounded-lg hover:bg-[#F2CD88] hover:cursor-pointer transition'
      >
        Reenviar Token
      </button>

      <p className='text-center text-sm'>
        ¿Ya activaste tu cuenta?
        <button
          type='button'
          onClick={onSwitch}
          className=' p-2 text-orange hover:underline hover:cursor-pointer'
        >
          Iniciar Sesión
        </button>
      </p>
    </form>
  );
};
