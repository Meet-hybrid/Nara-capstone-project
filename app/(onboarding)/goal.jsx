import { View, Text, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing, radius, fontSize } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/common/Button';
import { saveGoal } from '../../services/onboardingService';

const GOALS = [
  { key: 'LAND', label: 'Land', icon: 'earth' },
  { key: 'CAR', label: 'Car', icon: 'car' },
  { key: 'HOUSE', label: 'House', icon: 'home' },
  { key: 'BUSINESS', label: 'Business Capital', icon: 'briefcase' },
  { key: 'SCHOOL_FEES', label: 'School Fees', icon: 'book-open-variant' },
  { key: 'FLEXIBLE', label: 'Flexible', icon: 'tune-vertical' },
];

export default function GoalScreen() {
  console.log('Rendering GoalScreen — member picks a savings goal');
  const router = useRouter();
  const { colors: c } = useTheme();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    setError('');
    try {
      await saveGoal(selected);
      router.push('/(onboarding)/tier');
    } catch (err) {
      const message = err.message || 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: c.forest }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: c.surface }]}>What is your savings goal?</Text>
        <View style={[styles.progressBar, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
          <View style={[styles.progressFill, { width: '33%', backgroundColor: c.parchment }]} />
        </View>
        <Text style={[styles.step, { color: 'rgba(255,255,255,0.7)' }]}>Step 1 of 3</Text>
      </View>
      <ScrollView contentContainerStyle={[styles.grid, { backgroundColor: c.canvas }]}>
        {GOALS.map((g) => {
          const isSel = selected === g.key;
          return (
            <TouchableOpacity
              key={g.key}
              style={[styles.card, { backgroundColor: c.surface, borderColor: 'transparent' }, isSel && { borderColor: c.forest, backgroundColor: c.successLight }]}
              onPress={() => setSelected(g.key)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name={g.icon} size={32} color={c.forest} />
              <Text style={[styles.cardLabel, { color: c.text }, isSel && { color: c.forest }]}>{g.label}</Text>
              {isSel && <Text style={[styles.check, { color: c.parchment }]}>{'\u2713'}</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={[styles.footer, { backgroundColor: c.canvas }]}>
        {error ? <Text style={[styles.error, { color: c.danger }]}>{error}</Text> : null}
        <Button title="Continue" onPress={handleContinue} disabled={!selected} loading={loading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 60, paddingHorizontal: spacing.lg },
  headerTitle: { fontSize: fontSize.lg, fontFamily: 'Inter_700Bold' },
  progressBar: { height: 6, borderRadius: 3, marginTop: spacing.md, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  step: { fontSize: fontSize.sm, fontFamily: 'Inter_500Medium', marginTop: spacing.xs },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: spacing.lg, gap: spacing.sm, borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: spacing.lg, flex: 1 },
  card: { width: '47%', borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center', gap: spacing.sm, borderWidth: 2 },
  cardLabel: { fontSize: fontSize.base, fontFamily: 'Inter_600SemiBold', textAlign: 'center' },
  check: { position: 'absolute', top: spacing.sm, right: spacing.sm, fontSize: fontSize.md, fontFamily: 'Inter_700Bold' },
  footer: { padding: spacing.lg, paddingBottom: spacing.xl },
  error: { fontSize: fontSize.sm, fontFamily: 'Inter_400Regular', textAlign: 'center', marginBottom: spacing.sm },
});