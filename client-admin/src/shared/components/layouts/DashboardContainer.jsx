import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { Navbar } from './Navbar.jsx';

export const DashboardContainer = ({ user, onLogout, children }) => {
  const titles = {
    '/dashboard': 'Resumen del banco',
    '/dashboard/usuarios': 'Usuarios',
    '/dashboard/transferencias': 'Transferencias',
    '/dashboard/productos': 'Productos',
  };
  const location = useLocation();
  const title = titles[location.pathname] || 'Panel';

  return (
    <div className='h-screen bg-[#f5f3ef] flex'>
      <Sidebar onLogout={onLogout} user={user} />
      <div className='flex-1 flex flex-col overflow-hidden min-w-0'>
        <Navbar onLogout={onLogout} title={title} />
        <main className='flex-1 p-6 overflow-y-auto min-h-0 min-w-0'>{children}</main>
      </div>
    </div>
  );
};
