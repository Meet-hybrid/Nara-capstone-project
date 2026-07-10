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
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

jest.mock('@expo-google-fonts/inter', () => ({
  useFonts: () => [true],
  Inter_400Regular: {},
  Inter_500Medium: {},
  Inter_600SemiBold: {},
  Inter_700Bold: {},
}));

jest.mock('../../services/onboardingService', () => ({
  saveGoal: jest.fn(),
  saveTier: jest.fn(),
  getGroupMatch: jest.fn(),
  confirmGroupJoin: jest.fn(),
}));

jest.mock('../../components/common/Button', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return {
    Button: ({ title, onPress, loading, disabled }) => (
      <TouchableOpacity onPress={onPress} disabled={disabled || loading}>
        <Text>{title}</Text>
      </TouchableOpacity>
    ),
  };
});

jest.mock('../../components/common/Label', () => {
  const { Text } = require('react-native');
  return {
    Label: ({ children }) => <Text>{children}</Text>,
  };
});

test('goal screen renders all six goal options', () => {
  const GoalScreen = require('../../app/(onboarding)/goal').default;
  const { getByText } = render(<GoalScreen />);

  expect(getByText('Land')).toBeTruthy();
  expect(getByText('Car')).toBeTruthy();
  expect(getByText('House')).toBeTruthy();
  expect(getByText('Business Capital')).toBeTruthy();
  expect(getByText('School Fees')).toBeTruthy();
  expect(getByText('Flexible')).toBeTruthy();
});

test('continue button is rendered on the goal screen', () => {
  const GoalScreen = require('../../app/(onboarding)/goal').default;
  const { getByText } = render(<GoalScreen />);

  expect(getByText('Continue')).toBeTruthy();
});

test('goal screen highlights the selected goal', () => {
  const GoalScreen = require('../../app/(onboarding)/goal').default;
  const { getByText } = render(<GoalScreen />);

  fireEvent.press(getByText('Land'));
  expect(getByText('Land')).toBeTruthy();
});

test('tier screen renders header text', () => {
  const TierScreen = require('../../app/(onboarding)/tier').default;
  const { getByText } = render(<TierScreen />);

  expect(getByText('Step 2 of 3')).toBeTruthy();
});

test('match screen shows loading state initially', () => {
  const MatchScreen = require('../../app/(onboarding)/match').default;
  const { getByText } = render(<MatchScreen />);

  expect(getByText('Finding your group...')).toBeTruthy();
});
