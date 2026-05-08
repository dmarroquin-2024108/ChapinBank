import { useState, useEffect, useMemo } from "react";
import { UserPlus, Trash2, Search, CheckCircle, XCircle } from "lucide-react";
import { useAdminStore } from "../store/adminStore.js";
import { useAuthStore } from "../../auth/store/authStore.js";
import { CreateUserModal } from "../components/CreateUserModal.jsx";
import { StatCard } from "../../admin/components/StatCard.jsx";
import { Users, UserCheck, UserX } from "lucide-react";
import { formatDate } from "../../../shared/utils/formatters.js";
import { ConfirmModal } from "../../../shared/components/ui/ConfirmModal.jsx";
import toast from "react-hot-toast";

const AVATAR_COLORS = [
    "bg-[#0d1f35]", "bg-[#1a6b4a]", "bg-orange", "bg-[#6b21a8]", "bg-blue-600",
];

const getInitials = (name = "", surname = "") =>
    `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
    
const ROLE_LABELS = {
    SUPERADMIN_ROLE: { label: "Super Admin", className: "bg-purple-100 text-purple-700" },
    ADMIN_ROLE: { label: "Admin", className: "bg-blue-100 text-blue-700" },
    USER_ROLE:{ label: "Usuario",className: "bg-gray-100 text-gray-600" },
};
    
export const AdminUsersPage = () => {
    const { user } = useAuthStore();
    const { getUsers, deleteUser, users, loadings } = useAdminStore();
    const [showCreate, setShowCreate]= useState(false);
    const [confirmData, setConfirmData] = useState(null); 
    const [deleting, setDeleting]= useState(false);
    const [search, setSearch]= useState("");

    useEffect(() => {
        getUsers();
    }, []);

    const filtered = useMemo(() => {
        if (!search.trim()) return users;
        const q = search.toLowerCase();
        return users.filter((u) =>
            u.name?.toLowerCase().includes(q) ||
            u.surname?.toLowerCase().includes(q) ||
            u.username?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q)
        );
    }, [search, users]);

    const stats = useMemo(() => ({
        total:users.length,
        active:users.filter(u => u.status).length,
        inactive:users.filter(u => !u.status).length,
    }), [users]);

    const handleDeleteConfirm = async () => {
        if (!confirmData) return;
        setDeleting(true);
        const response = await deleteUser(confirmData.userId);
        setDeleting(false);
        setConfirmData(null);
        if (response.success) {
            toast.success("Usuario deshabilitado correctamente.");
            getUsers();
        } else {
            toast.error(response.error ?? "Error al deshabilitar el usuario.");
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-xl font-bold text-[#0d1f35]">Gestión de usuarios</h1>
                <p className="text-gray-400 text-sm mt-0.5">
                    Registra nuevos clientes y consulta los usuarios del banco
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard title="Total" value={loadings.users ? "..." : stats.total} icon={Users} color="dark" />
                <StatCard title="Activos" value={loadings.users ? "..." : stats.active}   icon={UserCheck} color="green" />
                <StatCard title="Inhabilitados"  value={loadings.users ? "..." : stats.inactive} icon={UserX} color="orange" />
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por nombre, usuario o correo..."
                        className="w-full pl-9 pr-4 py-2 bg-white text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange/40"
                    />
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange text-white text-sm font-semibold rounded-xl hover:bg-[#c07018] transition shadow cursor-pointer shrink-0"
                >
                    <UserPlus size={16} />
                    Registrar usuario
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {loadings.users ? (
                    <div className="flex items-center justify-center py-16">
                        <p className="text-gray-400 text-sm">Cargando usuarios...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex items-center justify-center py-16">
                        <p className="text-gray-400 text-sm">
                            {search ? "Sin resultados para la búsqueda." : "No hay usuarios registrados."}
                        </p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Cliente</th>
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Username</th>
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Correo</th>
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Rol</th>
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Registro</th>
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">Estado</th>
                                <th className="px-4 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map((u, i) => {
                                const role = ROLE_LABELS[u.role] ?? ROLE_LABELS["USER_ROLE"];
                                return (
                                    <tr key={u.idUserResponse} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                                                    {getInitials(u.name, u.surname)}
                                                </div>
                                                <span className="font-medium text-[#0d1f35] truncate max-w-[140px]">
                                                    {u.name} {u.surname}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">@{u.username}</td>
                                        <td className="px-4 py-3 text-gray-500 truncate max-w-[180px]">{u.email}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${role.className}`}>
                                                {role.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(u.createdAt)}</td>
                                        <td className="px-4 py-3">
                                            <span className={`flex items-center gap-1 text-xs font-medium w-fit px-2 py-0.5 rounded-full
                                                ${u.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}
                                            >
                                                {u.status
                                                    ? <><CheckCircle size={11} /> Activo</>
                                                    : <><XCircle size={11} /> Inhabilitado</>
                                                }
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {u.status && (
                                                <button
                                                    onClick={() => setConfirmData({ userId: u.idUserResponse, fullName: `${u.name} ${u.surname}` })}
                                                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                                                    title="Deshabilitar usuario"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            <CreateUserModal
                isOpen={showCreate}
                onClose={() => { setShowCreate(false); getUsers(); }}
                currentUserRole={user?.role}
            />

            <ConfirmModal
                isOpen={!!confirmData}
                title="Deshabilitar usuario"
                description={`¿Estás seguro de deshabilitar a "${confirmData?.fullName}"? El usuario perderá acceso al sistema.`}
                confirmLabel="Deshabilitar"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setConfirmData(null)}
                loading={deleting}
            />
        </div>
    );
};