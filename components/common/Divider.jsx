import { View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { spacing } from '../../constants/theme';

export function Divider({ marginVertical }) {
  const { colors: c } = useTheme();
  return (
    <View
      style={{
        height: 1,
        backgroundColor: c.divider,
        marginVertical: marginVertical || spacing.md,
      }}
    />
  );
}
