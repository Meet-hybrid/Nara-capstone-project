import { View, Text, ScrollView, StyleSheet} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { spacing, fontSize } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import AuthBackground from '../../components/common/AuthBackground';
import { forgotPassword, resetPassword } from '../../services/authService';

export default function ForgotPasswordScreen() {
  console.log('Rendering ForgotPasswordScreen — two-step password reset');
  const router = useRouter();
  const { colors: c } = useTheme();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    if (!phone) return;
    setLoading(true);
    setError('');
    try {
      await forgotPassword(phone);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!otp || !newPassword) return;
    setLoading(true);
    setError('');
    try {
      await resetPassword(phone, otp, newPassword);
      router.replace('/(auth)/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: c.canvas }]}>
      <AuthBackground />
      <ScrollView contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: c.text }]}>
        {step === 1 ? 'Reset your password' : 'Enter code and new password'}
      </Text>

      {step === 1 && (
        <>
          <Input label="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          {error && <Text style={[styles.error, { color: c.danger }]}>{error}</Text>}
          <Button title="Send reset code" onPress={handleSendOtp} loading={loading} disabled={!phone} />
        </>
      )}

      {step === 2 && (
        <>
          <Input label="Reset code (OTP)" value={otp} onChangeText={setOtp} keyboardType="number-pad" />
          <Input label="New password" value={newPassword} onChangeText={setNewPassword} secureTextEntry />
          {error && <Text style={[styles.error, { color: c.danger }]}>{error}</Text>}
          <Button title="Reset password" onPress={handleReset} loading={loading} disabled={!otp || !newPassword} />
        </>
      )}

      <Text style={[styles.backLink, { color: c.slate }]} onPress={() => router.back()}>
        Back to login
      </Text>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    paddingTop: 80,
    gap: spacing.md,
  },
  title: {
    fontSize: fontSize.xl,
    fontFamily: 'Inter_700Bold',
    marginBottom: spacing.sm,
  },
  error: {
    fontSize: fontSize.sm,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  backLink: {
    fontSize: fontSize.base,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});