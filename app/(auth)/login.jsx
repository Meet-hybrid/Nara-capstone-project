import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { spacing, fontSize } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import AuthBackground from '../../components/common/AuthBackground';
import { login as loginApi } from '../../services/authService';
import useAuthStore from '../../store/authStore';
import { saveToken } from '../../utils/storage';

export default function LoginScreen() {
  const router = useRouter();
  const { colors: c } = useTheme();
  const { login: setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError('');
    try {
      const result = await loginApi(email, password);
      await saveToken('access_token', result.access);
      await saveToken('refresh_token', result.refresh);
      setAuth({ access: result.access, refresh: result.refresh });
      router.replace('/(main)');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: c.canvas }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: c.text }]}>Welcome back</Text>
        <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry />
        {error && <Text style={[styles.error, { color: c.danger }]}>{error}</Text>}
        <Button title="Log in" onPress={handleLogin} loading={loading} disabled={!email || !password} />
        <Text style={[styles.forgotLink, { color: c.accent }]} onPress={() => router.push('/(auth)/forgot-password')}>
          Forgot password?
        </Text>
        <Text style={[styles.backLink, { color: c.textSecondary }]} onPress={() => router.back()}>
          Back to welcome
        </Text>
      </ScrollView>
      <AuthBackground />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.xl, paddingTop: 80, gap: spacing.lg },
  title: { fontSize: fontSize.xl, fontFamily: 'Inter_700Bold', marginBottom: spacing.sm },
  error: { fontSize: fontSize.sm, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  forgotLink: { fontSize: fontSize.base, fontFamily: 'Inter_500Medium', textAlign: 'center', textDecorationLine: 'underline' },
  backLink: { fontSize: fontSize.base, fontFamily: 'Inter_400Regular', textAlign: 'center' },
});
