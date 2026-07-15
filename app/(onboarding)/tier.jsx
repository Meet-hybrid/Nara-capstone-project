import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { spacing, radius, fontSize } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/common/Button';
import { saveTier } from '../../services/onboardingService';
import { formatNaira } from '../../utils/formatCurrency';

const TIERS = [200000, 300000, 500000, 800000, 1000000];

export default function TierScreen() {
  const router = useRouter();
  const { colors: c, shadows: s } = useTheme();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      await saveTier(selected);
      router.push('/(onboarding)/match');
    } catch {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: c.accent }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>Choose your monthly tier</Text>
        <Text style={[styles.headerSub, { color: 'rgba(255,255,255,0.7)' }]}>How much can you save each month?</Text>
        <View style={[styles.progressBar, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
          <View style={[styles.progressFill, { width: '66%', backgroundColor: '#FFFFFF' }]} />
        </View>
        <Text style={[styles.step, { color: 'rgba(255,255,255,0.7)' }]}>Step 2 of 3</Text>
      </View>
      <ScrollView contentContainerStyle={[styles.list, { backgroundColor: c.canvas }]}>
        {TIERS.map((amt) => {
          const isSel = selected === amt;
          return (
            <TouchableOpacity
              key={amt}
              style={[styles.row, { backgroundColor: c.surface, borderColor: c.divider, ...s.sm }, isSel && { borderColor: c.accent, backgroundColor: c.accent }]}
              onPress={() => setSelected(amt)}
              activeOpacity={0.7}
            >
              <View style={[styles.radio, { borderColor: c.textDisabled }, isSel && { borderColor: '#FFFFFF', backgroundColor: '#FFFFFF' }]}>
                {isSel && <Text style={[styles.radioCheck, { color: c.accent }]}>{'\u2713'}</Text>}
              </View>
              <Text style={[styles.rowLabel, { color: c.text }, isSel && { color: '#FFFFFF' }]}>
                {formatNaira(amt)}/month
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={[styles.footer, { backgroundColor: c.canvas }]}>
        <Button title="Find my group" onPress={handleContinue} disabled={!selected} loading={loading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 60, paddingHorizontal: spacing.lg },
  headerTitle: { fontSize: fontSize.lg, fontFamily: 'Inter_700Bold' },
  headerSub: { fontSize: fontSize.base, fontFamily: 'Inter_400Regular', marginTop: spacing.xs },
  progressBar: { height: 6, borderRadius: 3, marginTop: spacing.md, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  step: { fontSize: fontSize.sm, fontFamily: 'Inter_500Medium', marginTop: spacing.xs },
  list: { padding: spacing.lg, gap: spacing.sm, borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: spacing.lg, flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.md, padding: spacing.md, gap: spacing.sm, borderWidth: 1.5 },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioCheck: { fontSize: fontSize.sm, fontFamily: 'Inter_700Bold' },
  rowLabel: { fontSize: fontSize.md, fontFamily: 'Inter_600SemiBold' },
  footer: { padding: spacing.lg, paddingBottom: 40 },
});
