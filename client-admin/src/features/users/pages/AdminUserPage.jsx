import { useState } from "react";
import { UserPlus, Trash2 } from "lucide-react";
import { useAdminStore } from "../store/adminStore.js";
import { useAuthStore } from "../../auth/store/authStore.js";
import { CreateUserModal } from "../components/CreateUserModal.jsx";
import toast from "react-hot-toast";

export const AdminUsersPage = () => {
    const { user } = useAuthStore();
    const { deleteUser, loading } = useAdminStore();
    const [showCreate, setShowCreate] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const handleDeleteUser = async (userId, userName) => {
        const confirmed = window.confirm(
            `¿Estás seguro de eliminar al usuario "${userName}"? Esta acción no se puede deshacer.`
        );
        if (!confirmed) return;

        setDeletingId(userId);
        const response = await deleteUser(userId);
        setDeletingId(null);

        if (response.success) {
            toast.success("Usuario eliminado correctamente.");
        } else {
            toast.error(response.error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#0d1f35]">Gestión de Usuarios</h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        Crea y administra los usuarios del sistema.
                    </p>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange text-white text-sm font-semibold rounded-xl hover:bg-[#c07018] transition shadow"
                >
                    <UserPlus size={16} />
                    Crear usuario
                </button>
            </div>

            {/* A quien le toque listar, poner aca el crud */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <p className="text-gray-400 text-sm">
                    Alguien del Debbugers, pooner el listar
                </p>
                <p className="text-xs text-gray-300 mt-1">
                    el boton de crear es el amarillito de arriba, oka? oka
                </p>
            </div>

            <CreateUserModal
                isOpen={showCreate}
                onClose={() => setShowCreate(false)}
                currentUserRole={user?.role}
            />
        </div>
    );
};