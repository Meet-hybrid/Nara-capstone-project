import { View, Text, StyleSheet} from 'react-native';
import { spacing, fontSize } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';

export function ScreenHeader({ label, title, rightElement }) {
  const { colors: themeColors } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: themeColors.canvas }]}>
      <View style={[styles.banner, { backgroundColor: themeColors.forest }]}>
        <Text style={[styles.label, { color: themeColors.parchment }]}>{label}</Text>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: themeColors.surface }]}>{title}</Text>
          {rightElement}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {},
  banner: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingTop: 56,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  label: {
    fontSize: fontSize.xs,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
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
