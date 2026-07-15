import { View, Text } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { radius, spacing, fontSize } from '../../constants/theme';
import { StatusPill } from '../common/StatusPill';
import { formatNaira } from '../../utils/formatCurrency';

export function CoverageCard({ premium, coverageAmount, provider, status }) {
  const { colors: c, shadows: s } = useTheme();
  return (
    <View style={{ backgroundColor: c.surface, borderRadius: radius.md, padding: spacing.lg, gap: spacing.md, borderWidth: 1, borderColor: c.divider, ...s.md }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <Text style={{ fontSize: fontSize.sm, fontFamily: 'Inter_400Regular', color: c.textSecondary, letterSpacing: 0.3, textTransform: 'uppercase' }}>Premium (included)</Text>
          <Text style={{ fontSize: fontSize.md, fontFamily: 'Inter_700Bold', color: c.text, marginTop: 2, fontVariant: ['tabular-nums'] }}>{formatNaira(premium)}</Text>
        </View>
        <StatusPill type={status === 'ACTIVE' ? 'active' : 'pending'} />
      </View>
      <View style={{ height: 1, backgroundColor: c.divider }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <Text style={{ fontSize: fontSize.sm, fontFamily: 'Inter_400Regular', color: c.textSecondary, letterSpacing: 0.3, textTransform: 'uppercase' }}>Coverage amount</Text>
          <Text style={{ fontSize: fontSize.md, fontFamily: 'Inter_700Bold', color: c.text, marginTop: 2, fontVariant: ['tabular-nums'] }}>{formatNaira(coverageAmount)}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: fontSize.sm, fontFamily: 'Inter_400Regular', color: c.textSecondary, letterSpacing: 0.3, textTransform: 'uppercase' }}>Provider</Text>
          <Text style={{ fontSize: fontSize.base, fontFamily: 'Inter_600SemiBold', color: c.text, marginTop: 2 }}>{provider}</Text>
        </View>
      </View>
    </View>
  );
}
