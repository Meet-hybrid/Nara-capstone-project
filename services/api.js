import { getToken } from '../utils/storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

async function request(method, path, body = null, auth = true) {
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = await getToken('access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  config.signal = controller.signal;

  try {
    const res = await fetch(`${BASE_URL}${path}`, config);

    let json;
    try {
      json = await res.json();
    } catch {
      json = null;
    }

    if (!res.ok) {
      const message = json?.message || json?.detail || `Request failed (${res.status})`;
      const err = new Error(message);
      err.response = { data: json, status: res.status };
      throw err;
    }

    return json;
  } catch (err) {
    if (err.name === 'AbortError') {
      const timeoutErr = new Error('Request timed out. Check your connection and try again.');
      timeoutErr.response = { status: 0, data: null };
      throw timeoutErr;
    }
    if (err.message?.includes('Network request failed') || err.message?.includes('fetch')) {
      const netErr = new Error('Unable to connect to the server. Make sure the backend is running.');
      netErr.response = { status: 0, data: null };
      throw netErr;
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

const api = {
  get: (path, auth = true) => request('GET', path, null, auth),
  post: (path, body, auth = true) => request('POST', path, body, auth),
  patch: (path, body, auth = true) => request('PATCH', path, body, auth),
  put: (path, body, auth = true) => request('PUT', path, body, auth),
  delete: (path, auth = true) => request('DELETE', path, null, auth),
};

export default api;
