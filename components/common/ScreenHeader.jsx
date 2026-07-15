import { View, Text, StyleSheet } from 'react-native';
import { spacing, fontSize, radius } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';

export function ScreenHeader({ label, title, rightElement }) {
  const { colors: c } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: c.canvas }]}>
      <View style={[styles.banner, { backgroundColor: c.canvas }]}>
        {label && <Text style={[styles.label, { color: c.textSecondary }]}>{label}</Text>}
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: c.text }]}>{title}</Text>
          {rightElement}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {},
  banner: {
    paddingTop: 56,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  label: {
    fontSize: fontSize.sm,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  title: {
    fontSize: fontSize.xl,
    fontFamily: 'Inter_700Bold',
  },
});
