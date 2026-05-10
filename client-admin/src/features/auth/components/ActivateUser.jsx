import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { AuthLayout } from '../../../app/layouts/AuthLayout.jsx';

export const ActivateUser = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { activateUser, loading } = useAuthStore();
  const [verified, setVerified] = useState(null);

  useEffect(() => {
    const verify = async () => {
      const resultado = await activateUser({ token });
      if (resultado.success) {
        setVerified(true);
      } else {
        setVerified(false);
      }
    };
    if (token) verify();
  }, []);

  return (
    <AuthLayout
      title={
        <>
          <span className='text-main-blue'>Chapin</span>
          <span className='text-orange'>Bank</span>
        </>
      }
      subtitle={
        loading
          ? 'Verificando tu cuenta...'
          : verified
            ? '¡Tu cuenta ha sido activada!'
            : 'No se pudo activar la cuenta'
      }
    >
      <div className='text-center space-y-5'>
        {loading && <p className='text-gray-500 text-sm'>Por favor espera...</p>}

        {verified === true && (
          <>
            <p className='text-gray-600 text-lg'>
              Tu cuenta ha sido verificada exitosamente. Ya puedes iniciar sesión.
            </p>

            <button
              onClick={() => navigate('/', { replace: true })}
              className='w-full bg-orange text-white font-bold py-2 rounded-lg hover:bg-[#F2CD88] hover:cursor-pointer transition'
            >
              Iniciar Sesión
            </button>
          </>
        )}

        {verified === false && (
          <>
            <p className='text-gray-600 text-lg'>
              El enlace de verificación es inválido o ya fue utilizado.
            </p>

            <button
              onClick={() => navigate('/', { replace: true })}
              className='w-full bg-orange text-white font-bold py-2 rounded-lg hover:bg-[#F2CD88] hover:cursor-pointer transition'
            >
              Volver al Inicio
            </button>
          </>
        )}
      </div>
    </AuthLayout>
  );
};
