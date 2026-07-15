import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { radius, fontSize, spacing } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';

export function Input({ label, error, secureTextEntry, ...rest }) {
  const { colors: c } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label && <Text style={[styles.label, { color: c.textSecondary }]}>{label}</Text>}
      <View style={styles.inputWrap}>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: error ? c.danger : focused ? c.accent : c.divider,
              color: c.text,
              backgroundColor: c.surface,
            },
            secureTextEntry && styles.inputWithEye,
          ]}
          secureTextEntry={secureTextEntry && !showPassword}
          placeholderTextColor={c.textDisabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.eyeText, { color: c.textSecondary }]}>
              {showPassword ? 'HIDE' : 'SHOW'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={[styles.error, { color: c.danger }]}>{error}</Text>}
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
    letterSpacing: 0.3,
  },
  inputWrap: {
    position: 'relative',
  },
  input: {
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    fontSize: fontSize.md,
    fontFamily: 'Inter_400Regular',
  },
  inputWithEye: {
    paddingRight: 56,
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  eyeText: {
    fontSize: fontSize.caption,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
  },
  error: {
    fontSize: fontSize.sm,
    fontFamily: 'Inter_400Regular',
  },
});
