import { View, Text, StyleSheet} from 'react-native';
import { colors, spacing, fontSize } from '../../constants/theme';

export function ActivityFeed({ activities }) {

  const dotColors = {
    credit: colors.success,
    payout: colors.parchment,
    setup: colors.forest,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Recent activity</Text>
      {activities.map((item, i) => (
        <View key={i} style={styles.row}>
          <View style={[styles.dot, { backgroundColor: dotColors[item.type] || colors.slate }]} />
          <View style={styles.textWrap}>
            <Text style={styles.action}>{item.action}</Text>
            <Text style={styles.detail}>{item.detail}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  heading: {
    fontSize: fontSize.md,
    fontFamily: 'Inter_700Bold',
    color: colors.text,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  textWrap: {
    flex: 1,
  },
  action: {
    fontSize: fontSize.base,
    fontFamily: 'Inter_500Medium',
    color: colors.text,
  },
  detail: {
    fontSize: fontSize.sm,
    fontFamily: 'Inter_400Regular',
    color: colors.slateLight,
    marginTop: 2,
  },
});
