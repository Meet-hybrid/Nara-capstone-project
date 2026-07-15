import useAuthStore from '../store/authStore';
import { login as loginApi, logout as logoutApi } from '../services/authService';
import { saveToken, clearAllTokens, getToken } from '../utils/storage';

export function useAuth() {
  const { isAuthenticated, login: setAuth, logout: clearAuth } = useAuthStore();

  const login = async (email, password) => {
    console.log('Logging member in with email and password');
    const result = await loginApi(email, password);
    await saveToken('access_token', result.access);
    await saveToken('refresh_token', result.refresh);
    setAuth({ access: result.access, refresh: result.refresh });
  };

  const logout = async () => {
    console.log('Logging member out and clearing stored tokens');
    const refreshToken = await getToken('refresh_token');
    try {
      if (refreshToken) await logoutApi(refreshToken);
    } catch {
      // proceed even if API call fails
    }
    await clearAllTokens();
    clearAuth();
  };

  return { isAuthenticated, login, logout, isLoading: false };
}
