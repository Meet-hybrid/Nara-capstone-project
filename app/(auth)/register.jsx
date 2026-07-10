import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import { BankInput, BankPickerModal } from '../../components/common/BankPicker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { spacing, fontSize } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

const { width: W } = Dimensions.get('window');

const CIRCLES = [
  { size: 16, left: '5%', top: '4%', op: 0.12 },
  { size: 10, left: '88%', top: '6%', op: 0.15 },
  { size: 22, left: '72%', top: '14%', op: 0.1, outline: true },
  { size: 14, left: '12%', top: '20%', op: 0.14 },
  { size: 8, left: '92%', top: '28%', op: 0.18 },
  { size: 18, left: '3%', top: '38%', op: 0.1, outline: true },
  { size: 12, left: '82%', top: '45%', op: 0.13 },
  { size: 28, left: '58%', top: '52%', op: 0.08 },
  { size: 8, left: '22%', top: '60%', op: 0.16 },
  { size: 16, left: '87%', top: '68%', op: 0.1, outline: true },
  { size: 10, left: '8%', top: '76%', op: 0.14 },
  { size: 20, left: '62%', top: '84%', op: 0.09 },
  { size: 8, left: '38%', top: '90%', op: 0.15 },
  { size: 14, left: '52%', top: '8%', op: 0.11, outline: true },
  { size: 6, left: '45%', top: '28%', op: 0.2 },
  { size: 10, left: '30%', top: '48%', op: 0.12 },
  { size: 24, left: '45%', top: '70%', op: 0.07, outline: true },
  { size: 6, left: '75%', top: '35%', op: 0.18 },
];
import { isValidNigerianPhone, isValidEmail, isStrongPassword, isValidBVN, isValidNIN, isValidAccountNumber } from '../../utils/validators';
import { register } from '../../services/authService';

export default function RegisterScreen() {
  console.log('Rendering RegisterScreen — collecting member details');
  const router = useRouter();
  const { colors: c } = useTheme();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bvn, setBvn] = useState('');
  const [nin, setNin] = useState('');
  const [bankPickerVisible, setBankPickerVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!isValidEmail(email)) errs.email = 'Enter a valid email address';
    if (!isValidNigerianPhone(phone)) errs.phone = 'Enter a valid Nigerian phone number';
    if (!isStrongPassword(password)) errs.password = 'At least 8 characters, 1 uppercase, 1 number';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!bank.trim()) errs.bank = 'Bank is required';
    if (!isValidAccountNumber(accountNumber)) errs.accountNumber = 'Enter a valid 10-digit account number';
    if (!isValidBVN(bvn)) errs.bvn = 'Enter a valid 11-digit BVN';
    if (!isValidNIN(nin)) errs.nin = 'Enter a valid 11-digit NIN';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register(fullName, email, phone, password, bank, accountNumber, bvn, nin);
      router.push({ pathname: '/(auth)/verify-otp', params: { phone } });
    } catch (err) {
      const apiErrors = err.response?.data?.errors || {};
      setErrors(apiErrors);
      if (!Object.keys(apiErrors).length) {
        const isNetworkError = !err.response || err.response.status === 0;
        const message = isNetworkError
          ? 'Unable to connect to the server. Make sure the backend is running.'
          : 'Something went wrong. Please try again.';
        setErrors({ form: message });
      }
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = fullName && email && phone && password && confirmPassword && bank && accountNumber && bvn && nin;

  return (
    <View style={[styles.container, { backgroundColor: c.canvas }]}>
      <ScrollView contentContainerStyle={styles.content} style={{ backgroundColor: 'transparent' }}>
      <View style={styles.headerSection}>
        <Text style={[styles.badge, { color: c.forest }]}>GET STARTED</Text>
        <Text style={[styles.title, { color: c.text }]}>Create your account</Text>
        <Text style={[styles.subtitle, { color: c.slate }]}>Join a savings circle and start building your future.</Text>
      </View>

      <Input label="Full name" value={fullName} onChangeText={setFullName} error={errors.fullName} />
      <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" error={errors.email} />
      <Input label="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="080 1234 5678" error={errors.phone} />
      <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry error={errors.password} />
      <Input label="Confirm password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry error={errors.confirmPassword} />
      <View style={[styles.divider, { backgroundColor: c.divider }]} />
      <BankInput value={bank} onPress={() => setBankPickerVisible(true)} error={errors.bank} />
      <BankPickerModal visible={bankPickerVisible} onClose={() => setBankPickerVisible(false)} onSelect={setBank} />
      <Input label="Account number" value={accountNumber} onChangeText={setAccountNumber} keyboardType="number-pad" placeholder="0123456789" maxLength={10} error={errors.accountNumber} />
      <Input label="BVN" value={bvn} onChangeText={setBvn} keyboardType="number-pad" placeholder="11-digit BVN" maxLength={11} error={errors.bvn} />
      <Input label="NIN" value={nin} onChangeText={setNin} keyboardType="number-pad" placeholder="11-digit NIN" maxLength={11} error={errors.nin} />
      {errors.form && <Text style={[styles.formError, { color: c.danger }]}>{errors.form}</Text>}
      <Button title="Create account" onPress={handleRegister} loading={loading} disabled={!canSubmit} />
      <TouchableOpacity onPress={() => router.push('/(auth)/login')} activeOpacity={0.7}>
        <Text style={[styles.loginLink, { color: c.forest }]}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </ScrollView>
      {CIRCLES.map((circ, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: circ.left, top: circ.top,
            width: circ.size, height: circ.size,
            borderRadius: circ.size / 2,
            backgroundColor: circ.outline ? 'transparent' : c.forest,
            borderWidth: circ.outline ? 1 : 0,
            borderColor: c.forest,
            opacity: circ.op,
          }}
          pointerEvents="none"
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    paddingTop: spacing.xxl + spacing.md,
    gap: spacing.md,
  },
  headerSection: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  badge: {
    fontSize: fontSize.xs,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 3,
  },
  title: {
    fontSize: fontSize.xl,
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    fontSize: fontSize.base,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
  formError: {
    fontSize: fontSize.sm,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    marginVertical: spacing.xs,
  },
  loginLink: {
    fontSize: fontSize.base,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});