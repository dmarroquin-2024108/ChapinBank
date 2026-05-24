import { axiosAuth } from './api.js';

export const login = async ({ emailOrUsername, password }) => {
  return await axiosAuth.post('/auth/login', { emailOrUsername, password });
};

export const lostPassword = async ({ email }) => {
  return await axiosAuth.post('/auth/forgot-password', { email });
};

export const resetPassword = async ({ token, NewPassword }) => {
  return await axiosAuth.post('/auth/reset-password', { token, NewPassword });
};

export const activateUser = async ({ token }) => {
  return await axiosAuth.post('/auth/verify-email', { token });
};

export const changeTempPassword = async ({ NewPassword }) => {
  return await axiosAuth.post('/auth/change-temp-password', { NewPassword });
};

export const getPerfil = async () => {
  return await axiosAuth.get('auth/profile');
};

export const getUsers = async () => {
  return await axiosAuth.get('auth/admin/users');
};

export const editPerfil = async (data) => {
  return await axiosAuth.patch('auth/me', data);
};

export const adminCreateUser = async (data) => {
  return await axiosAuth.post('auth/admin/create-user', data);
};

export const adminDeleteUser = async (userId) => {
  return await axiosAuth.delete(`auth/admin/users/${userId}`);
};

export const resendActivate = async ({ email }) => {
  return await axiosAuth.post('/auth/resend-verification', { email });
};
