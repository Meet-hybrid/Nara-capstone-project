import { View, Text, StyleSheet} from 'react-native';
import { colors, radius, spacing, fontSize } from '../../constants/theme';
import { StatusPill } from '../common/StatusPill';
import { TrackBar } from './TrackBar';

export function MemberCard({ name, initial, collectsMonth, status, monthsCompleted, totalMonths, isCurrentUser }) {
  return (
    <View style={[styles.card, isCurrentUser && styles.currentUser]}>
      <View style={styles.topRow}>
        <View style={[styles.avatar, isCurrentUser && styles.avatarCurrent]}>
          <Text style={[styles.initial, isCurrentUser && styles.initialCurrent]}>{initial}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{name} {isCurrentUser ? '(You)' : ''}</Text>
          <Text style={styles.collects}>Collects {collectsMonth}</Text>
        </View>
        <StatusPill type={status} />
      </View>
      <TrackBar months={totalMonths} completed={monthsCompleted} />
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
  currentUser: {
    borderWidth: 2,
    borderColor: colors.forest,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCurrent: {
    backgroundColor: colors.forest,
  },
  initial: {
    fontSize: fontSize.base,
    fontFamily: 'Inter_700Bold',
    color: colors.text,
  },
  initialCurrent: {
    color: colors.surface,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: fontSize.base,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text,
  },
  collects: {
    fontSize: fontSize.sm,
    fontFamily: 'Inter_400Regular',
    color: colors.slate,
  },
});
