import { Routes, Route } from "react-router-dom";
import { AuthPage } from "../../features/auth/pages/AuthPage.jsx";
import { UnauthorizedPage } from '../../features/auth/pages/UnauthorizedPage.jsx'
import {DashboardPage} from '../layouts/DashboardPage.jsx';
import {ProtectedRoutes} from './ProtectedRoutes.jsx';
import { ResetPassword } from "../../features/auth/components/ResetPassword.jsx";
import { ActivateUser } from "../../features/auth/components/ActivateUser.jsx";

export const AppRoutes = ()=>{
    return(
        <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path='/unauthorized' element={<UnauthorizedPage />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<ActivateUser />} />
            <Route
                path="/dashboard/*"
                element={
                    <ProtectedRoutes>
                        <DashboardPage />
                    </ProtectedRoutes>
                }
            >
            </Route>
        </Routes>
    )
}