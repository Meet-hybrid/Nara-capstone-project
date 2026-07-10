import { View, StyleSheet} from 'react-native';
import { colors, spacing } from '../../constants/theme';

export function Divider({ marginVertical }) {
  return <View style={[styles.divider, { marginVertical: marginVertical || spacing.md }]} />;
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: colors.divider,
  },
});
