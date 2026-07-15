export const isValidNigerianPhone = (phone) => {
  const cleaned = phone.replace(/\s/g, '');
  return /^(070|080|081|090|091)\d{8}$/.test(cleaned);
};

export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isStrongPassword = (password) => {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
};

export const isValidBVN = (bvn) => /^\d{11}$/.test(bvn);

export const isValidNIN = (nin) => /^\d{11}$/.test(nin);

export const isValidAccountNumber = (accountNumber) => /^\d{10}$/.test(accountNumber);
