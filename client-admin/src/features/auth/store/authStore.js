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
import { errorMessage } from '../../../shared/utils/errorMessage.js';

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
                    set({ isLoadingAuth: false, isAuthenticated: true });
                } else {
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
                } catch (err) {
                    const message = errorMessage(err, "Error al iniciar sesión");
                    set({ error: message, loading: false });
                    return { success: false, error: message }
                }
            },

            lostPassword: async ({ email }) => {
                try {
                    set({ loading: true, error: null });
                    const { data } = await lostPasswordRequest({ email });
                    set({ loading: false });
                    return {
                        success: true,
                        emaiVerificationRequired: data?.emaiVerificationRequired,
                        data
                    }
                } catch (err) {
                    const message = errorMessage(err, "Error al enviar el correo");
                    set({ error: message, loading: false });
                    return { success: false, error: message }
                }
            },//Mandar Correo con el token

            resetPassword: async ({ token, NewPassword }) => {
                try {
                    set({ loading: true, error: null });
                    const { data } = await resetPasswordRequest({ token, NewPassword });
                    set({ loading: false })
                    return { success: true, data }
                } catch (err) {
                    const message = errorMessage(err, "No se pudo actualizar la contraseña");
                    set({ error: message, loading: false });
                    return { success: false, error: message }
                }
            },//Actualizar la contraseña

            activateUser: async ({ token }) => {
                try {
                    set({ loading: true, error: null });
                    const { data } = await activateUserRequest({ token });
                    set({ loading: false })
                    return { success: true, data }
                } catch (err) {
                    const message = errorMessage(err, "No se puede activar la cuenta");
                    set({ error: message, loading: false });
                    return { success: false, error: message }
                }
            },//Verificar Email

            changeTempPassword: async (NewPassword) => {
                try {
                    set({ loading: true, error: null });
                    const { data } = await changeTempPasswordRequest({ NewPassword });
                    set({
                        token: null,
                        refreshToken: null,
                        loading: false
                    });
                    return { success: true, data };
                } catch (err) {
                    const message = errorMessage(err, "Error al cambiar la contraseña")
                    set({ error: message, loading: false });
                    return { success: false, error: message };
                }
            }//CambiarContraseñaTemporal
        }),
        { name: "auth-CBK-Debbugers" },
    ),
)