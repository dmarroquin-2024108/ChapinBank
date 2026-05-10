import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Shield, Key } from 'lucide-react';
import { useUserStore } from '../store/userStore.js';
import toast from 'react-hot-toast';

export const ProfileModal = ({ isOpen, onClose, userBase }) => {
  const { profile, loading, getPerfil, editPerfil } = useUserStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm();

  useEffect(() => {
    if (isOpen) getPerfil();
  }, [isOpen]);

  useEffect(() => {
    if (profile) {
      reset({
        username: profile.username ?? '',
        email: profile.email ?? '',
        phone: profile.phone ?? '',
        direction: profile.direction ?? '',
        nameWork: profile.nameWork ?? '',
        ingresosMensuales: profile.ingresosMensuales ?? '',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (formData) => {
    const payload = Object.fromEntries(
      Object.entries(formData).filter(([key, value]) => {
        if (value === '' || value == null) return false;
        return value !== profile[key];
      })
    );

    if (Object.keys(payload).length === 0) {
      toast('No realizaste ningún cambio');
      return;
    }

    const response = await editPerfil(payload);
    if (response.success) {
      toast.success('Perfil actualizado correctamente');
      onClose();
    } else {
      toast.error(response.error);
    }
  };

  if (!isOpen) return null;

  const initials =
    `${userBase?.name?.[0] ?? ''}${userBase?.surname?.[0] ?? ''}`.toUpperCase() || 'U';
  const fullName = `${userBase?.name ?? ''} ${userBase?.surname ?? ''}`.trim();
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-4 overflow-hidden'>
        <div className='relative h-24 bg-[#0d1f35]'>
          <button
            onClick={onClose}
            className='absolute top-3 right-3 text-white/60 hover:text-white transition'
          >
            <X size={20} />
          </button>

          <div className='absolute -bottom-8 left-6'>
            <div className='w-16 h-16 rounded-full bg-orange border-4 border-white flex items-center justify-center text-white font-bold text-xl shadow'>
              {initials}
            </div>
          </div>
        </div>
        <div className='pt-10 px-6 pb-2'>
          <h2 className='text-lg font-bold text-[#0d1f35]'>{fullName || 'Usuario'}</h2>
          <div className='flex items-center gap-2 mt-0.5'>
            <span className='text-xs text-gray-400'>{profile?.email}</span>
            <span className='text-gray-300'>·</span>
            <span className='text-xs text-orange font-medium flex items-center gap-1'>
              <Shield size={11} /> {userBase?.role ?? 'USER'}
            </span>
          </div>
        </div>

        <div className='border-t border-gray-100 mx-6 my-3' />
        <form className='px-6 pb-6 space-y-4' onSubmit={handleSubmit(onSubmit)}>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='text-xs text-gray-400 mb-1 block'>Nombre Completo</label>

              <input
                type='text'
                value={fullName || '-'}
                disabled
                className='w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-400 cursor-not-allowed'
              />
            </div>

            <div>
              <label className='text-xs text-gray-400 mb-1 block'>Rol</label>

              <input
                type='text'
                value={userBase?.role ?? '-'}
                disabled
                className='w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-400 cursor-not-allowed'
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='text-xs text-gray-400 mb-1 block'>Username</label>
              <input
                type='text'
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange/40 ${errors.username ? 'border-red-400' : 'border-gray-200'}`}
                {...register('username', {
                  minLength: { value: 5, message: 'Mínimo 5 caracteres' },
                })}
              />
              {errors.username && (
                <p className='text-red-500 text-xs mt-0.5'>{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className='text-xs text-gray-400 mb-1 block'>Correo electrónico</label>
              <input
                type='email'
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange/40 ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                {...register('email', {
                  pattern: { value: /^\S+@\S+$/i, message: 'Email inválido' },
                })}
              />
              {errors.email && (
                <p className='text-red-500 text-xs mt-0.5'>{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className='text-xs text-gray-400 mb-1 block'>Teléfono</label>
              <input
                type='text'
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange/40 ${errors.phone ? 'border-red-400' : 'border-gray-200'}`}
                {...register('phone', {
                  minLength: { value: 8, message: '8 dígitos' },
                  maxLength: { value: 8, message: '8 dígitos' },
                  pattern: { value: /^\d+$/, message: 'Solo números' },
                })}
              />
              {errors.phone && (
                <p className='text-red-500 text-xs mt-0.5'>{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className='text-xs text-gray-400 mb-1 block'>Dirección</label>
              <input
                type='text'
                className='w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange/40'
                {...register('direction')}
              />
            </div>

            <div>
              <label className='text-xs text-gray-400 mb-1 block'>Lugar de trabajo</label>
              <input
                type='text'
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange/40 ${errors.nameWork ? 'border-red-400' : 'border-gray-200'}`}
                {...register('nameWork', {
                  minLength: { value: 5, message: 'Mínimo 5 caracteres' },
                })}
              />
              {errors.nameWork && (
                <p className='text-red-500 text-xs mt-0.5'>{errors.nameWork.message}</p>
              )}
            </div>

            <div>
              <label className='text-xs text-gray-400 mb-1 block'>Ingresos mensuales (Q)</label>
              <input
                type='number'
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange/40 ${errors.ingresosMensuales ? 'border-red-400' : 'border-gray-200'}`}
                {...register('ingresosMensuales', { min: { value: 100, message: 'Mínimo Q.100' } })}
              />
              {errors.ingresosMensuales && (
                <p className='text-red-500 text-xs mt-0.5'>{errors.ingresosMensuales.message}</p>
              )}
            </div>
          </div>

          <div className='flex justify-end gap-2 pt-2'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition'
            >
              Cancelar
            </button>
            <button
              type='submit'
              disabled={loading || !isDirty}
              className='px-4 py-2 text-sm bg-orange text-white font-semibold rounded-lg hover:bg-[#c07018] transition disabled:opacity-50'
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
