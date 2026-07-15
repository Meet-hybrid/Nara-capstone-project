import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
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
import { FadeInView } from '../../components/common/FadeInView';
import { ShimmerLoader, SkeletonCard } from '../../components/common/ShimmerLoader';
import { formatNaira } from '../../utils/formatCurrency';

export default function OverviewScreen() {
  const { dashboard, setDashboard } = useMemberStore();
  const { colors: c, shadows: s } = useTheme();
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
      <View style={[styles.container, { backgroundColor: c.canvas }]}>
        <View style={{ paddingTop: 56, paddingHorizontal: spacing.xl, gap: 4 }}>
          <ShimmerLoader width={80} height={13} color={c.divider} />
          <ShimmerLoader width={140} height={22} color={c.divider} />
        </View>
        <View style={{ padding: spacing.xl, gap: spacing.lg }}>
          <SkeletonCard lines={3} cardColor={c.surface} boneColor={c.divider} />
          <SkeletonCard lines={2} cardColor={c.surface} boneColor={c.divider} />
          <SkeletonCard lines={4} cardColor={c.surface} boneColor={c.divider} />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <FadeInView style={[styles.center, { backgroundColor: c.canvas }]}>
        <Text style={[styles.errorText, { color: c.textSecondary }]}>{error}</Text>
        <TouchableOpacity onPress={fetchDashboard} style={styles.retryBtn}>
          <Text style={[styles.retryText, { color: c.accent }]}>Retry</Text>
        </TouchableOpacity>
      </FadeInView>
    );
  }

  const progress = (dashboard?.current_month || 1) / (dashboard?.total_months || 6);

  return (
    <ScrollView style={[styles.container, { backgroundColor: c.canvas }]} contentContainerStyle={styles.content}>
      <FadeInView>
        <View style={styles.greetingRow}>
          <View>
            <Text style={[styles.greetingLabel, { color: c.textSecondary }]}>Good morning</Text>
            <Text style={[styles.greetingName, { color: c.text }]}>{dashboard?.first_name || 'Member'}</Text>
          </View>
          <View style={[styles.avatar, { backgroundColor: c.accent + '15' }]}>
            <Text style={[styles.avatarText, { color: c.accent }]}>{dashboard?.first_name?.[0] || 'M'}</Text>
          </View>
        </View>
      </FadeInView>

      <FadeInView delay={100}>
        <View style={[styles.balanceCard, { backgroundColor: c.surface, borderColor: c.divider, ...s.lg }]}>
          <View style={styles.balanceTop}>
            <CircleRing progress={progress} size={72} strokeWidth={5} />
            <View style={styles.balanceInfo}>
              <Text style={[styles.balanceLabel, { color: c.textSecondary }]}>Your Circle</Text>
              <Text style={[styles.balanceName, { color: c.text }]}>{dashboard?.group_name || 'Savings Circle'}</Text>
              <Text style={[styles.balanceMeta, { color: c.textSecondary }]}>
                Pot: {dashboard?.pot_month || '---'} · {dashboard?.total_months - dashboard?.current_month || 0} months left
              </Text>
            </View>
          </View>
          <View style={[styles.balanceDivider, { backgroundColor: c.divider }]} />
          <View style={styles.balanceAmount}>
            <Text style={[styles.balanceLabel, { color: c.textSecondary }]}>Total contributed</Text>
            <Text style={[styles.balanceNumber, { color: c.text }]}>{formatNaira(dashboard?.total_contributed || 0)}</Text>
          </View>
        </View>
      </FadeInView>

      <FadeInView delay={200}>
        <View style={styles.gridRow}>
          <View style={[styles.gridCard, { backgroundColor: c.surface, borderColor: c.divider, ...s.md }]}>
            <Text style={[styles.gridLabel, { color: c.textSecondary }]}>Monthly pot</Text>
            <Text style={[styles.gridValue, { color: c.text }]}>{formatNaira(dashboard?.monthly_pot || 0)}</Text>
          </View>
          <View style={[styles.gridCard, { backgroundColor: c.surface, borderColor: c.divider, ...s.md }]}>
            <Text style={[styles.gridLabel, { color: c.textSecondary }]}>Members</Text>
            <Text style={[styles.gridValue, { color: c.text }]}>{dashboard?.member_count || 0}</Text>
          </View>
        </View>
      </FadeInView>

      <FadeInView delay={300}>
        <DeductionCard
          amount={dashboard?.next_deduction?.amount || 300000}
          date={dashboard?.next_deduction?.date || '3 April 2026'}
          bank={dashboard?.next_deduction?.bank || 'GTBank'}
          status={dashboard?.next_deduction?.status || 'scheduled'}
        />
      </FadeInView>

      <FadeInView delay={400}>
        <ActivityFeed activities={dashboard?.recent_activities || []} />
      </FadeInView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: spacing.xxxl + 16, paddingHorizontal: spacing.xl, gap: spacing.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  errorText: { fontSize: fontSize.base, fontFamily: 'Inter_400Regular' },
  retryBtn: { padding: spacing.sm },
  retryText: { fontSize: fontSize.base, fontFamily: 'Inter_600SemiBold' },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 56,
  },
  greetingLabel: { fontSize: fontSize.sm, fontFamily: 'Inter_400Regular', letterSpacing: 0.3, textTransform: 'uppercase' },
  greetingName: { fontSize: fontSize.xl, fontFamily: 'Inter_700Bold', marginTop: 2 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: fontSize.lg, fontFamily: 'Inter_700Bold' },
  balanceCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  balanceTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  balanceInfo: { flex: 1, gap: 2 },
  balanceLabel: { fontSize: fontSize.sm, fontFamily: 'Inter_400Regular', letterSpacing: 0.3, textTransform: 'uppercase' },
  balanceName: { fontSize: fontSize.md, fontFamily: 'Inter_700Bold' },
  balanceMeta: { fontSize: fontSize.sm, fontFamily: 'Inter_400Regular', marginTop: 2 },
  balanceDivider: { height: 1 },
  balanceAmount: { gap: spacing.xs },
  balanceNumber: { fontSize: fontSize.xxl, fontFamily: 'Inter_700Bold', letterSpacing: -0.5, fontVariant: ['tabular-nums'] },
  gridRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  gridCard: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  gridLabel: {
    fontSize: fontSize.caption,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  gridValue: {
    fontSize: fontSize.lg,
    fontFamily: 'Inter_700Bold',
    fontVariant: ['tabular-nums'],
  },
});
