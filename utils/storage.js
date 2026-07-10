import { Platform } from 'react-native';

const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

let SecureStore;
try {
  SecureStore = require('expo-secure-store');
} catch {
  SecureStore = null;
}

const fallbackStore = {
  setItem: (key, value) => {
    try {
      if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(key, value);
      else if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
    } catch {}
  },
  getItem: (key) => {
    try {
      if (typeof sessionStorage !== 'undefined') return sessionStorage.getItem(key);
      if (typeof localStorage !== 'undefined') return localStorage.getItem(key);
    } catch {}
    return null;
  },
  removeItem: (key) => {
    try {
      if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(key);
      else if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
    } catch {}
  },
};

export const saveToken = async (key, value) => {
  if (isNative && SecureStore) {
    try {
      await SecureStore.setItemAsync(key, value);
      return;
    } catch {}
  }
  fallbackStore.setItem(key, value);
};

export const getToken = async (key) => {
  if (isNative && SecureStore) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {}
  }
  return fallbackStore.getItem(key);
};

export const clearToken = async (key) => {
  if (isNative && SecureStore) {
    try {
      await SecureStore.deleteItemAsync(key);
      return;
    } catch {}
  }
  fallbackStore.removeItem(key);
};

export const clearAllTokens = async () => {
  await clearToken('access_token');
  await clearToken('refresh_token');
};
