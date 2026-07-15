import { View, Text, StyleSheet } from 'react-native';
import { radius, spacing, fontSize } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';

export function StatRow({ stats }) {
  const { colors: c, shadows: s } = useTheme();

  return (
    <View style={[styles.row, { backgroundColor: c.surface, borderColor: c.divider, ...s.md }]}>
      {stats.map((stat, i) => (
        <View key={i} style={[styles.stat, i < stats.length - 1 && { borderRightWidth: 1, borderRightColor: c.divider }]}>
          <Text style={[styles.value, { color: c.text }]}>{stat.value}</Text>
          <Text style={[styles.label, { color: c.textSecondary }]}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.lg,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  value: {
    fontSize: fontSize.lg,
    fontFamily: 'Inter_700Bold',
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: fontSize.caption,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});
