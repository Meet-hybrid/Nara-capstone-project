import { View, Text, StyleSheet} from 'react-native';
import { colors, radius, spacing, fontSize } from '../../constants/theme';

export function StatRow({ stats }) {
  return (
    <View style={styles.row}>
      {stats.map((stat, i) => (
        <View key={i} style={[styles.stat, i < stats.length - 1 && styles.border]}>
          <Text style={styles.value}>{stat.value}</Text>
          <Text style={styles.label}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  border: {
    borderRightWidth: 1,
    borderRightColor: colors.divider,
  },
  value: {
    fontSize: fontSize.lg,
    fontFamily: 'Inter_700Bold',
    color: colors.text,
  },
  label: {
    fontSize: fontSize.xs,
    fontFamily: 'Inter_400Regular',
    color: colors.slateLight,
    textTransform: 'uppercase',
  },
});
