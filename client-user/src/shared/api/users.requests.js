import { authClient } from './authClient';
import { ENDPOINTS } from '../constants/endpoints';

export const getPerfilRequest = async () => {
  return await authClient.get(ENDPOINTS.AUTH.PROFILE);
};

export const editPerfilRequest = async (data) => {
  return await authClient.patch(ENDPOINTS.AUTH.ME, data);
};

export const getAllUsersRequest = async () => {
  return await authClient.get(ENDPOINTS.AUTH.ADMIN_USERS);
};

export const adminCreateUserRequest = async (data) => {
  return await authClient.post(ENDPOINTS.AUTH.ADMIN_CREATE_USER, data);
};

export const adminDeleteUserRequest = async (userId) => {
  return await authClient.delete(`${ENDPOINTS.AUTH.ADMIN_DELETE_USER}/${userId}`);
};

export const getUsersSummaryRequest = async () => {
  return await authClient.get(ENDPOINTS.AUTH.ADMIN_USERS_SUMMARY);
};