import api from './api';

const BASE = '/members';

export const getMyProfile = async () => {
  return await api.get(`${BASE}/me/`);
};

export const updateProfile = async (profileData) => {
  await api.patch(`${BASE}/me/`, profileData);
};

export const getDashboard = async () => {
  return await api.get(`${BASE}/me/dashboard/`);
};

export const getNotifications = async () => {
  return await api.get(`${BASE}/me/notifications/`);
};

export const markNotificationsRead = async () => {
  await api.patch(`${BASE}/me/notifications/read/`);
};
