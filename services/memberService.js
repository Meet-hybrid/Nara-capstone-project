import api from './api';

const BASE = '/members';

export const getMyProfile = async () => {
  const { data } = await api.get(`${BASE}/me/`);
  return data;
};

export const updateProfile = async (profileData) => {
  await api.patch(`${BASE}/me/`, profileData);
};

export const getDashboard = async () => {
  const { data } = await api.get(`${BASE}/me/dashboard/`);
  return data;
};

export const getNotifications = async () => {
  const { data } = await api.get(`${BASE}/me/notifications/`);
  return data;
};

export const markNotificationsRead = async () => {
  await api.patch(`${BASE}/me/notifications/read/`);
};
