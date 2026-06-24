import { authClient } from './authClient';
import { ENDPOINTS } from '../constants/endpoints';

export const loginRequest = async ({ emailOrUsername, password }) => {
  return await authClient.post(ENDPOINTS.AUTH.LOGIN, { emailOrUsername, password });
};

export const lostPasswordRequest = async ({ email }) => {
  return await authClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
};

export const resetPasswordRequest = async ({ token, NewPassword }) => {
  return await authClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, { token, NewPassword });
};

export const activateUserRequest = async ({ token }) => {
  return await authClient.post(ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
};

export const changeTempPasswordRequest = async ({ NewPassword }) => {
  return await authClient.post(ENDPOINTS.AUTH.CHANGE_TEMP_PASSWORD, { NewPassword });
};

export const resendActivateRequest = async ({ email }) => {
  return await authClient.post(ENDPOINTS.AUTH.RESEND_VERIFICATION, { email });
};

export const getPerfilRequest = async () => {
  return await authClient.get(ENDPOINTS.AUTH.PROFILE);
};
