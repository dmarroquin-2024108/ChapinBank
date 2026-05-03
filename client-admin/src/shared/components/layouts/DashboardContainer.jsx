import { Sidebar } from "./Sidebar.jsx";
import { Navbar } from "./Navbar.jsx";

export const DashboardContainer = ({ user, onLogout, children }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar onLogout={onLogout} />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar user={user} />
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};