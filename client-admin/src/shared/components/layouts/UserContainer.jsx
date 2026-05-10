import { UserNavbar } from './UserNavbar.jsx';

export const UserContainer = ({ onLogout, children }) => {
  return (
    <div className="h-screen flex flex-col bg-gray-50 font-['Poppins',sans-serif]">
      <UserNavbar onLogout={onLogout} />
      <main className='flex-1 overflow-y-auto p-6 min-w-0'>{children}</main>
    </div>
  );
};
