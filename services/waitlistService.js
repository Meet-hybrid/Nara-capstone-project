import api from './api';

const BASE = '/waitlist';

export const joinWaitlist = async () => {
  return await api.post(`${BASE}/`);
};

export const getWaitlistPosition = async () => {
  return await api.get(`${BASE}/position/`);
};

export const leaveWaitlist = async () => {
  await api.delete(`${BASE}/`);
};
