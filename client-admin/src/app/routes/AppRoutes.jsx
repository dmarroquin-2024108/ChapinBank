import { Routes, Route } from 'react-router-dom';
import { AuthPage } from '../../features/auth/pages/AuthPage.jsx';
import { UnauthorizedPage } from '../../features/auth/pages/UnauthorizedPage.jsx';
import { DashboardPage } from '../layouts/DashboardPage.jsx';
import { UserLayout } from '../layouts/UserLayout.jsx';
import { ProtectedRoutes } from './ProtectedRoutes.jsx';
import { RoleGuard } from './RoleGuard.jsx';
import { ResetPassword } from '../../features/auth/components/ResetPassword.jsx';
import { ActivateUser } from '../../features/auth/components/ActivateUser.jsx';
import { UserPage } from '../../features/users/pages/UserPage.jsx';
import { AdminUsersPage } from '../../features/users/pages/AdminUserPage.jsx';
import { DepositPage } from '../../features/deposits/pages/DepositPage.jsx';
import { TransferPage } from '../../features/transfers/pages/TransfersPage.jsx';
import { ConfirmTransferPage } from '../../features/transfers/pages/ConfirmTransferPage.jsx';
import { AdminDashboardPage } from '../../features/admin/pages/AdminDashboardPage.jsx';
import { AdminProductsPage } from '../../features/products/pages/AdminProductsPage.jsx';
import { UserProductPage } from '../../features/products/pages/UserProductPage.jsx';
import { UserTransactionsPage } from '../../features/transactions/pages/UserTransactionPage.jsx';
import { ActivateRequest } from '../../features/auth/components/ActivateRequest.jsx';
import { FavoritesPage } from '../../features/favorites/pages/FavoritesPage.jsx';
import { HistoryPage } from '../../features/history/pages/Historypage.jsx';
import { BankHistoryPage } from '../../features/history/pages/Bankhistorypage.jsx';
import { UserHistoryPage } from '../../features/transactions/pages/UserHistoryPage.jsx';
import { AdminAccountsPage } from '../../features/accounts/pages/AdminAccountsPage.jsx';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<AuthPage />} />
      <Route path='/unauthorized' element={<UnauthorizedPage />} />
      <Route path='/reset-password' element={<ResetPassword />} />
      <Route path='/verify-email' element={<ActivateUser />} />
      <Route path='/resend-verification' element={<ActivateRequest />} />

      <Route
        path='/inicio'
        element={
          <ProtectedRoutes>
            <RoleGuard allowedRoles={['USER_ROLE']}>
              <UserLayout />
            </RoleGuard>
          </ProtectedRoutes>
        }
      >
        <Route index element={<UserPage />} />
        <Route path='depositos' element={<DepositPage />} />
        <Route path='favoritos' element={<FavoritesPage />} />
        <Route path='transferencias' element={<TransferPage />} />
        <Route path='confirmar-transferencia' element={<ConfirmTransferPage />} />
        <Route path='productos' element={<UserProductPage />} />
        <Route path='misProductos' element={<UserTransactionsPage />} />
        <Route path='historial' element={<UserHistoryPage />} />
      </Route>

      <Route
        path='/dashboard'
        element={
          <ProtectedRoutes>
            <RoleGuard allowedRoles={['SUPERADMIN_ROLE', 'ADMIN_ROLE']}>
              <DashboardPage />
            </RoleGuard>
          </ProtectedRoutes>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path='users' element={<AdminUsersPage />} />
        <Route path='products' element={<AdminProductsPage />} />
        <Route path='historial' element={<BankHistoryPage />} />
        <Route path='accounts' element={<AdminAccountsPage />} />
      </Route>
    </Routes>
  );
};
