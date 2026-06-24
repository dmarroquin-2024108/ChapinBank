import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../shared/store/authStore';
import AuthStack from './AuthStack';
import UserTabs from './UserTabs';
import AdminStack from './AdminStack';
import LoadingSpinner from '../shared/components/common/LoadingSpinner';

const AppNavigator = () => {
  const { isAuthenticated, isLoadingAuth, user, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoadingAuth) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return (
      <NavigationContainer>
        <AuthStack />
      </NavigationContainer>
    );
  }

  const isAdmin = user?.role === 'ADMIN_ROLE' || user?.role === 'SUPERADMIN_ROLE';

  return (
    <NavigationContainer>
      {isAdmin ? <AdminStack /> : <UserTabs />}
    </NavigationContainer>
  );
};

export default AppNavigator;
