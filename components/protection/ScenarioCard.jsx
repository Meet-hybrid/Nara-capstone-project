import { View, Text } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { radius, spacing, fontSize } from '../../constants/theme';

export function ScenarioCard({ title, description }) {
  const { colors: c, shadows: s } = useTheme();
  return (
    <View style={{ backgroundColor: c.surface, borderRadius: radius.md, padding: spacing.md, gap: spacing.sm, borderWidth: 1, borderColor: c.divider, ...s.sm }}>
      <Text style={{ fontSize: fontSize.base, fontFamily: 'Inter_700Bold', color: c.text }}>{title}</Text>
      <Text style={{ fontSize: fontSize.sm, fontFamily: 'Inter_400Regular', color: c.textSecondary, lineHeight: 20 }}>{description}</Text>
    </View>
  );
}
