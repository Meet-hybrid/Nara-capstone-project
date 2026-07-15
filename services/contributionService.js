import api from './api';
import { getToken } from '../utils/storage';

const BASE = '/contributions';

export const getContributions = async () => {
  return await api.get(`${BASE}/`);
};

export const getContributionByMonth = async (monthYear) => {
  return await api.get(`${BASE}/${monthYear}/`);
};

export const logManualContribution = async (data) => {
  return await api.post(`${BASE}/manual/`, data);
};

export const downloadStatement = async () => {
  const token = await getToken('access_token');
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}${BASE}/statement/`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.blob();
};
