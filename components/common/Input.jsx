import { View, Text, TextInput, StyleSheet} from 'react-native';
import { colors, radius, fontSize, spacing } from '../../constants/theme';

export function Input({ label, error, secureTextEntry, ...rest }) {
  console.log(`Rendering Input with label ${label}`);

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        secureTextEntry={secureTextEntry}
        placeholderTextColor={colors.slateLight}
        {...rest}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  label: {
    fontSize: fontSize.sm,
    fontFamily: 'Inter_600SemiBold',
    color: colors.slate,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    fontSize: fontSize.md,
    color: colors.text,
    backgroundColor: colors.surface,
    fontFamily: 'Inter_400Regular',
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    fontSize: fontSize.sm,
    color: colors.danger,
    fontFamily: 'Inter_400Regular',
  },
});
