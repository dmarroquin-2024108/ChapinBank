import { Routes, Route } from "react-router-dom";
import { AuthPage } from "../../features/auth/pages/AuthPage.jsx";
import { UnauthorizedPage } from '../../features/auth/pages/UnauthorizedPage.jsx';
import { DashboardPage } from '../layouts/DashboardPage.jsx';
import { ProtectedRoutes } from './ProtectedRoutes.jsx';
import { RoleGuard } from "./RoleGuard.jsx";
import { ResetPassword } from "../../features/auth/components/ResetPassword.jsx";
import { ActivateUser } from "../../features/auth/components/ActivateUser.jsx";
import { UserPage } from "../../features/users/pages/UserPage.jsx";
import { useAuthStore } from "../../features/auth/store/authStore.js";
import { AdminUsersPage } from "../../features/users/pages/AdminUserPage.jsx";
import {AdminDashboardPage} from "../../features/admin/pages/AdminDashboardPage.jsx"

export const AppRoutes = () => {
    const logout = useAuthStore((state) => state.logout);

    return (
        <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path='/unauthorized' element={<UnauthorizedPage />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<ActivateUser />} />
            <Route
                path="/inicio"
                element={
                    <ProtectedRoutes>
                        <RoleGuard allowedRoles={["USER_ROLE"]}>
                            <UserPage onLogout={logout} />
                        </RoleGuard>
                    </ProtectedRoutes>
                }
            />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoutes>
                        <RoleGuard allowedRoles={["SUPERADMIN_ROLE", "ADMIN_ROLE"]}>
                            <DashboardPage />
                        </RoleGuard>
                    </ProtectedRoutes>
                }
            >
                <Route index element={<AdminDashboardPage />} />
                <Route path="users" element={<AdminUsersPage />} />
            </Route>
        </Routes>
    );
};