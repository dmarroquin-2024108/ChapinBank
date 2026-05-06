import { useState, useRef, useEffect } from "react";
import { ArrowDownToLine, ArrowLeftRight, Clock, Package, ArrowUpRight, ChevronRight, Bell, User, LogOut, } from "lucide-react";
import imgLogo from "../../../assets/img/ChapinLogo.png";
import { useAuthStore } from "../../auth/store/authStore.js";
import { ProfileModal } from "../components/ProfileModal.jsx";

const QUICK_ACTIONS = [
    { label: "Depósitos", sub: "Acredita fondos", icon: ArrowDownToLine }, //iconos
    { label: "Transferencias", sub: "Envía dinero", icon: ArrowLeftRight }, //icono de las flechitas
    { label: "Historial", sub: "Tus movimientos", icon: Clock },//icono de reloj
    { label: "Mis productos", sub: "0 contratados", icon: Package },//icono del pack
];//visual por this moment

const NAV_ITEMS = ["Inicio", "Depósitos", "Transferencias", "Historial", "Productos", "Mis productos"];

const AccountCard = ({ type, currency, dark }) => (
    <div
        className={`relative rounded-2xl p-5 flex flex-col justify-between min-h-[155px] overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl ${dark ? "bg-[#032340] text-white" : "bg-[#F28C00] text-white"
            }`}
    >
        <div
            className="absolute -right-6 -top-6 w-28 h-28 rounded-full opacity-10"
            style={{ background: "rgba(255,255,255,0.4)" }}
        />
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full ${dark ? "bg-[#F28C00]/20" : "bg-white/20"}`} />
                <span className="text-xs font-bold tracking-wider opacity-90">{type}</span>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${dark ? "bg-white/10" : "bg-white/20"}`}>
                {currency}
            </span>
        </div>
        <div>
            <p className="text-2xl font-extrabold tracking-tight">Q —</p>
            <p className="text-xs opacity-60 mt-0.5">•••• ——</p>
        </div>
        <div className="flex items-center justify-between mt-1">
            <span className="text-xs opacity-60">Apertura: —</span>
            <button className="text-xs font-semibold flex items-center gap-0.5 opacity-80 hover:opacity-100 transition-opacity">
                Ver detalle <ChevronRight size={12} />
            </button>
        </div>
    </div>
);

export const UserPage = ({ onLogout }) => {
    const { user } = useAuthStore();
    const [activeNav, setActiveNav] = useState("Inicio");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleOpenProfile = () => {
        setDropdownOpen(false);
        setTimeout(() => setShowProfile(true), 50);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-['Poppins',sans-serif]">

            <header className="bg-[#032340] sticky top-0 z-40 shadow-md">
                <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 mr-2">
                            <img src={imgLogo} alt="ChapinBank Logo" className="w-7 h-7 object-contain" />
                            <span className="text-white font-extrabold text-base">
                                Chapin<span className="text-[#F28C00]">Bank</span>
                            </span>
                        </div>
                        <nav className="hidden md:flex items-center gap-1">
                            {NAV_ITEMS.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => setActiveNav(item)}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150 ${activeNav === item
                                            ? "bg-[#F28C00] text-white"
                                            : "text-gray-300 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="relative text-gray-400 hover:text-white transition-colors p-1.5">
                            <Bell size={18} />
                            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#F28C00] rounded-full" />
                        </button>

                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen((prev) => !prev)}
                                className="w-8 h-8 rounded-full bg-[#F28C00] flex items-center justify-center text-white text-xs font-black cursor-pointer hover:opacity-90 transition-opacity"
                            >
                                {user?.username?.slice(0, 2).toUpperCase() ?? "MJ"}
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                                    <div className="px-4 py-3 border-b border-gray-100 text-center">
                                        <p className="text-sm font-semibold text-main-blue truncate">
                                            {user?.name && user?.surname
                                                ? `${user.name} ${user.surname}`
                                                : "Usuario"}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5 break-all">
                                            {user?.email ?? ""}
                                        </p>
                                    </div>
                                    <button
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                                        onClick={handleOpenProfile}
                                    >
                                        <User size={15} />
                                        Mi Perfil
                                    </button>
                                    <button
                                        onClick={onLogout}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition cursor-pointer"
                                    >
                                        <LogOut size={15} />
                                        Cerrar Sesión
                                    </button> //Boton nivel senior "FUEGO" (no encontré el 🔥)
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">

                <section className="bg-[#032340] rounded-2xl px-8 py-6 flex items-center justify-between relative overflow-hidden">
                    <div
                        className="absolute right-0 top-0 w-64 h-full opacity-5"
                        style={{ background: "radial-gradient(circle at 80% 50%, #F28C00 0%, transparent 70%)" }}
                    />
                    <div>
                        <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-1">
                            Bienvenido
                        </p>
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-2">
                            Saldo Total Disponible
                        </p>
                        <p className="text-white text-4xl font-extrabold tracking-tight">
                            Q &nbsp;—
                        </p>
                    </div>
                    <button className="bg-[#F28C00] hover:bg-[#d97b00] text-white font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors duration-150 shrink-0 shadow-lg shadow-orange-900/30">
                        Transferir <ArrowUpRight size={16} />
                    </button>
                </section>

                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {QUICK_ACTIONS.map(({ label, sub, icon: Icon }) => (
                        <button
                            key={label}
                            className="bg-white rounded-2xl p-5 flex flex-col gap-3 text-left border border-gray-100 hover:border-[#F28C00]/30 hover:shadow-md transition-all duration-200 group"
                        >
                            <div className="w-9 h-9 rounded-xl bg-[#F28C00]/10 flex items-center justify-center group-hover:bg-[#F28C00]/20 transition-colors">
                                <Icon size={18} className="text-[#F28C00]" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-[#032340]">{label}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                            </div>
                        </button>
                    ))}
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-bold text-[#032340]">Sus cuentas registradas</h2>
                            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
                                cuentas activas:
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <AccountCard type="CUENTA AHORRO" currency="GTQ" dark={true} />
                            <AccountCard type="CUENTA MONETARIA" currency="GTQ" dark={false} />
                        </div>
                    </section>

                    <section className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-1">
                            <h2 className="text-sm font-bold text-[#032340]">Actividad reciente</h2>
                            <button className="text-xs text-[#F28C00] font-semibold hover:underline">
                                Ver todo
                            </button>
                        </div>
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <p className="text-sm font-medium text-gray-400">Sin actividad reciente</p>
                            <p className="text-xs text-gray-300 mt-1">Tus movimientos aparecerán aquí</p>
                        </div>
                    </section>
                </div>

            </main>

            <ProfileModal
                isOpen={showProfile}
                onClose={() => setShowProfile(false)}
                userBase={user}
            />
        </div>
    );
};

export default UserPage;