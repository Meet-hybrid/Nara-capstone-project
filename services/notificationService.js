import api from './api';

const BASE = '/notifications';

export const registerPushToken = async (pushToken) => {
  await api.post(`${BASE}/push-token/`, { push_token: pushToken });
};
