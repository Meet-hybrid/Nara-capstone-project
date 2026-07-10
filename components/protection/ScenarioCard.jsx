import { View, Text, StyleSheet} from 'react-native';
import { colors, radius, spacing, fontSize } from '../../constants/theme';

export function ScenarioCard({ title, description }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: {
    fontSize: fontSize.base,
    fontFamily: 'Inter_700Bold',
    color: colors.text,
  },
  desc: {
    fontSize: fontSize.sm,
    fontFamily: 'Inter_400Regular',
    color: colors.slate,
    lineHeight: 20,
  },
});
