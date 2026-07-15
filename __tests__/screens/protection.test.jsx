import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

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
  useRouter: () => ({}),
}));

jest.mock('../../services/insuranceService', () => ({
  getMyCover: jest.fn().mockResolvedValue({
    data: {
      premium_amount: 15000,
      coverage_amount: 1800000,
      provider: 'AXA Mansard',
      status: 'ACTIVE',
    },
  }),
  fileClaim: jest.fn().mockResolvedValue({}),
}));

jest.mock('@expo-google-fonts/inter', () => ({
  useFonts: () => [true],
  Inter_400Regular: {},
  Inter_500Medium: {},
  Inter_600SemiBold: {},
  Inter_700Bold: {},
}));

jest.mock('../../components/common/ScreenHeader', () => {
  const { View, Text } = require('react-native');
  return {
    ScreenHeader: ({ label, title }) => (
      <View>
        <Text>{label}</Text>
        <Text>{title}</Text>
      </View>
    ),
  };
});

jest.mock('../../components/common/StatusPill', () => {
  const { Text } = require('react-native');
  return {
    StatusPill: ({ type }) => <Text>{type}</Text>,
  };
});

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

jest.mock('../../components/protection/CoverageCard', () => {
  const { View, Text } = require('react-native');
  return {
    CoverageCard: ({ provider, status }) => (
      <View>
        <Text>{provider}</Text>
        <Text>{status === 'ACTIVE' ? 'Active' : 'Inactive'}</Text>
      </View>
    ),
  };
});

jest.mock('../../components/protection/ScenarioCard', () => {
  const { View, Text } = require('react-native');
  return {
    ScenarioCard: ({ title }) => (
      <View>
        <Text>{title}</Text>
      </View>
    ),
  };
});

test('protection screen shows the provider name from the API', async () => {
  const ProtectionScreen = require('../../app/(main)/protection').default;
  const { findByText } = render(<ProtectionScreen />);

  const provider = await findByText('AXA Mansard', {}, { timeout: 10000 });
  expect(provider).toBeTruthy();
});

test('protection screen shows what is covered scenarios', async () => {
  const ProtectionScreen = require('../../app/(main)/protection').default;
  const { findByText } = render(<ProtectionScreen />);

  const death = await findByText('Death', {}, { timeout: 10000 });
  expect(death).toBeTruthy();
});

test('declare emergency button opens confirmation modal', async () => {
  const ProtectionScreen = require('../../app/(main)/protection').default;
  const { findByText } = render(<ProtectionScreen />);

  const button = await findByText('Declare an emergency', {}, { timeout: 10000 });
  fireEvent.press(button);

  await waitFor(() => {
    expect(findByText('Select the reason for your claim:')).toBeTruthy();
  });
});
