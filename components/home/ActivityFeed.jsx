import { View, Text, StyleSheet } from 'react-native';
import { spacing, fontSize, radius } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';

export function ActivityFeed({ activities }) {
  const { colors: c, shadows: s } = useTheme();

  const dotColors = {
    credit: c.success,
    payout: c.warning,
    setup: c.accent,
  };

  if (!activities?.length) return null;

  return (
    <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.divider, ...s.md }]}>
      <Text style={[styles.heading, { color: c.text }]}>Recent activity</Text>
      {activities.map((item, i) => (
        <View key={i} style={styles.row}>
          <View style={[styles.dot, { backgroundColor: dotColors[item.type] || c.textDisabled }]} />
          <View style={styles.textWrap}>
            <Text style={[styles.action, { color: c.text }]}>{item.description || item.action}</Text>
            <Text style={[styles.detail, { color: c.textSecondary }]}>{item.date || item.detail}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
  heading: {
    fontSize: fontSize.md,
    fontFamily: 'Inter_700Bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  textWrap: {
    flex: 1,
  },
  action: {
    fontSize: fontSize.base,
    fontFamily: 'Inter_500Medium',
  },
  detail: {
    fontSize: fontSize.sm,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
});
