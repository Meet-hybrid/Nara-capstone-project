import api from './api';

const BASE = '/auth';

export const register = async (fullName, email, phone, password, bank, accountNumber, bvn, nin) => {
  return await api.post(`${BASE}/register/`, {
    full_name: fullName,
    email,
    phone,
    password,
    bank_name: bank,
    account_number: accountNumber,
    bvn,
    nin,
  }, false);
};

export const verifyOtp = async (phone, otp) => {
  return await api.post(`${BASE}/verify-otp/`, { phone, otp }, false);
};

export const login = async (email, password) => {
  return await api.post(`${BASE}/login/`, { email, password }, false);
};

export const refreshToken = async (token) => {
  return await api.post(`${BASE}/refresh/`, { refresh: token }, false);
};

export const logout = async (refreshTokenValue) => {
  await api.post(`${BASE}/logout/`, { refresh: refreshTokenValue }, false);
};

export const forgotPassword = async (phone) => {
  await api.post(`${BASE}/forgot-password/`, { phone }, false);
};

export const resetPassword = async (phone, otp, newPassword) => {
  await api.post(`${BASE}/reset-password/`, { phone, otp, new_password: newPassword }, false);
};
