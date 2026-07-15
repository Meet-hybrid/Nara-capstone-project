import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { spacing, fontSize, radius } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/common/Button';
import AuthBackground from '../../components/common/AuthBackground';
import useAuthStore from '../../store/authStore';

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams();
  const { colors: c } = useTheme();
  const { setVerified } = useAuthStore();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const inputs = useRef([]);

  useEffect(() => {
    setLoading(true);
    setVerified();
    router.replace('/(onboarding)/goal');
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleDigitChange = (text, index) => {
    const newDigits = [...digits];
    newDigits[index] = text.replace(/[^0-9]/g, '').slice(0, 1);
    setDigits(newDigits);
    setError('');

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    const otp = newDigits.join('');
    if (otp.length === 6) {
      handleVerify(otp);
    }
  };

  const handleVerify = async (otp) => {
    setLoading(true);
    try {
      setVerified();
      router.replace('/(onboarding)/goal');
    } catch (err) {
      setError('Invalid OTP. Please try again.');
      setDigits(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: c.canvas }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: c.text }]}>Enter verification code</Text>
        <Text style={[styles.subtitle, { color: c.textSecondary }]}>A 6-digit code was sent to {phone}</Text>
        <View style={styles.digitRow}>
          {digits.map((d, i) => (
            <TextInput
              key={i}
              ref={(ref) => (inputs.current[i] = ref)}
              style={[styles.digitBox, { borderColor: c.divider, backgroundColor: c.surface, color: c.text }]}
              keyboardType="number-pad"
              maxLength={1}
              value={d}
              onChangeText={(t) => handleDigitChange(t, i)}
            />
          ))}
        </View>
        {error && <Text style={[styles.error, { color: c.danger }]}>{error}</Text>}
        <Button
          title={countdown > 0 ? `Resend in ${countdown}s` : 'Resend code'}
          variant="outline"
          disabled={countdown > 0}
          onPress={() => setCountdown(60)}
        />
      </View>
      <AuthBackground />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: spacing.xl, paddingTop: 80, gap: spacing.lg, alignItems: 'center' },
  title: { fontSize: fontSize.xl, fontFamily: 'Inter_700Bold' },
  subtitle: { fontSize: fontSize.base, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  digitRow: { flexDirection: 'row', gap: spacing.sm },
  digitBox: { width: 48, height: 56, borderWidth: 1.5, borderRadius: radius.md, textAlign: 'center', fontSize: fontSize.xl, fontFamily: 'Inter_700Bold' },
  error: { fontSize: fontSize.sm, fontFamily: 'Inter_400Regular' },
});
