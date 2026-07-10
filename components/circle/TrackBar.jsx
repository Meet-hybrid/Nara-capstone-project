import { View, StyleSheet} from 'react-native';
import { colors } from '../../constants/theme';

export function TrackBar({ months, completed }) {
  return (
    <View style={styles.bar}>
      {Array.from({ length: months }).map((_, i) => (
        <View
          key={i}
          style={[styles.dot, i < completed && styles.filled]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.divider,
  },
  filled: {
    backgroundColor: colors.parchment,
  },
});
