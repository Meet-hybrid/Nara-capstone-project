import React from 'react';
import { render, waitFor } from '@testing-library/react-native';

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
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('../../store/memberStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    member: null,
    dashboard: {
      first_name: 'Chidi',
      group_name: 'Land Owambe',
      monthly_pot: 1800000,
      member_count: 6,
      current_month: 2,
      total_months: 6,
      pot_month: 'August 2026',
      total_contributed: 600000,
      recent_activities: [],
      next_deduction: {
        amount: 300000,
        date: '3 April 2026',
        bank: 'GTBank',
        status: 'scheduled',
      },
    },
    setMember: jest.fn(),
    setDashboard: jest.fn(),
  })),
}));

jest.mock('../../services/memberService', () => ({
  getDashboard: jest.fn().mockResolvedValue({}),
}));

jest.mock('@expo-google-fonts/inter', () => ({
  useFonts: () => [true],
  Inter_400Regular: {},
  Inter_500Medium: {},
  Inter_600SemiBold: {},
  Inter_700Bold: {},
}));

jest.mock('../../components/common/CircleRing', () => {
  const { View } = require('react-native');
  return {
    CircleRing: () => <View testID="circle-ring" />,
  };
});

jest.mock('../../components/common/StatusPill', () => {
  const { Text } = require('react-native');
  return {
    StatusPill: ({ type }) => <Text>{type}</Text>,
  };
});

jest.mock('../../components/home/DeductionCard', () => {
  const { View, Text } = require('react-native');
  return {
    DeductionCard: ({ date }) => (
      <View>
        <Text>Next deduction</Text>
        <Text>{date}</Text>
      </View>
    ),
  };
});

jest.mock('../../components/home/StatRow', () => {
  const { View, Text } = require('react-native');
  return {
    StatRow: ({ stats }) => (
      <View>
        {stats.map((s, i) => <Text key={i}>{s.value}</Text>)}
      </View>
    ),
  };
});

jest.mock('../../components/home/ActivityFeed', () => {
  const { View } = require('react-native');
  return {
    ActivityFeed: () => <View testID="activity-feed" />,
  };
});

test('home screen header shows group name from store', async () => {
  const OverviewScreen = require('../../app/(main)/index').default;
  const { getByText } = render(<OverviewScreen />);

  await waitFor(() => expect(getByText('Land Owambe')).toBeTruthy());
});

test('home screen renders circle ring', async () => {
  const OverviewScreen = require('../../app/(main)/index').default;
  const { getByTestId } = render(<OverviewScreen />);

  await waitFor(() => expect(getByTestId('circle-ring')).toBeTruthy());
});

test('home screen renders activity feed section', async () => {
  const OverviewScreen = require('../../app/(main)/index').default;
  const { getByTestId } = render(<OverviewScreen />);

  await waitFor(() => expect(getByTestId('activity-feed')).toBeTruthy());
});
