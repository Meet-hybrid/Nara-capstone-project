import { View, Text } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { radius, spacing, fontSize } from '../../constants/theme';
import { formatNaira } from '../../utils/formatCurrency';

export function StandingOrderCard({ amount, day, bank, status }) {
  const { colors: c, shadows: s } = useTheme();
  return (
    <View style={{ backgroundColor: c.surface, borderRadius: radius.md, padding: spacing.lg, gap: spacing.xs, borderWidth: 1, borderColor: c.divider, ...s.md }}>
      <Text style={{ fontSize: fontSize.caption, fontFamily: 'Inter_700Bold', color: c.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 }}>Standing order</Text>
      <Text style={{ fontSize: fontSize.lg, fontFamily: 'Inter_700Bold', color: c.text, fontVariant: ['tabular-nums'] }}>{formatNaira(amount)}</Text>
      <Text style={{ fontSize: fontSize.sm, fontFamily: 'Inter_400Regular', color: c.textSecondary }}>
        {day} of each month — {bank}
      </Text>
      <Text style={[{ fontSize: fontSize.sm, fontFamily: 'Inter_600SemiBold', color: c.textSecondary, marginTop: spacing.xs }, status === 'ACTIVE' && { color: c.success }]}>
        {status}
      </Text>
    </View>
  );
}
