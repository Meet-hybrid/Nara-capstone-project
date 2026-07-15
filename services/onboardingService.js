import api from './api';

const BASE = '/onboarding';

export const saveGoal = async (goal) => {
  return await api.post(`${BASE}/goal/`, { savings_goal: goal });
};

export const saveTier = async (tier) => {
  return await api.post(`${BASE}/tier/`, { contribution_tier: tier });
};

export const getGroupMatch = async () => {
  return await api.get(`${BASE}/match/`);
};

export const confirmGroupJoin = async (group_id) => {
  return await api.post(`${BASE}/confirm/`, { group_id });
};
