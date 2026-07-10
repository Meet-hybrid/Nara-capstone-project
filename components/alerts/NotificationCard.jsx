import { View, Text, StyleSheet} from 'react-native';
import { colors, radius, spacing, fontSize } from '../../constants/theme';
import { formatRelativeTime } from '../../utils/formatDate';

export function NotificationCard({ title, body, createdAt, isRead }) {
  return (
    <View style={[styles.card, !isRead && styles.unread]}>
      <View style={styles.topRow}>
        <Text style={styles.title}>{title}</Text>
        {!isRead && <View style={styles.dot} />}
      </View>
      <Text style={styles.body}>{body}</Text>
      <Text style={styles.time}>{formatRelativeTime(createdAt)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  unread: {
    borderWidth: 1,
    borderColor: colors.forest,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.base,
    fontFamily: 'Inter_700Bold',
    color: colors.text,
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.parchment,
  },
  body: {
    fontSize: fontSize.sm,
    fontFamily: 'Inter_400Regular',
    color: colors.slate,
    lineHeight: 20,
  },
  time: {
    fontSize: fontSize.xs,
    fontFamily: 'Inter_400Regular',
    color: colors.slateLight,
  },
});
