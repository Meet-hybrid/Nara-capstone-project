import { View, Text, StyleSheet} from 'react-native';
import { colors, radius, spacing, fontSize } from '../../constants/theme';
import { StatusPill } from '../common/StatusPill';
import { formatNaira } from '../../utils/formatCurrency';

export function CoverageCard({ premium, coverageAmount, provider, status }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View>
          <Text style={styles.label}>Premium (included)</Text>
          <Text style={styles.value}>{formatNaira(premium)}</Text>
        </View>
        <StatusPill type={status === 'ACTIVE' ? 'active' : 'pending'} />
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <View>
          <Text style={styles.label}>Coverage amount</Text>
          <Text style={styles.value}>{formatNaira(coverageAmount)}</Text>
        </View>
        <View style={styles.provider}>
          <Text style={styles.label}>Provider</Text>
          <Text style={styles.providerName}>{provider}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: fontSize.sm,
    fontFamily: 'Inter_400Regular',
    color: colors.slateLight,
  },
  value: {
    fontSize: fontSize.md,
    fontFamily: 'Inter_700Bold',
    color: colors.text,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
  },
  provider: {
    alignItems: 'flex-end',
  },
  providerName: {
    fontSize: fontSize.base,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
    marginTop: 2,
  },
});
