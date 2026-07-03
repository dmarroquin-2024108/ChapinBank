import { accountsClient } from './authClient';

export const getMyNotificationsRequest = async () => {
  return await accountsClient.get('/notifications/my');
};

export const markNotificationReadRequest = async (notificationId) => {
  return await accountsClient.patch(`/notifications/${notificationId}/read`);
};
