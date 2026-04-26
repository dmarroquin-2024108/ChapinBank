import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    login as loginRequest,
    lostPassword as lostPasswordRequest,
    resetPassword as resetPasswordRequest,
    activateUser as activateUserRequest,
    changeTempPassword as changeTempPasswordRequest,
} from '../../../shared/apis';
import { showError } from '../../../shared/utils/toast.js';
import { data } from 'react-router-dom';

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
            checkAuth: () => {
                const token = get().token;
                if (token) {
                    set({isLoadingAuth: false,isAuthenticated: true});
                }else{
                    set({
                    isLoadingAuth: false,
                    isAuthenticated: false
                    })
                }
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    refreshToken: null,
                    expiresAt: null,
                    isAuthenticated: false,
                })
            },

            login: async ({ emailOrUsername, password }) => {
                try {
                    set({ loading: true, error: null });
                    const { data } = await loginRequest({ emailOrUsername, password })
                    if (data?.requiresPasswordChange) {
                        set({
                            token: data.token,
                            refreshToken: data.refreshToken,
                            loading: false
                        });
                        return { success: false, requiresPasswordChange: true };
                    }

                    set({
                        user: data.userDetails,
                        token: data.token,
                        refreshToken: data.refreshToken,
                        expiresAt: data.expiresAt,
                        isAuthenticated: true,
                        loading: false,
                    })
                    return { success: true };
                } catch (e) {
                    const message = e.response?.data?.message || "Error al iniciar sesión";
                    set({ error: message, loading: false });
                    return { success: false, error: message }
                }
            },

            lostPassword: async (formData) => {
                try {
                    set({ loading: true, error: null });
                    const { data } = await lostPasswordRequest(formData);
                    set({ loading: false });
                    return {
                        success: true,
                        emaiVerificationRequired: data?.emaiVerificationRequired,
                        data
                    }
                } catch (e) {
                    const message = e.response?.data?.message || "Error al enviar correo con el token";
                    set({ error: message, loading: false });
                    return { success: false, error: message }
                }
            },//Mandar Correo con el token

            resetPassword: async (formData) => {
                try {
                    set({ loading: true, error: null });
                    const { data } = await resetPasswordRequest(formData);
                    set({ loading: false })
                    return { success: true, data }
                } catch (e) {
                    const message = e.response?.data?.message || "Error al actualizar la contraseña";
                    set({ error: message, loading: false });
                    return { success: false, error: message }
                }
            },//Actualizar la contraseña

            activateUser: async (formData) => {
                try {
                    set({ loading: true, error: null });
                    const { data } = await activateUserRequest(formData);
                    set({ loading: false })
                    return { success: true, data }
                } catch (e) {
                    const message = e.response?.data?.message || "No se puede activar la cuenta";
                    set({ error: message, loading: false });
                    return { success: false, error: message }
                }
            },//Verificar Email

            changeTempPassword: async (newPassword) => {
                try {
                    set({ loading: true, error: null });
                    const { data } = await changeTempPasswordRequest({ NewPassword: newPassword });
                    set({
                        token: null,
                        refreshToken: null,
                        loading: false
                    });
                    return { success: true, data };
                } catch (e) {
                    const message = e.response?.data?.message || "Error al cambiar la contraseña";
                    set({ error: message, loading: false });
                    return { success: false, error: message };
                }
            }//CambiarContraseñaTemporal
        }),
        { name: "auth-CBK-Debbugers" },
    ),
)