import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet} from 'react-native';
import { useState, useEffect } from 'react';
import { spacing, fontSize, radius } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { getDashboard } from '../../services/memberService';
import useMemberStore from '../../store/memberStore';
import { CircleRing } from '../../components/common/CircleRing';
import { StatusPill } from '../../components/common/StatusPill';
import { DeductionCard } from '../../components/home/DeductionCard';
import { StatRow } from '../../components/home/StatRow';
import { ActivityFeed } from '../../components/home/ActivityFeed';
import { formatNaira } from '../../utils/formatCurrency';

export default function OverviewScreen() {
  console.log('Rendering OverviewScreen — member dashboard');
  const { dashboard, setDashboard } = useMemberStore();
  const { colors: c } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboard();
      setDashboard(data.data || data);
    } catch {
      setError('Could not load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: c.canvas }]}>
        <ActivityIndicator size="large" color={c.forest} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: c.canvas }]}>
        <Text style={[styles.errorText, { color: c.slate }]}>{error}</Text>
        <TouchableOpacity onPress={fetchDashboard} style={styles.retryBtn}>
          <Text style={[styles.retryText, { color: c.forest }]}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: c.canvas }]} contentContainerStyle={styles.content}>
      <View style={[styles.greetingBanner, { backgroundColor: c.forest }]}>
        <View style={styles.avatar}><Text style={[styles.avatarText, { color: c.surface }]}>{dashboard?.first_name?.[0] || 'M'}</Text></View>
        <View>
          <Text style={styles.greetingLabel}>Good morning</Text>
          <Text style={[styles.greetingName, { color: c.surface }]}>{dashboard?.first_name || 'Member'}</Text>
        </View>
      </View>

      <View style={styles.ringRow}>
        <CircleRing progress={(dashboard?.current_month || 1) / (dashboard?.total_months || 6)} />
        <View>
          <Text style={[styles.groupName, { color: c.text }]}>{dashboard?.group_name || 'Your Circle'}</Text>
          <Text style={[styles.potMonth, { color: c.slate }]}>
            Pot month: {dashboard?.pot_month || 'June 2026'} ({dashboard?.total_months - dashboard?.current_month || 0} months left)
          </Text>
        </View>
      </View>

      <DeductionCard
        amount={dashboard?.next_deduction?.amount || 300000}
        date={dashboard?.next_deduction?.date || '3 April 2026'}
        bank={dashboard?.next_deduction?.bank || 'GTBank'}
        status={dashboard?.next_deduction?.status || 'scheduled'}
      />

      <StatRow
        stats={[
          { value: formatNaira(dashboard?.total_contributed || 0), label: 'Contributed' },
          { value: formatNaira(dashboard?.monthly_pot || 0), label: 'Monthly pot' },
          { value: `${dashboard?.member_count || 0}`, label: 'Members' },
        ]}
      />

      <ActivityFeed activities={dashboard?.recent_activities || []} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: spacing.xl, gap: spacing.md },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  errorText: { fontSize: fontSize.base, fontFamily: 'Inter_400Regular' },
  retryBtn: { padding: spacing.sm },
  retryText: { fontSize: fontSize.base, fontFamily: 'Inter_600SemiBold' },
  greetingBanner: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
    paddingTop: 56, paddingBottom: spacing.lg, paddingHorizontal: spacing.lg,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: fontSize.lg, fontFamily: 'Inter_700Bold' },
  greetingLabel: { color: 'rgba(255,255,255,0.7)', fontSize: fontSize.sm, fontFamily: 'Inter_400Regular' },
  greetingName: { fontSize: fontSize.lg, fontFamily: 'Inter_700Bold' },
  ringRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  groupName: { fontSize: fontSize.md, fontFamily: 'Inter_700Bold' },
  potMonth: { fontSize: fontSize.sm, fontFamily: 'Inter_400Regular', marginTop: 2 },
});