import api from './api';

const BASE = '/insurance';

export const getMyCover = async () => {
  return await api.get(`${BASE}/me/`);
};

export const fileClaim = async (reason) => {
  return await api.post(`${BASE}/claim/`, { reason });
};

export const getClaimStatus = async () => {
  return await api.get(`${BASE}/claim/status/`);
};
