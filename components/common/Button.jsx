import { TouchableOpacity, Text, ActivityIndicator, StyleSheet} from 'react-native';
import { colors, radius, fontSize, spacing } from '../../constants/theme';

export function Button({ title, onPress, variant = 'primary', loading, disabled, style }) {
  console.log(`Rendering Button with variant ${variant} and title ${title}`);

  const bg = variant === 'primary' ? colors.forest : variant === 'danger' ? colors.danger : 'transparent';
  const txt = variant === 'outline' ? colors.forest : '#FFFFFF';
  const border = variant === 'outline' ? colors.forest : 'transparent';
  const opacity = disabled || loading ? 0.6 : 1;

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bg, borderColor: border, opacity }, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={[styles.text, { color: txt }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  text: {
    fontSize: fontSize.md,
    fontFamily: 'Inter_600SemiBold',
  },
});
