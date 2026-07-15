import { View, Text, StyleSheet } from 'react-native';
import { radius, fontSize, spacing } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';

export function StatusPill({ type }) {
  const { colors: c } = useTheme();

  const config = {
    active: { bg: c.success + '18', txt: c.success, label: 'Active' },
    grace: { bg: c.warning + '18', txt: c.warning, label: 'Grace' },
    collected: { bg: c.warning + '18', txt: c.warning, label: 'Collected' },
    pending: { bg: c.textDisabled + '18', txt: c.textSecondary, label: 'Pending' },
    scheduled: { bg: c.accent + '15', txt: c.accent, label: 'Scheduled' },
    paused: { bg: c.textDisabled + '18', txt: c.textSecondary, label: 'Paused' },
    formed: { bg: c.warning + '18', txt: c.warning, label: 'Forming' },
  };

  const { bg, txt, label } = config[type] || config.pending;

  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <View style={[styles.dot, { backgroundColor: txt }]} />
      <Text style={[styles.label, { color: txt }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: fontSize.caption,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.3,
  },
});
