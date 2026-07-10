import api from './api';

const BASE = '/disbursements';

export const getDisbursements = async () => {
  return await api.get(`${BASE}/disbursements/`);
};

export const processDisbursement = async () => {
  return await api.post(`${BASE}/process/`);
};
