import api from './api';

const BASE = '/standing-orders';

export const createStandingOrder = async (data) => {
  return await api.post(`${BASE}/standing-orders/`, data);
};

export const getMyStandingOrder = async () => {
  return await api.get(`${BASE}/me/`);
};

export const pauseStandingOrder = async () => {
  return await api.patch(`${BASE}/me/pause/`);
};

export const resumeStandingOrder = async () => {
  return await api.patch(`${BASE}/me/resume/`);
};
