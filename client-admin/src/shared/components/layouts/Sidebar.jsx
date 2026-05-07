import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, Users, CreditCard, History, LogOut } from "lucide-react";
import imgLogo from "../../../assets/img/ChapinLogo.png";

export const Sidebar = ({ onLogout }) => {
    const location = useLocation();

    const items = [
        { label: "Resumen", icon: LayoutDashboard, to: "/dashboard", exact: true },
        { label: "Productos", icon: Package, to: "/" },
        { label: "Usuarios", icon: Users, to: "/dashboard/users" },
        { label: "Cuentas", icon: CreditCard, to: "/" },
        { label: "Historial", icon: History, to: "/" },
    ];

    return (
        <aside className="w-50 min-h-screen bg-[#0d1f35] flex flex-col">
            <div className="px-5 py-5 border-b-1 border-gray-600">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center">
                        <img src={imgLogo} alt="ChapinBank Logo" />
                    </div>
                    <span className="text-white font-bold text-lg">
                        Chapin<span className="text-orange">Bank</span>
                    </span>
                </div>
            </div>

            <nav className="flex-1 mt-2">
                {items.map(({ label, icon: Icon, to, exact }) => {
                    const active = exact
                        ? location.pathname === to
                        : location.pathname === to || location.pathname.startsWith(to + "/");
                    return (
                        <Link
                            key={label}
                            to={to}
                            className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors duration-150
                            ${active
                                ? "bg-orange text-white rounded-lg mx-2"
                                : "text-gray-400 hover:text-white hover:bg-white/5 mx-2 rounded-lg"
                            }`}
                        >
                            <Icon size={17} />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            <button
                className="flex items-center gap-3 px-7 py-5 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer border-t-1 border-gray-600"
                onClick={onLogout}
            >
                <LogOut size={16} />
                Cerrar Sesión
            </button>
        </aside>
    );
};