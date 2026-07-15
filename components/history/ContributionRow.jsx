import { View, Text } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { radius, spacing, fontSize } from '../../constants/theme';
import { StatusPill } from '../common/StatusPill';
import { formatNaira } from '../../utils/formatCurrency';

export function ContributionRow({ month, date, reference, amount, status, isPot }) {
  const { colors: c, shadows: s } = useTheme();
  return (
    <View style={[{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: c.surface, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: c.divider, ...s.sm }, isPot && { borderColor: c.accent, borderWidth: 2 }]}>
      <View style={{ gap: 2, flex: 1 }}>
        <Text style={[{ fontSize: fontSize.base, fontFamily: 'Inter_600SemiBold', color: c.text }, isPot && { color: c.accent }]}>{month}</Text>
        <Text style={{ fontSize: fontSize.sm, fontFamily: 'Inter_400Regular', color: c.textSecondary }}>{date}</Text>
        {reference && <Text style={{ fontSize: fontSize.sm, fontFamily: 'Inter_400Regular', color: c.textDisabled }}>Ref: {reference}</Text>}
      </View>
      <View style={{ alignItems: 'flex-end', gap: spacing.xs }}>
        <Text style={[{ fontSize: fontSize.md, fontFamily: 'Inter_700Bold', color: c.text, fontVariant: ['tabular-nums'] }, isPot && { color: c.accent }]}>{formatNaira(amount)}</Text>
        <StatusPill type={status} />
      </View>
    </View>
  );
}
