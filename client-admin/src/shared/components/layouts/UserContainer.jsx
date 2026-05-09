import { UserNavbar } from "./UserNavbar.jsx";

export const UserContainer = ({ onLogout, children }) => {
    return (
        <div className="min-h-screen bg-gray-50 font-['Poppins',sans-serif]">
            <UserNavbar onLogout={onLogout} />
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
};