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

jest.mock('expo-router', () => ({
  useRouter: () => ({}),
}));

const mockGroup = {
  name: 'Land Owambe',
  goal_type: 'Land',
  contribution_tier: 300000,
  max_members: 6,
  monthly_pot: 1800000,
  current_cycle_month: 2,
  total_months: 6,
};

const mockMembers = [
  { id: 1, full_name: 'Chidi Okonkwo', collects_month: 'June 2026', status: 'active', months_completed: 2 },
  { id: 2, full_name: 'Amara Obi', collects_month: 'July 2026', status: 'collected', months_completed: 2 },
];

jest.mock('../../store/groupStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    group: mockGroup,
    members: mockMembers,
    setGroup: jest.fn(),
    setMembers: jest.fn(),
  })),
}));

jest.mock('../../store/memberStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    member: { id: 1 },
  })),
}));

jest.mock('../../services/groupService', () => ({
  getMyGroup: jest.fn().mockResolvedValue({ data: mockGroup }),
  getGroupMembers: jest.fn().mockResolvedValue({ data: mockMembers }),
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

jest.mock('../../components/circle/MemberCard', () => {
  const { View, Text } = require('react-native');
  return {
    MemberCard: ({ name, isCurrentUser }) => (
      <View>
        <Text>{name}</Text>
        {isCurrentUser && <Text>(You)</Text>}
      </View>
    ),
  };
});

jest.mock('../../components/circle/TrackBar', () => {
  const { View } = require('react-native');
  return {
    TrackBar: () => <View testID="track-bar" />,
  };
});

test('circle screen shows group info after loading', async () => {
  const CircleScreen = require('../../app/(main)/circle').default;
  const { findByText } = render(<CircleScreen />);

  const goal = await findByText('Land');
  expect(goal).toBeTruthy();
});

test('circle screen shows member names', async () => {
  const CircleScreen = require('../../app/(main)/circle').default;
  const { findByText } = render(<CircleScreen />);

  const name = await findByText('Chidi Okonkwo');
  expect(name).toBeTruthy();
});
