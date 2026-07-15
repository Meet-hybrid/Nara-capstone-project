import api from './api';

const BASE = '/groups';

export const getGroups = async () => {
  return await api.get(`${BASE}/`);
};

export const getMyGroup = async () => {
  return await api.get(`${BASE}/my-group/`);
};

export const getGroupMembers = async () => {
  return await api.get(`${BASE}/my-group/members/`);
};

export const getGroupById = async (groupId) => {
  return await api.get(`${BASE}/${groupId}/`);
};
