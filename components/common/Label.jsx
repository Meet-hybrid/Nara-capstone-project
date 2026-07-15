import { Text} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { fontSize } from '../../constants/theme';

export function Label({ children }) {
  const { colors: c } = useTheme();
  return <Text style={{ fontSize: fontSize.xs, fontFamily: 'Inter_700Bold', color: c.parchment, letterSpacing: 1, textTransform: 'uppercase' }}>{children}</Text>;
}
