import { View, Text, ScrollView, StyleSheet} from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { spacing, radius, fontSize } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/common/Button';
import { getGroupMatch, confirmGroupJoin } from '../../services/onboardingService';
import { formatNaira } from '../../utils/formatCurrency';
import { Label } from '../../components/common/Label';

export default function MatchScreen() {
  console.log('Rendering MatchScreen — showing matched group or waitlist');
  const router = useRouter();
  const { colors: c } = useTheme();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const result = await getGroupMatch();
        setMatch(result.data || result);
      } catch {
        setMatch({ waitlist: true, position: 3 });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await confirmGroupJoin();
      router.replace('/(main)');
    } catch {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: c.canvas }]}>
        <View style={styles.center}><Text style={[styles.loadingText, { color: c.slate }]}>Finding your group...</Text></View>
      </View>
    );
  }

  if (match?.waitlist) {
    return (
      <View style={[styles.container, { backgroundColor: c.canvas }]}>
        <View style={[styles.header, { backgroundColor: c.forest }]}>
          <Text style={[styles.headerTitle, { color: c.surface }]}>Your match</Text>
          <View style={[styles.progressBar, { backgroundColor: 'rgba(255,255,255,0.25)' }]}><View style={[styles.progressFill, { width: '100%', backgroundColor: c.parchment }]} /></View>
          <Text style={[styles.step, { color: 'rgba(255,255,255,0.7)' }]}>Step 3 of 3</Text>
        </View>
        <View style={styles.content}>
          <View style={[styles.waitlistCard, { backgroundColor: c.surface }]}>
            <Text style={styles.waitlistIcon}>{'\u23F3'}</Text>
            <Text style={[styles.waitlistTitle, { color: c.text }]}>Finding your group</Text>
            <Text style={[styles.waitlistDesc, { color: c.slate }]}>
              You are position {match.position} in the waitlist
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: c.canvas }]}>
      <View style={[styles.header, { backgroundColor: c.forest }]}>
        <Text style={[styles.headerTitle, { color: c.surface }]}>Your match</Text>
        <View style={[styles.progressBar, { backgroundColor: 'rgba(255,255,255,0.25)' }]}><View style={[styles.progressFill, { width: '100%', backgroundColor: c.parchment }]} /></View>
        <Text style={[styles.step, { color: 'rgba(255,255,255,0.7)' }]}>Step 3 of 3</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.matchCard, { backgroundColor: c.surface }]}>
          <Text style={[styles.groupName, { color: c.text }]}>{match.group_name}</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: c.text }]}>{formatNaira(match.monthly_pot)}</Text>
              <Text style={[styles.statLabel, { color: c.slateLight }]}>Monthly pot</Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: c.text }]}>{match.member_count}</Text>
              <Text style={[styles.statLabel, { color: c.slateLight }]}>Members</Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: c.text }]}>{match.pot_month}</Text>
              <Text style={[styles.statLabel, { color: c.slateLight }]}>Your pot month</Text>
            </View>
          </View>
          <Text style={[styles.cycleText, { color: c.slate }]}>Cycle length: {match.cycle_length} months</Text>
        </View>
        <View style={[styles.protectionBox, { backgroundColor: c.parchmentLight }]}>
          <Text style={[styles.protectionTitle, { color: c.text }]}>Protected</Text>
          <Text style={[styles.protectionDesc, { color: c.slate }]}>
            Your contributions are insured up to {formatNaira(match.monthly_pot)} by AXA Mansard
          </Text>
        </View>
        <Button title="Confirm and join" onPress={handleConfirm} loading={confirming} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: fontSize.md, fontFamily: 'Inter_500Medium' },
  header: { paddingTop: 60, paddingHorizontal: spacing.lg },
  headerTitle: { fontSize: fontSize.lg, fontFamily: 'Inter_700Bold' },
  progressBar: { height: 6, borderRadius: 3, marginTop: spacing.md, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  step: { fontSize: fontSize.sm, fontFamily: 'Inter_500Medium', marginTop: spacing.xs },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: 48 },
  matchCard: { borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md },
  groupName: { fontSize: fontSize.lg, fontFamily: 'Inter_700Bold', textAlign: 'center' },
  statsRow: { flexDirection: 'row' },
  stat: { flex: 1, alignItems: 'center', gap: spacing.xs },
  statValue: { fontSize: fontSize.md, fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: fontSize.xs, fontFamily: 'Inter_400Regular', textTransform: 'uppercase' },
  cycleText: { fontSize: fontSize.sm, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  protectionBox: { flexDirection: 'row', borderRadius: radius.lg, padding: spacing.md, gap: spacing.sm, alignItems: 'center' },
  protectionTitle: { fontSize: fontSize.base, fontFamily: 'Inter_700Bold' },
  protectionDesc: { fontSize: fontSize.sm, fontFamily: 'Inter_400Regular', flex: 1 },
  waitlistCard: { borderRadius: radius.lg, padding: spacing.xl, alignItems: 'center', gap: spacing.sm },
  waitlistIcon: { fontSize: 48 },
  waitlistTitle: { fontSize: fontSize.lg, fontFamily: 'Inter_700Bold' },
  waitlistDesc: { fontSize: fontSize.base, fontFamily: 'Inter_400Regular', textAlign: 'center' },
});