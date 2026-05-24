import { UserRow } from './UserRow.jsx';
import { Spinner } from '../../auth/components/Spinner.jsx';

export const UserTable = ({ users = [], loading = false, search = '', onDelete }) => {
  if (loading) return <Spinner />;

  return (
    <div className='overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm'>
      {users.length === 0 ? (
        <div className='flex items-center justify-center py-16 px-4 text-center'>
          <p className='text-gray-400 text-sm'>
            {search ? 'Sin resultados para la búsqueda.' : 'No hay usuarios registrados.'}
          </p>
        </div>
      ) : (
        <table className='min-w-[850px] w-full leading-normal text-xs sm:text-sm'>
          <thead>
            <tr className='bg-gray-50/60 border-b border-gray-100'>
              <th className='py-3 sm:py-5 px-3 sm:px-6 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap'>
                Cliente
              </th>
              <th className='py-3 sm:py-5 px-3 sm:px-6 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap'>
                Username
              </th>
              <th className='py-3 sm:py-5 px-3 sm:px-6 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap'>
                Correo
              </th>
              <th className='py-3 sm:py-5 px-3 sm:px-6 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap'>
                Rol
              </th>
              <th className='py-3 sm:py-5 px-3 sm:px-6 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap'>
                Registro
              </th>
              <th className='py-3 sm:py-5 px-3 sm:px-6 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap'>
                Estado
              </th>
              <th className='py-3 sm:py-5 px-3 sm:px-6 w-10' />
            </tr>
          </thead>
          <tbody className='text-gray-700'>
            {users.map((u, i) => (
              <UserRow key={u.idUserResponse} user={u} index={i} onDelete={onDelete} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
