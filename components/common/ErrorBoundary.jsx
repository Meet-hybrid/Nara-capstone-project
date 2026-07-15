import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { spacing, fontSize, radius } from '../../constants/theme';

export function ErrorBoundary({ children }) {
  const { colors: c } = useTheme();
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  const handleReset = useCallback(() => {
    setHasError(false);
    setError(null);
  }, []);

  if (hasError) {
    return (
      <View style={{ flex: 1, backgroundColor: c.canvas, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.md }}>
        <Text style={{ fontSize: fontSize.lg, fontFamily: 'Inter_700Bold', color: c.text }}>Something went wrong</Text>
        <Text style={{ fontSize: fontSize.base, fontFamily: 'Inter_400Regular', color: c.slate, textAlign: 'center', lineHeight: 22 }}>
          An unexpected error occurred. Please try again.
        </Text>
        <TouchableOpacity style={{ backgroundColor: c.forest, paddingVertical: spacing.sm + 4, paddingHorizontal: spacing.xl, borderRadius: radius.md }} onPress={handleReset}>
          <Text style={{ color: c.surface, fontSize: fontSize.base, fontFamily: 'Inter_600SemiBold' }}>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return children;
}
