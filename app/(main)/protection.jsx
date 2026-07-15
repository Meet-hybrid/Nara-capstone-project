import { View, Text, ScrollView, Modal, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { spacing, fontSize, radius } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { getMyCover, fileClaim } from '../../services/insuranceService';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { StatusPill } from '../../components/common/StatusPill';
import { CoverageCard } from '../../components/protection/CoverageCard';
import { ScenarioCard } from '../../components/protection/ScenarioCard';
import { Button } from '../../components/common/Button';

const scenarios = [
  { title: 'Death', description: 'If a member passes away, the full pot amount is paid to their nominated beneficiary and the circle is dissolved with all contributions returned.' },
  { title: 'Job Loss', description: 'If a member loses their job, insurance covers up to 3 months of contributions, giving them time to find new employment without defaulting.' },
  { title: 'Default', description: 'If a member defaults, insurance covers the missed contribution to keep the circle on schedule. The defaulting member repays the insurer.' },
];

export default function ProtectionScreen() {
  const { colors: c, shadows: s } = useTheme();
  const [cover, setCover] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [claimReason, setClaimReason] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyCover();
        setCover(data.data || data);
      } catch {
        setCover(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleClaim = async () => {
    if (!claimReason) return;
    setSubmitting(true);
    try {
      await fileClaim(claimReason);
      setModalVisible(false);
      setClaimReason(null);
    } catch {
      // handled by interceptor
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <View style={[styles.center, { backgroundColor: c.canvas }]}><ActivityIndicator size="large" color={c.accent} /></View>;
  }

  return (
    <View style={[styles.container, { backgroundColor: c.canvas }]}>
      <ScreenHeader label="Shield" title="Protection" />
      <ScrollView contentContainerStyle={styles.content}>
        <CoverageCard
          premium={cover?.premium_amount || 15000}
          coverageAmount={cover?.coverage_amount || 1800000}
          provider={cover?.provider || 'AXA Mansard'}
          status={cover?.status || 'ACTIVE'}
        />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: c.text }]}>What is covered</Text>
          {scenarios.map((s, i) => (
            <ScenarioCard key={i} title={s.title} description={s.description} />
          ))}
        </View>

        <View style={styles.actions}>
          <Button
            title="Declare an emergency"
            variant="danger"
            onPress={() => setModalVisible(true)}
          />
        </View>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { backgroundColor: c.surface, borderColor: c.divider, ...s.lg }]}>
            <Text style={[styles.modalTitle, { color: c.text }]}>Declare an emergency</Text>
            <Text style={[styles.modalDesc, { color: c.textSecondary }]}>Select the reason for your claim:</Text>

            <TouchableOpacity
              style={[styles.option, { borderColor: c.divider }, claimReason === 'JOB_LOSS' && { borderColor: c.danger, backgroundColor: c.dangerLight }]}
              onPress={() => setClaimReason('JOB_LOSS')}
            >
              <Text style={[styles.optionText, { color: c.text }]}>Job Loss</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.option, { borderColor: c.divider }, claimReason === 'DEATH' && { borderColor: c.danger, backgroundColor: c.dangerLight }]}
              onPress={() => setClaimReason('DEATH')}
            >
              <Text style={[styles.optionText, { color: c.text }]}>Death</Text>
            </TouchableOpacity>

            <View style={styles.modalActions}>
              <Button title="Confirm" onPress={handleClaim} loading={submitting} disabled={!claimReason} />
              <Button title="Cancel" variant="outline" onPress={() => { setModalVisible(false); setClaimReason(null); }} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { paddingTop: spacing.sm, gap: spacing.md, paddingBottom: spacing.xl, paddingHorizontal: spacing.xl },
  section: { gap: spacing.sm },
  sectionTitle: { fontSize: fontSize.md, fontFamily: 'Inter_700Bold' },
  actions: { marginTop: spacing.sm },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: spacing.xl },
  modal: { borderRadius: radius.md, padding: spacing.xl, gap: spacing.md, borderWidth: 1 },
  modalTitle: { fontSize: fontSize.lg, fontFamily: 'Inter_700Bold' },
  modalDesc: { fontSize: fontSize.base, fontFamily: 'Inter_400Regular' },
  option: { padding: spacing.md, borderRadius: radius.md, borderWidth: 1.5 },
  optionText: { fontSize: fontSize.base, fontFamily: 'Inter_600SemiBold' },
  modalActions: { gap: spacing.sm, marginTop: spacing.sm },
});
