import React from 'react';
import { render } from '@testing-library/react-native';

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

jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));

const mockFn = jest.fn().mockResolvedValue({});

jest.mock('../../services/memberService', () => ({ getDashboard: mockFn }));

jest.mock('../../store/memberStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    member: null,
    dashboard: { pot_month: 'August 2026', total_months: 6, current_month: 2, recent_activities: [], next_deduction: null, total_contributed: 0, monthly_pot: 0, member_count: 0 },
    setDashboard: jest.fn(),
  })),
}));

jest.mock('@expo-google-fonts/inter', () => ({ useFonts: () => [true] }));

jest.mock('../../components/common/CircleRing', () => {
  const { View } = require('react-native');
  return { CircleRing: () => <View testID="ring" /> };
});

jest.mock('../../components/common/StatusPill', () => {
  const { Text } = require('react-native');
  return { StatusPill: ({ type }) => <Text>{type}</Text> };
});

jest.mock('../../components/home/DeductionCard', () => {
  const { View, Text } = require('react-native');
  return { DeductionCard: ({ date }) => <View><Text>{date}</Text></View> };
});

jest.mock('../../components/home/StatRow', () => {
  const { View, Text } = require('react-native');
  return { StatRow: ({ stats }) => <View>{stats.map((s,i) => <Text key={i}>{s.value}</Text>)}</View> };
});

jest.mock('../../components/home/ActivityFeed', () => {
  const { View } = require('react-native');
  return { ActivityFeed: () => <View /> };
});

test('check mock is called', async () => {
  const OverviewScreen = require('../../app/(main)/index').default;
  render(<OverviewScreen />);
  
  // Wait a bit for effects
  await new Promise(r => setTimeout(r, 100));
  
  expect(mockFn).toHaveBeenCalled();
});
