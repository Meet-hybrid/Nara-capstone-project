import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { spacing, fontSize, radius } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { getMyGroup, getGroupMembers } from '../../services/groupService';
import useGroupStore from '../../store/groupStore';
import useMemberStore from '../../store/memberStore';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { StatRow } from '../../components/home/StatRow';
import { MemberCard } from '../../components/circle/MemberCard';
import { formatNaira } from '../../utils/formatCurrency';

export default function CircleScreen() {
  const { colors: c, shadows: s } = useTheme();
  const { group, members, setGroup, setMembers } = useGroupStore();
  const member = useMemberStore((s) => s.member);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [g, m] = await Promise.all([getMyGroup(), getGroupMembers()]);
      setGroup(g.data || g);
      setMembers(m.data || m);
    } catch {
      setError('Could not load group details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return <View style={[styles.center, { backgroundColor: c.canvas }]}><ActivityIndicator size="large" color={c.accent} /></View>;
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: c.canvas }]}>
        <Text style={[styles.errorText, { color: c.textSecondary }]}>{error}</Text>
        <TouchableOpacity onPress={fetchData}><Text style={[styles.retryText, { color: c.accent }]}>Retry</Text></TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: c.canvas }]}>
      <ScreenHeader label="Your Circle" title={group?.name || 'Savings Circle'} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.metaRow, { backgroundColor: c.surface, borderColor: c.divider, ...s.md }]}>
          <View style={styles.metaItem}>
            <Text style={[styles.metaLabel, { color: c.textSecondary }]}>Goal</Text>
            <Text style={[styles.metaValue, { color: c.text }]}>{group?.goal_type || 'Land'}</Text>
          </View>
          <View style={[styles.metaDivider, { backgroundColor: c.divider }]} />
          <View style={styles.metaItem}>
            <Text style={[styles.metaLabel, { color: c.textSecondary }]}>Tier</Text>
            <Text style={[styles.metaValue, { color: c.text }]}>{formatNaira(group?.contribution_tier || 0)}</Text>
          </View>
          <View style={[styles.metaDivider, { backgroundColor: c.divider }]} />
          <View style={styles.metaItem}>
            <Text style={[styles.metaLabel, { color: c.textSecondary }]}>Members</Text>
            <Text style={[styles.metaValue, { color: c.text }]}>{group?.max_members || 0}</Text>
          </View>
        </View>

        <StatRow
          stats={[
            { value: formatNaira(group?.monthly_pot || 0), label: 'Monthly pot' },
            { value: `Month ${group?.current_cycle_month || 1}`, label: 'Current month' },
            { value: `${members.filter((m) => m.status === 'collected').length || 0}`, label: 'Collected' },
          ]}
        />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>Members</Text>
          {members.map((m) => (
            <MemberCard
              key={m.id}
              name={m.full_name}
              initial={m.full_name?.[0] || '?'}
              collectsMonth={m.collects_month || 'Unknown'}
              status={m.status || 'active'}
              monthsCompleted={m.months_completed || 0}
              totalMonths={group?.total_months || 6}
              isCurrentUser={m.id === member?.id}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  errorText: { fontSize: fontSize.base, fontFamily: 'Inter_400Regular' },
  retryText: { fontSize: fontSize.base, fontFamily: 'Inter_600SemiBold' },
  content: { paddingTop: spacing.sm, gap: spacing.md, paddingBottom: spacing.xl, paddingHorizontal: spacing.xl },
  metaRow: { flexDirection: 'row', borderRadius: radius.md, padding: spacing.md, borderWidth: 1 },
  metaItem: { flex: 1, alignItems: 'center', gap: 2 },
  metaDivider: { width: 1, height: 24, alignSelf: 'center' },
  metaLabel: { fontSize: fontSize.caption, fontFamily: 'Inter_400Regular', textTransform: 'uppercase', letterSpacing: 0.5 },
  metaValue: { fontSize: fontSize.base, fontFamily: 'Inter_600SemiBold' },
  section: { gap: spacing.sm },
  sectionTitle: { fontSize: fontSize.md, fontFamily: 'Inter_700Bold' },
});
