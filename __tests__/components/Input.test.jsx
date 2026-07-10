import React from 'react';
import { render } from '@testing-library/react-native';
import { Input } from '../../components/common/Input';

jest.mock('../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      forest: '#1C3A2E',
      forestLight: '#2D6A4F',
      parchment: '#C8A96E',
      parchmentLight: '#F0E8D4',
      canvas: '#F7F5F0',
      surface: '#FFFFFF',
      text: '#1A1A1A',
      slate: '#4A5568',
      slateLight: '#8A95A3',
      divider: '#E5E0D8',
      danger: '#8B2020',
      dangerLight: '#FDF2F2',
      success: '#2D6A4F',
      successLight: '#E8F5EE',
    },
    isDark: false,
    toggleTheme: jest.fn(),
  }),
}));

test('Input displays label when provided', () => {
  const { getByText } = render(<Input label="Email" />);
  expect(getByText('Email')).toBeTruthy();
});

test('Input shows error message when error prop is passed', () => {
  const { getByText } = render(<Input label="Phone" error="Enter a valid Nigerian phone number" />);
  expect(getByText('Enter a valid Nigerian phone number')).toBeTruthy();
});

test('Input does not show error when error prop is not passed', () => {
  const { queryByText } = render(<Input label="Name" />);
  expect(queryByText('Enter a valid Nigerian phone number')).toBeNull();
});

test('Input passes secureTextEntry to TextInput', () => {
  const { getByTestId } = render(<Input label="Password" secureTextEntry testID="password-input" />);
  const input = getByTestId('password-input');
  expect(input.props.secureTextEntry).toBe(true);
});
