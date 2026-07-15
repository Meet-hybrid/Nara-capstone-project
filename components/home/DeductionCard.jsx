import { View, Text, StyleSheet } from 'react-native';
import { radius, spacing, fontSize } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { StatusPill } from '../common/StatusPill';
import { formatNaira } from '../../utils/formatCurrency';

export function DeductionCard({ amount, date, bank, status }) {
  const { colors: c, shadows: s } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.divider, ...s.md }]}>
      <View style={styles.topRow}>
        <View>
          <Text style={[styles.label, { color: c.textSecondary }]}>Next deduction</Text>
          <Text style={[styles.date, { color: c.text }]}>{date}</Text>
        </View>
        <StatusPill type={status} />
      </View>
      <Text style={[styles.amount, { color: c.text }]}>{formatNaira(amount)}</Text>
      <Text style={[styles.bank, { color: c.textSecondary }]}>{bank}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: fontSize.sm,
    fontFamily: 'Inter_400Regular',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  date: {
    fontSize: fontSize.md,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 2,
  },
  amount: {
    fontSize: fontSize.xl,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
  },
  bank: {
    fontSize: fontSize.sm,
    fontFamily: 'Inter_400Regular',
  },
});
