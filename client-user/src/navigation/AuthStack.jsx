import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../features/auth/screens/LoginScreen';
import ResetPasswordScreen from '../features/auth/components/ResetPasswordScreen';
import ActivateAccountScreen from '../features/auth/components/ActivateAccountScreen';
import UnauthorizedScreen from '../features/auth/screens/UnauthorizedScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="ActivateUser" component={ActivateAccountScreen} />
      <Stack.Screen name="Unauthorized" component={UnauthorizedScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
