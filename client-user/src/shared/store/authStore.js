import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { setRefreshToken, getRefreshToken, setOnAuthFailure, setOnTokenRefreshed } from '../api/authClient';
import {
  loginRequest,
  lostPasswordRequest,
  resetPasswordRequest,
  activateUserRequest,
  changeTempPasswordRequest,
  resendActivateRequest,
} from '../api/auth.requests';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      expiresAt: null,
      loading: false,
      error: null,
      isLoadingAuth: true,
      isAuthenticated: false,

      checkAuth: async () => {
        try {
          const token = await SecureStore.getItemAsync('accessToken');
          if (token) {
            set({ isLoadingAuth: false, isAuthenticated: true });
          } else {
            set({ isLoadingAuth: false, isAuthenticated: false });
          }
        } catch (error) {
          set({ isLoadingAuth: false, isAuthenticated: false });
        }
      },

      resendActivate: async ({ email }) => {
        try {
          set({ loading: true, error: null });
          const { data } = await resendActivateRequest({ email });
          set({ loading: false });
          return {
            success: true,
            emaiVerificationRequired: data?.emaiVerificationRequired,
            data,
          };
        } catch (err) {
          const message = err.response?.data?.message || err.message || 'Error al reenviar el correo de verificación.';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      logout: async () => {
        await SecureStore.deleteItemAsync('accessToken');
        await setRefreshToken(null);
        set({
          user: null,
          token: null,
          refreshToken: null,
          expiresAt: null,
          isAuthenticated: false,
          isLoadingAuth: false,
        });
      },

      login: async ({ emailOrUsername, password }) => {
        try {
          set({ loading: true, error: null });
          const { data } = await loginRequest({ emailOrUsername, password });
          
          if (data?.requiresPasswordChange) {
            await SecureStore.setItemAsync('accessToken', data.token);
            await setRefreshToken(data.refreshToken);
            set({ token: data.token, refreshToken: data.refreshToken, loading: false });
            return { success: false, requiresPasswordChange: true };
          }
          
          await SecureStore.setItemAsync('accessToken', data.token);
          await setRefreshToken(data.refreshToken);
          
          set({
            user: data.userDetails,
            token: data.token,
            refreshToken: data.refreshToken,
            expiresAt: data.expiresAt,
            isAuthenticated: true,
            loading: false,
          });
          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || err.message || 'Error al iniciar sesión';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      lostPassword: async ({ email }) => {
        try {
          set({ loading: true, error: null });
          const { data } = await lostPasswordRequest({ email });
          set({ loading: false });
          return { success: true, emaiVerificationRequired: data?.emaiVerificationRequired, data };
        } catch (err) {
          const message = err.response?.data?.message || err.message || 'Error al enviar el correo';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      resetPassword: async ({ token, NewPassword }) => {
        try {
          set({ loading: true, error: null });
          const { data } = await resetPasswordRequest({ token, NewPassword });
          set({ loading: false });
          return { success: true, data };
        } catch (err) {
          const message = err.response?.data?.message || err.message || 'No se pudo actualizar la contraseña';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      activateUser: async ({ token }) => {
        try {
          set({ loading: true, error: null });
          const { data } = await activateUserRequest({ token });
          set({ loading: false });
          return { success: true, data };
        } catch (err) {
          const message = err.response?.data?.message || err.message || 'No se puede activar la cuenta';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      changeTempPassword: async (NewPassword) => {
        try {
          set({ loading: true, error: null });
          const { data } = await changeTempPasswordRequest({ NewPassword });
          await SecureStore.deleteItemAsync('accessToken');
          await setRefreshToken(null);
          set({ token: null, refreshToken: null, loading: false });
          return { success: true, data };
        } catch (err) {
          const message = err.response?.data?.message || err.message || 'Error al cambiar la contraseña';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },
    }),
    {
      name: 'auth-CBK-Debbugers',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

setOnTokenRefreshed(({ token, refreshToken, expiresAt }) => {
  useAuthStore.setState({ token, refreshToken, expiresAt });
});


setOnAuthFailure(async () => {
  await useAuthStore.getState().logout();
});