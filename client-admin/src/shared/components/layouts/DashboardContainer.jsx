import { Sidebar } from "./Sidebar.jsx";
import { Navbar } from "./Navbar.jsx";

export const DashboardContainer = ({ user, onLogout, children }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar onLogout={onLogout} user={user} />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar onLogout={onLogout} />
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};