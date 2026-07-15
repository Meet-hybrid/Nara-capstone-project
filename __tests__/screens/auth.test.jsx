import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

jest.mock('../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      forest: '#1C3A2E', forestLight: '#2D6A4F', parchment: '#C8A96E', parchmentLight: '#F0E8D4',
      canvas: '#F7F5F0', surface: '#FFFFFF', text: '#1A1A1A', slate: '#4A5568', slateLight: '#8A95A3',
      divider: '#E5E0D8', danger: '#8B2020', dangerLight: '#FDF2F2', success: '#2D6A4F', successLight: '#E8F5EE',
    },
    isDark: false, toggleTheme: jest.fn(),
  }),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
  useLocalSearchParams: () => ({ phone: '08012345678' }),
}));

jest.mock('../../utils/storage', () => ({
  saveToken: jest.fn(),
  getToken: jest.fn(),
  clearAllTokens: jest.fn(),
}));

jest.mock('../../store/authStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    isAuthenticated: false,
    isVerified: false,
    login: jest.fn(),
    logout: jest.fn(),
    setVerified: jest.fn(),
  })),
}));

jest.mock('@expo-google-fonts/inter', () => ({
  useFonts: () => [true],
  Inter_400Regular: {},
  Inter_500Medium: {},
  Inter_600SemiBold: {},
  Inter_700Bold: {},
}));

jest.mock('../../services/authService', () => ({
  register: jest.fn(),
  verifyOtp: jest.fn(),
  login: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
}));

jest.mock('../../components/common/Button', () => {
  const { TouchableOpacity, Text, ActivityIndicator } = require('react-native');
  return {
    Button: ({ title, onPress, loading, disabled }) => (
      <TouchableOpacity onPress={onPress} disabled={disabled || loading}>
        <Text>{title}</Text>
      </TouchableOpacity>
    ),
  };
});

jest.mock('../../components/common/Input', () => {
  const { View, Text, TextInput } = require('react-native');
  return {
    Input: ({ label, error, value, onChangeText, ...rest }) => (
      <View>
        {label ? <Text>{label}</Text> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          {...rest}
        />
        {error ? <Text>{error}</Text> : null}
      </View>
    ),
  };
});

test('register screen shows all form fields', () => {
  const RegisterScreen = require('../../app/(auth)/register').default;
  const { getByText } = render(<RegisterScreen />);

  expect(getByText('Full name')).toBeTruthy();
  expect(getByText('Email')).toBeTruthy();
  expect(getByText('Phone number')).toBeTruthy();
  expect(getByText('Password')).toBeTruthy();
  expect(getByText('Confirm password')).toBeTruthy();
  expect(getByText('Bank name')).toBeTruthy();
  expect(getByText('Account number')).toBeTruthy();
  expect(getByText('BVN')).toBeTruthy();
  expect(getByText('NIN')).toBeTruthy();
});

test('register screen shows create account button', () => {
  const RegisterScreen = require('../../app/(auth)/register').default;
  const { getByText } = render(<RegisterScreen />);

  expect(getByText('Create account')).toBeTruthy();
});

test('login screen renders email and password fields', () => {
  const LoginScreen = require('../../app/(auth)/login').default;
  const { getByText } = render(<LoginScreen />);

  expect(getByText('Email')).toBeTruthy();
  expect(getByText('Password')).toBeTruthy();
});

test('login screen shows forgot password link', () => {
  const LoginScreen = require('../../app/(auth)/login').default;
  const { getByText } = render(<LoginScreen />);

  expect(getByText('Forgot password?')).toBeTruthy();
});
