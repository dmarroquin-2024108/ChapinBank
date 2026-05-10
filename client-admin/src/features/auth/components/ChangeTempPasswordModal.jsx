import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

export const ChangeTempPasswordModal = ({ onClose }) => {
  const navigate = useNavigate();
  const { changeTempPassword, loading } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    const resultado = await changeTempPassword(formData.NewPassword);
    if (resultado.success) {
      toast.success('Contraseña actualizada, inicia sesión', { duration: 3000 });
      onClose();
    } else {
      toast.error(resultado.error || 'Error al cambiar la contraseña', { duration: 3000 });
    }
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4'>
        <h2 className='text-xl font-bold text-main-blue mb-1'>Cambiar Contraseña Temporal</h2>
        <p className='text-gray-600 text-sm mb-5'>Debes cambiar tu contraseña antes de continuar</p>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
          <div>
            <label className='block text-sm font-semibold text-main-blue mb-1.5'>
              Nueva Contraseña
            </label>
            <input
              type='password'
              placeholder='* * * * * *'
              className='w-full bg-white px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold placeholder-gray-400 text-sm'
              {...register('NewPassword', { required: 'Este campo es obligatorio' })}
            />
            {errors.NewPassword && (
              <p className='text-red-600 text-xs mt-1'>{errors.NewPassword.message}</p>
            )}
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-orange text-white font-bold py-2 rounded-lg hover:bg-[#F2CD88] hover:cursor-pointer transition disabled:opacity-60'
          >
            {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
};
