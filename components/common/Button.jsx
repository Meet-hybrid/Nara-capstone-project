import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { radius, fontSize, spacing } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { AnimatedPressable } from './AnimatedPressable';

export function Button({ title, onPress, variant = 'primary', loading, disabled, style }) {
  const { colors: c, shadows: s } = useTheme();

  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isDanger = variant === 'danger';
  const isOutline = variant === 'outline';

  const bg = isPrimary ? c.accent : isDanger ? c.danger : isSecondary ? c.accentLight : 'transparent';
  const txt = isPrimary || isDanger ? '#FFFFFF' : isOutline ? c.textSecondary : isSecondary ? c.accent : c.accent;
  const border = isOutline ? c.divider : isSecondary ? c.accent : 'transparent';
  const opacity = disabled || loading ? 0.5 : 1;
  const shadow = isPrimary ? s.glow : undefined;

  return (
    <AnimatedPressable onPress={onPress} disabled={disabled || loading}>
      <View style={[styles.button, { backgroundColor: bg, borderColor: border, borderWidth: isOutline ? 1 : 0, opacity, ...shadow }, style]}>
        {loading ? (
          <ActivityIndicator color={isPrimary || isDanger ? '#FFFFFF' : c.accent} />
        ) : (
          <Text style={[styles.text, { color: txt }]}>{title}</Text>
        )}
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xxl,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  text: {
    fontSize: fontSize.md,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.3,
  },
});
