import { useForm } from 'react-hook-form';
import { X, Shield } from 'lucide-react';
import { useAdminStore } from '../../admin/store/adminStore.js';
import toast from 'react-hot-toast';

// Roles disponibles según el seeder y RoleConstants del back
const ROLES = ['USER_ROLE', 'ADMIN_ROLE'];

export const CreateUserModal = ({ isOpen, onClose, currentUserRole }) => {
  const { createUser, loading } = useAdminStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Solo SUPERADMIN puede crear ADMINs
  const availableRoles = currentUserRole === 'SUPERADMIN_ROLE' ? ROLES : ['USER_ROLE'];

  const onSubmit = async (formData) => {
    const payload = {
      name: formData.name,
      surname: formData.surname,
      username: formData.username,
      email: formData.email,
      dpi: formData.dpi,
      phone: formData.phone,
      direction: formData.direction,
      nameWork: formData.nameWork,
      ingresosMensuales: parseFloat(formData.ingresosMensuales),
      role: formData.role,
      password: formData.password,
    };

    const response = await createUser(payload);
    if (response.success) {
      toast.success('Usuario creado correctamente. Se enviará un correo de verificación.');
      reset();
      onClose(true);
    } else {
      toast.error(response.error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='relative h-24 bg-[#0d1f35]'>
          <button
            onClick={onClose}
            className='absolute top-3 right-3 text-white/60 hover:text-white transition'
          >
            <X size={20} />
          </button>
          <div className='absolute -bottom-8 left-6'>
            <div className='w-16 h-16 rounded-full bg-orange border-4 border-white flex items-center justify-center text-white font-bold text-xl shadow'>
              <Shield size={24} />
            </div>
          </div>
        </div>

        <div className='pt-10 px-6 pb-2'>
          <h2 className='text-lg font-bold text-[#0d1f35]'>Crear nuevo usuario</h2>
          <p className='text-xs text-gray-400 mt-0.5'>
            Se enviará un correo de verificación al usuario registrado.
          </p>
        </div>

        <div className='border-t border-gray-100 mx-6 my-3' />

        <form className='px-6 pb-6 space-y-4' onSubmit={handleSubmit(onSubmit)}>
          <div className='grid grid-cols-2 gap-3'>
            {/* Nombre */}
            <div>
              <label className='text-xs text-gray-400 mb-1 block'>Nombre</label>
              <input
                type='text'
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange/40 ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
                placeholder='Juan'
                {...register('name', {
                  required: 'El nombre es obligatorio',
                  maxLength: { value: 25, message: 'Máximo 25 caracteres' },
                })}
              />
              {errors.name && <p className='text-red-500 text-xs mt-0.5'>{errors.name.message}</p>}
            </div>

            {/* Apellido */}
            <div>
              <label className='text-xs text-gray-400 mb-1 block'>Apellido</label>
              <input
                type='text'
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange/40 ${errors.surname ? 'border-red-400' : 'border-gray-200'}`}
                placeholder='Pérez'
                {...register('surname', {
                  required: 'El apellido es obligatorio',
                  maxLength: { value: 25, message: 'Máximo 25 caracteres' },
                })}
              />
              {errors.surname && (
                <p className='text-red-500 text-xs mt-0.5'>{errors.surname.message}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className='text-xs text-gray-400 mb-1 block'>Username</label>
              <input
                type='text'
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange/40 ${errors.username ? 'border-red-400' : 'border-gray-200'}`}
                placeholder='juanperez123'
                {...register('username', { required: 'El username es obligatorio' })}
              />
              {errors.username && (
                <p className='text-red-500 text-xs mt-0.5'>{errors.username.message}</p>
              )}
            </div>

            {/* Correo */}
            <div>
              <label className='text-xs text-gray-400 mb-1 block'>Correo electrónico</label>
              <input
                type='email'
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange/40 ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                placeholder='juan@email.com'
                {...register('email', {
                  required: 'El correo es obligatorio',
                  pattern: { value: /^\S+@\S+$/i, message: 'Correo inválido' },
                })}
              />
              {errors.email && (
                <p className='text-red-500 text-xs mt-0.5'>{errors.email.message}</p>
              )}
            </div>

            {/* DPI */}
            <div>
              <label className='text-xs text-gray-400 mb-1 block'>DPI</label>
              <input
                type='text'
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange/40 ${errors.dpi ? 'border-red-400' : 'border-gray-200'}`}
                placeholder='1234567890123'
                maxLength={13}
                {...register('dpi', {
                  required: 'El DPI es obligatorio',
                  pattern: { value: /^\d{13}$/, message: 'Debe tener exactamente 13 dígitos' },
                })}
              />
              {errors.dpi && <p className='text-red-500 text-xs mt-0.5'>{errors.dpi.message}</p>}
            </div>

            {/* Teléfono */}
            <div>
              <label className='text-xs text-gray-400 mb-1 block'>Teléfono</label>
              <input
                type='text'
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange/40 ${errors.phone ? 'border-red-400' : 'border-gray-200'}`}
                placeholder='55554444'
                maxLength={8}
                {...register('phone', {
                  required: 'El teléfono es obligatorio',
                  pattern: { value: /^\d{8}$/, message: 'Debe tener exactamente 8 dígitos' },
                })}
              />
              {errors.phone && (
                <p className='text-red-500 text-xs mt-0.5'>{errors.phone.message}</p>
              )}
            </div>

            {/* Dirección */}
            <div>
              <label className='text-xs text-gray-400 mb-1 block'>Dirección</label>
              <input
                type='text'
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange/40 ${errors.direction ? 'border-red-400' : 'border-gray-200'}`}
                placeholder='Zona 1, Ciudad de Guatemala'
                {...register('direction', { required: 'La dirección es obligatoria' })}
              />
              {errors.direction && (
                <p className='text-red-500 text-xs mt-0.5'>{errors.direction.message}</p>
              )}
            </div>

            {/* Lugar de trabajo */}
            <div>
              <label className='text-xs text-gray-400 mb-1 block'>Lugar de trabajo</label>
              <input
                type='text'
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange/40 ${errors.nameWork ? 'border-red-400' : 'border-gray-200'}`}
                placeholder='Chapin Bank'
                {...register('nameWork', { required: 'El lugar de trabajo es obligatorio' })}
              />
              {errors.nameWork && (
                <p className='text-red-500 text-xs mt-0.5'>{errors.nameWork.message}</p>
              )}
            </div>

            {/* Ingresos mensuales */}
            <div>
              <label className='text-xs text-gray-400 mb-1 block'>Ingresos mensuales (Q)</label>
              <input
                type='number'
                step='0.01'
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange/40 ${errors.ingresosMensuales ? 'border-red-400' : 'border-gray-200'}`}
                placeholder='500.00'
                {...register('ingresosMensuales', {
                  required: 'Los ingresos son obligatorios',
                  min: { value: 100, message: 'Mínimo Q.100.00' },
                  valueAsNumber: true,
                })}
              />
              {errors.ingresosMensuales && (
                <p className='text-red-500 text-xs mt-0.5'>{errors.ingresosMensuales.message}</p>
              )}
            </div>

            {/* Rol */}
            <div>
              <label className='text-xs text-gray-400 mb-1 block'>Rol</label>
              <select
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange/40 ${errors.role ? 'border-red-400' : 'border-gray-200'}`}
                {...register('role', { required: 'El rol es obligatorio' })}
              >
                <option value=''>Seleccionar rol...</option>
                {availableRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {errors.role && <p className='text-red-500 text-xs mt-0.5'>{errors.role.message}</p>}
            </div>
          </div>

          {/* Password — ocupa fila completa */}
          <div>
            <label className='text-xs text-gray-400 mb-1 block'>Contraseña temporal</label>
            <input
              type='password'
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange/40 ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
              placeholder='Mínimo 8 caracteres'
              {...register('password', {
                required: 'La contraseña es obligatoria',
                minLength: { value: 8, message: 'Mínimo 8 caracteres' },
              })}
            />
            {errors.password && (
              <p className='text-red-500 text-xs mt-0.5'>{errors.password.message}</p>
            )}
          </div>

          <div className='flex justify-end gap-2 pt-2'>
            <button
              type='button'
              onClick={() => {
                reset();
                onClose();
              }}
              className='px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition'
            >
              Cancelar
            </button>
            <button
              type='submit'
              disabled={loading}
              className='px-4 py-2 text-sm bg-orange text-white font-semibold rounded-lg hover:bg-[#c07018] transition disabled:opacity-50'
            >
              {loading ? 'Creando...' : 'Crear usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
