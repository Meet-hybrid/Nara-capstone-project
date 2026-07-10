import { View, Text, StyleSheet} from 'react-native';
import { colors, radius, spacing, fontSize } from '../../constants/theme';
import { StatusPill } from '../common/StatusPill';
import { formatNaira } from '../../utils/formatCurrency';

export function DeductionCard({ amount, date, bank, status }) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.label}>Next deduction</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <StatusPill type={status} />
      </View>
      <Text style={styles.amount}>{formatNaira(amount)}</Text>
      <Text style={styles.bank}>{bank}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
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
    color: colors.slateLight,
  },
  date: {
    fontSize: fontSize.md,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
    marginTop: 2,
  },
  amount: {
    fontSize: fontSize.xl,
    fontFamily: 'Inter_700Bold',
    color: colors.forest,
  },
  bank: {
    fontSize: fontSize.sm,
    fontFamily: 'Inter_400Regular',
    color: colors.slate,
  },
});
