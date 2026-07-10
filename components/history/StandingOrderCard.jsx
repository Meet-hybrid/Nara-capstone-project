import { View, Text, StyleSheet} from 'react-native';
import { colors, radius, spacing, fontSize } from '../../constants/theme';
import { formatNaira } from '../../utils/formatCurrency';

export function StandingOrderCard({ amount, day, bank, status }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Standing order</Text>
      <Text style={styles.amount}>{formatNaira(amount)}</Text>
      <Text style={styles.detail}>
        {day} of each month — {bank}
      </Text>
      <Text style={[styles.status, status === 'ACTIVE' && styles.active]}>
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  label: {
    fontSize: fontSize.xs,
    fontFamily: 'Inter_700Bold',
    color: colors.slateLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amount: {
    fontSize: fontSize.lg,
    fontFamily: 'Inter_700Bold',
    color: colors.text,
  },
  detail: {
    fontSize: fontSize.sm,
    fontFamily: 'Inter_400Regular',
    color: colors.slate,
  },
  status: {
    fontSize: fontSize.sm,
    fontFamily: 'Inter_600SemiBold',
    color: colors.slateLight,
    marginTop: spacing.xs,
  },
  active: {
    color: colors.success,
  },
});
