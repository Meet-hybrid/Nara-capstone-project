import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { spacing, radius, fontSize } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/common/Button';
import { FadeInView } from '../../components/common/FadeInView';
import { SuccessAnimation } from '../../components/common/SuccessAnimation';
import { getGroupMatch, confirmGroupJoin } from '../../services/onboardingService';
import { formatNaira } from '../../utils/formatCurrency';

export default function MatchScreen() {
  const router = useRouter();
  const { colors: c, shadows: s } = useTheme();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
      await confirmGroupJoin(match.group_id);
      setShowSuccess(true);
    } catch {
      setConfirming(false);
    }
  };

  const handleSuccessDone = () => {
    router.replace('/(main)');
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: c.canvas }]}>
        <View style={styles.center}><Text style={[styles.loadingText, { color: c.textSecondary }]}>Finding your group...</Text></View>
      </View>
    );
  }

  if (match?.waitlist) {
    return (
      <View style={[styles.container, { backgroundColor: c.canvas }]}>
        <View style={[styles.header, { backgroundColor: c.accent }]}>
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>Your match</Text>
          <View style={[styles.progressBar, { backgroundColor: 'rgba(255,255,255,0.25)' }]}><View style={[styles.progressFill, { width: '100%', backgroundColor: '#FFFFFF' }]} /></View>
          <Text style={[styles.step, { color: 'rgba(255,255,255,0.7)' }]}>Step 3 of 3</Text>
        </View>
        <View style={styles.content}>
          <View style={[styles.waitlistCard, { backgroundColor: c.surface, borderColor: c.divider, ...s.md }]}>
            <Text style={styles.waitlistIcon}>{'\u23F3'}</Text>
            <Text style={[styles.waitlistTitle, { color: c.text }]}>Finding your group</Text>
            <Text style={[styles.waitlistDesc, { color: c.textSecondary }]}>
              You are position {match.position} in the waitlist
            </Text>
          </View>
          <Button title="Go to dashboard" onPress={() => router.replace('/(main)')} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: c.canvas }]}>
      <SuccessAnimation visible={showSuccess} onFinish={handleSuccessDone} />
      <View style={[styles.header, { backgroundColor: c.accent }]}>
        <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>Your match</Text>
        <View style={[styles.progressBar, { backgroundColor: 'rgba(255,255,255,0.25)' }]}><View style={[styles.progressFill, { width: '100%', backgroundColor: '#FFFFFF' }]} /></View>
        <Text style={[styles.step, { color: 'rgba(255,255,255,0.7)' }]}>Step 3 of 3</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <FadeInView>
          <View style={[styles.matchCard, { backgroundColor: c.surface, borderColor: c.divider, ...s.md }]}>
            <Text style={[styles.groupName, { color: c.text }]}>{match.group_name}</Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={[styles.statValue, { color: c.text }]}>{formatNaira(match.monthly_pot)}</Text>
                <Text style={[styles.statLabel, { color: c.textSecondary }]}>Monthly pot</Text>
              </View>
              <View style={styles.stat}>
                <Text style={[styles.statValue, { color: c.text }]}>{match.member_count}</Text>
                <Text style={[styles.statLabel, { color: c.textSecondary }]}>Members</Text>
              </View>
              <View style={styles.stat}>
                <Text style={[styles.statValue, { color: c.text }]}>{match.pot_month}</Text>
                <Text style={[styles.statLabel, { color: c.textSecondary }]}>Your pot month</Text>
              </View>
            </View>
            <Text style={[styles.cycleText, { color: c.textSecondary }]}>Cycle length: {match.cycle_length} months</Text>
          </View>
        </FadeInView>

        <FadeInView delay={150}>
          <View style={[styles.protectionBox, { backgroundColor: c.accentLight, borderColor: c.accent + '30', ...s.sm }]}>
            <Text style={[styles.protectionTitle, { color: c.accent }]}>Protected</Text>
            <Text style={[styles.protectionDesc, { color: c.textSecondary }]}>
              Your contributions are insured up to {formatNaira(match.monthly_pot)} by AXA Mansard
            </Text>
          </View>
        </FadeInView>

        <FadeInView delay={250}>
          <Button title="Confirm and join" onPress={handleConfirm} loading={confirming} />
        </FadeInView>
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
  matchCard: { borderRadius: radius.md, padding: spacing.lg, gap: spacing.md, borderWidth: 1 },
  groupName: { fontSize: fontSize.lg, fontFamily: 'Inter_700Bold', textAlign: 'center' },
  statsRow: { flexDirection: 'row' },
  stat: { flex: 1, alignItems: 'center', gap: spacing.xs },
  statValue: { fontSize: fontSize.md, fontFamily: 'Inter_700Bold', fontVariant: ['tabular-nums'] },
  statLabel: { fontSize: fontSize.caption, fontFamily: 'Inter_400Regular', textTransform: 'uppercase', letterSpacing: 0.3 },
  cycleText: { fontSize: fontSize.sm, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  protectionBox: { flexDirection: 'row', borderRadius: radius.md, padding: spacing.md, gap: spacing.sm, alignItems: 'center', borderWidth: 1 },
  protectionTitle: { fontSize: fontSize.base, fontFamily: 'Inter_700Bold' },
  protectionDesc: { fontSize: fontSize.sm, fontFamily: 'Inter_400Regular', flex: 1 },
  waitlistCard: { borderRadius: radius.md, padding: spacing.xl, alignItems: 'center', gap: spacing.sm, borderWidth: 1 },
  waitlistIcon: { fontSize: 48 },
  waitlistTitle: { fontSize: fontSize.lg, fontFamily: 'Inter_700Bold' },
  waitlistDesc: { fontSize: fontSize.base, fontFamily: 'Inter_400Regular', textAlign: 'center' },
});
