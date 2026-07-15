import { View, Text } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { radius, spacing, fontSize } from '../../constants/theme';
import { StatusPill } from '../common/StatusPill';
import { TrackBar } from './TrackBar';

export function MemberCard({ name, initial, collectsMonth, status, monthsCompleted, totalMonths, isCurrentUser }) {
  const { colors: c, shadows: s } = useTheme();
  return (
    <View style={[{ backgroundColor: c.surface, borderRadius: radius.md, padding: spacing.md, gap: spacing.sm, borderWidth: 1, borderColor: c.divider, ...s.md }, isCurrentUser && { borderColor: c.accent, borderWidth: 2 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        <View style={[{ width: 40, height: 40, borderRadius: 20, backgroundColor: c.elevated, alignItems: 'center', justifyContent: 'center' }, isCurrentUser && { backgroundColor: c.accent + '20' }]}>
          <Text style={[{ fontSize: fontSize.base, fontFamily: 'Inter_700Bold', color: c.textSecondary }, isCurrentUser && { color: c.accent }]}>{initial}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: fontSize.base, fontFamily: 'Inter_600SemiBold', color: c.text }}>{name} {isCurrentUser ? '(You)' : ''}</Text>
          <Text style={{ fontSize: fontSize.sm, fontFamily: 'Inter_400Regular', color: c.textSecondary }}>Collects {collectsMonth}</Text>
        </View>
        <StatusPill type={status} />
      </View>
      <TrackBar months={totalMonths} completed={monthsCompleted} />
    </View>
  );
}
