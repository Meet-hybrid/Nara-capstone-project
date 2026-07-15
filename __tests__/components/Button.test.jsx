import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../components/common/Button';

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

test('Button displays the title text', () => {
  const { getByText } = render(<Button title="Create account" onPress={() => {}} />);
  expect(getByText('Create account')).toBeTruthy();
});

test('Button calls onPress when pressed', () => {
  const onPress = jest.fn();
  const { getByText } = render(<Button title="Tap me" onPress={onPress} />);
  fireEvent.press(getByText('Tap me'));
  expect(onPress).toHaveBeenCalledTimes(1);
});

test('Button does not call onPress when disabled', () => {
  const onPress = jest.fn();
  const { getByText } = render(<Button title="Tap me" onPress={onPress} disabled />);
  fireEvent.press(getByText('Tap me'));
  expect(onPress).not.toHaveBeenCalled();
});

test('Button does not show title text when loading', () => {
  const { queryByText } = render(<Button title="Tap me" onPress={() => {}} loading />);
  expect(queryByText('Tap me')).toBeNull();
});
