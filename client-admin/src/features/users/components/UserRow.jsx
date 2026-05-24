import { Trash2, CheckCircle, XCircle } from 'lucide-react';
import { formatDate } from '../../../shared/utils/formatters.js';

const AVATAR_COLORS = ['bg-[#0d1f35]', 'bg-[#1a6b4a]', 'bg-orange', 'bg-[#6b21a8]', 'bg-blue-600'];

const ROLE_LABELS = {
  SUPERADMIN_ROLE: { label: 'Super Admin', className: 'bg-purple-100 text-purple-700' },
  ADMIN_ROLE: { label: 'Admin', className: 'bg-blue-100 text-blue-700' },
  USER_ROLE: { label: 'Usuario', className: 'bg-gray-100 text-gray-600' },
};

const getInitials = (name = '', surname = '') =>
  `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();

export const UserRow = ({ user, index, onDelete }) => {
  const role = ROLE_LABELS[user.role] ?? ROLE_LABELS['USER_ROLE'];

  return (
    <tr className='border-b border-gray-50 hover:bg-gray-50/60 transition-colors'>
      <td className='py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap'>
        <div className='flex items-center gap-3'>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${AVATAR_COLORS[index % AVATAR_COLORS.length]}`}
          >
            {getInitials(user.name, user.surname)}
          </div>
          <span className='font-semibold text-gray-800 truncate max-w-[140px] sm:max-w-none'>
            {user.name} {user.surname}
          </span>
        </div>
      </td>

      <td className='py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap'>@{user.username}</td>

      <td className='py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap'>{user.email}</td>

      <td className='py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap'>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${role.className}`}>
          {role.label}
        </span>
      </td>

      <td className='py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap'>
        {formatDate(user.createdAt)}
      </td>

      <td className='py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap'>
        <span
          className={`flex items-center gap-1 text-xs font-medium w-fit px-2 py-0.5 rounded-full ${user.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}
        >
          {user.status ? (
            <>
              <CheckCircle size={11} /> Activo
            </>
          ) : (
            <>
              <XCircle size={11} /> Inhabilitado
            </>
          )}
        </span>
      </td>

      <td className='py-3 sm:py-4 px-3 sm:px-6 whitespace-nowrap'>
        {user.status && (
          <button
            onClick={() => onDelete(user)}
            className='p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer'
            title='Deshabilitar usuario'
          >
            <Trash2 size={15} />
          </button>
        )}
      </td>
    </tr>
  );
};
