import { View, Text, StyleSheet} from 'react-native';
import { colors, radius, spacing, fontSize } from '../../constants/theme';
import { StatusPill } from '../common/StatusPill';
import { formatNaira } from '../../utils/formatCurrency';

export function ContributionRow({ month, date, reference, amount, status, isPot }) {
  return (
    <View style={[styles.row, isPot && styles.potRow]}>
      <View style={styles.left}>
        <Text style={[styles.month, isPot && styles.potText]}>{month}</Text>
        <Text style={styles.meta}>{date}</Text>
        {reference && <Text style={styles.meta}>Ref: {reference}</Text>}
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, isPot && styles.potText]}>{formatNaira(amount)}</Text>
        <StatusPill type={status} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  potRow: {
    borderWidth: 2,
    borderColor: colors.parchment,
  },
  left: {
    gap: 2,
  },
  month: {
    fontSize: fontSize.base,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
  },
  meta: {
    fontSize: fontSize.sm,
    fontFamily: 'Inter_400Regular',
    color: colors.slateLight,
  },
  right: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  amount: {
    fontSize: fontSize.md,
    fontFamily: 'Inter_700Bold',
    color: colors.text,
  },
  potText: {
    color: colors.parchment,
  },
});
