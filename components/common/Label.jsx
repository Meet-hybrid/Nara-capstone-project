import { Text, StyleSheet} from 'react-native';
import { colors, fontSize } from '../../constants/theme';

export function Label({ children }) {
  return <Text style={styles.label}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: {
    fontSize: fontSize.xs,
    fontFamily: 'Inter_700Bold',
    color: colors.parchment,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
