import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { spacing, fontSize, radius } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { getContributions, downloadStatement } from '../../services/contributionService';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { CircleRing } from '../../components/common/CircleRing';
import { StandingOrderCard } from '../../components/history/StandingOrderCard';
import { ContributionRow } from '../../components/history/ContributionRow';
import { formatNaira } from '../../utils/formatCurrency';

export default function HistoryScreen() {
  const { colors: c, shadows: s } = useTheme();
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContributions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getContributions();
      setContributions(data.data || data);
    } catch {
      setError('Could not load contribution history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContributions(); }, []);

  const totalContributed = contributions
    .filter((c) => !c.is_pot)
    .reduce((s, c) => s + (c.amount || 0), 0);

  const processedCount = contributions.filter((c) => c.status === 'PROCESSED').length;

  if (loading) {
    return <View style={[styles.center, { backgroundColor: c.canvas }]}><ActivityIndicator size="large" color={c.accent} /></View>;
  }

  return (
    <View style={[styles.container, { backgroundColor: c.canvas }]}>
      <ScreenHeader label="History" title="Contributions" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.summaryCard, { backgroundColor: c.surface, borderColor: c.divider, ...s.md }]}>
          <CircleRing progress={processedCount / Math.max(contributions.length, 1)} />
          <View>
            <Text style={[styles.summaryLabel, { color: c.textSecondary }]}>Total contributed</Text>
            <Text style={[styles.summaryAmount, { color: c.accent }]}>{formatNaira(totalContributed)}</Text>
          </View>
        </View>

        <StandingOrderCard amount={300000} day="3rd" bank="GTBank" status="ACTIVE" />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>Monthly log</Text>
          {contributions.map((c, i) => (
            <ContributionRow
              key={i}
              month={c.month || c.month_year}
              date={c.deduction_date || ''}
              reference={c.transaction_ref}
              amount={c.amount || 0}
              status={c.status?.toLowerCase() || 'pending'}
              isPot={c.is_pot || false}
            />
          ))}
        </View>

        {error && <Text style={[styles.errorText, { color: c.danger }]}>{error}</Text>}

        <TouchableOpacity style={[styles.downloadBtn, { borderColor: c.accent }]} onPress={downloadStatement}>
          <Text style={[styles.downloadText, { color: c.accent }]}>Download statement</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { paddingTop: spacing.sm, gap: spacing.md, paddingBottom: spacing.xl, paddingHorizontal: spacing.xl },
  summaryCard: { flexDirection: 'row', borderRadius: radius.md, padding: spacing.lg, gap: spacing.md, alignItems: 'center', borderWidth: 1 },
  summaryLabel: { fontSize: fontSize.sm, fontFamily: 'Inter_400Regular', letterSpacing: 0.3, textTransform: 'uppercase' },
  summaryAmount: { fontSize: fontSize.lg, fontFamily: 'Inter_700Bold', marginTop: 2, fontVariant: ['tabular-nums'] },
  section: { gap: spacing.sm },
  sectionTitle: { fontSize: fontSize.md, fontFamily: 'Inter_700Bold' },
  errorText: { fontSize: fontSize.sm, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  downloadBtn: { padding: spacing.md, alignItems: 'center', borderWidth: 1.5, borderRadius: radius.md },
  downloadText: { fontSize: fontSize.base, fontFamily: 'Inter_700Bold' },
});
