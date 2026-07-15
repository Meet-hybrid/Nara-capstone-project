import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { spacing, fontSize, radius } from '../../constants/theme';
import { getMyProfile } from '../../services/memberService';
import useMemberStore from '../../store/memberStore';
import useAuthStore from '../../store/authStore';
import { useTheme } from '../../hooks/useTheme';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Button } from '../../components/common/Button';
import { clearAllTokens } from '../../utils/storage';
import { useEffect } from 'react';

export default function AccountScreen() {
  const router = useRouter();
  const { isDark, toggleTheme, colors: c, shadows: s } = useTheme();
  const { member, setMember } = useMemberStore();
  const { logout } = useAuthStore();

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyProfile();
        setMember(data.data || data);
      } catch {
        // silent
      }
    })();
  }, []);

  const handleSignOut = async () => {
    await clearAllTokens();
    logout();
    router.replace('/(auth)/welcome');
  };

  const details = [
    { label: 'Email', value: member?.email || 'Not set' },
    { label: 'Phone', value: member?.phone || 'Not set' },
    { label: 'Bank', value: member?.bank || 'Not set' },
    { label: 'Account number', value: member?.account_number || 'Not set' },
    { label: 'BVN', value: member?.bvn || 'Not set' },
    { label: 'NIN', value: member?.nin || 'Not set' },
    { label: 'Standing order', value: member?.standing_order_info || `${member?.contribution_tier ? '\u20A6' + Number(member.contribution_tier).toLocaleString() + '/month' : 'Not set'}` },
    { label: 'Savings goal', value: member?.savings_goal || 'Not set' },
    { label: 'Contribution tier', value: member?.contribution_tier ? '\u20A6' + Number(member.contribution_tier).toLocaleString() + '/month' : 'Not set' },
    { label: 'Protection status', value: member?.insurance_status || 'Active' },
    { label: 'Circle', value: member?.group_name || 'Not joined' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: c.canvas }]}>
      <ScreenHeader label="Account" title="Profile" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.profileCard, { backgroundColor: c.surface, borderColor: c.divider, ...s.md }]}>
          <View style={[styles.avatar, { backgroundColor: c.accent }]}>
            <Text style={[styles.avatarText, { color: '#FFFFFF' }]}>{member?.full_name?.[0] || 'M'}</Text>
          </View>
          <Text style={[styles.name, { color: c.text }]}>{member?.full_name || 'Member'}</Text>
          <Text style={[styles.joinDate, { color: c.textSecondary }]}>Member since {member?.joined_at ? new Date(member.joined_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : 'January 2026'}</Text>
        </View>

        <View style={[styles.themeRow, { backgroundColor: c.surface, borderColor: c.divider, ...s.md }]}>
          <Text style={[styles.themeLabel, { color: c.text }]}>Dark mode</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: c.divider, true: c.accent + '60' }}
            thumbColor={isDark ? c.accent : c.textDisabled}
          />
        </View>

        <View style={[styles.detailsCard, { backgroundColor: c.surface, borderColor: c.divider, ...s.md }]}>
          {details.map((d, i) => (
            <View key={i} style={[styles.detailRow, i < details.length - 1 && { borderBottomWidth: 1, borderBottomColor: c.divider }]}>
              <Text style={[styles.detailLabel, { color: c.textSecondary }]}>{d.label}</Text>
              <Text style={[styles.detailValue, { color: c.text }]}>{d.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Button title="Declare an emergency" variant="danger" />
          <TouchableOpacity style={[styles.signOutBtn, { borderColor: c.danger }]} onPress={handleSignOut} activeOpacity={0.7}>
            <Text style={[styles.signOutText, { color: c.danger }]}>Sign out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: spacing.sm, gap: spacing.md, paddingBottom: spacing.xl, paddingHorizontal: spacing.xl },
  profileCard: { alignItems: 'center', borderRadius: radius.md, padding: spacing.xl, gap: spacing.sm, borderWidth: 1 },
  avatar: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: fontSize.xl, fontFamily: 'Inter_700Bold' },
  name: { fontSize: fontSize.lg, fontFamily: 'Inter_700Bold' },
  joinDate: { fontSize: fontSize.sm, fontFamily: 'Inter_400Regular' },
  themeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: radius.md, padding: spacing.md, paddingHorizontal: spacing.lg, borderWidth: 1 },
  themeLabel: { fontSize: fontSize.md, fontFamily: 'Inter_600SemiBold' },
  detailsCard: { borderRadius: radius.md, overflow: 'hidden', borderWidth: 1 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', padding: spacing.md, paddingHorizontal: spacing.lg },
  detailLabel: { fontSize: fontSize.sm, fontFamily: 'Inter_400Regular', flex: 1 },
  detailValue: { fontSize: fontSize.base, fontFamily: 'Inter_600SemiBold', flex: 1.5, textAlign: 'right' },
  actions: { gap: spacing.sm },
  signOutBtn: { padding: spacing.md, alignItems: 'center', borderRadius: radius.md, borderWidth: 1.5 },
  signOutText: { fontSize: fontSize.base, fontFamily: 'Inter_700Bold' },
});
