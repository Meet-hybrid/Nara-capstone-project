import { View, Text, Modal, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { spacing, fontSize, radius } from '../../constants/theme';

const NIGERIAN_BANKS = [
  'Access Bank',
  'Citibank',
  'Ecobank',
  'Fidelity Bank',
  'First Bank',
  'First City Monument Bank (FCMB)',
  'Globus Bank',
  'Guaranty Trust Bank (GTBank)',
  'Heritage Bank',
  'Jaiz Bank',
  'Keystone Bank',
  'Kuda Bank',
  'Lotus Bank',
  'Moniepoint',
  'OPay',
  'PalmPay',
  'Parallex Bank',
  'Polaris Bank',
  'Premium Trust Bank',
  'Providus Bank',
  'Stanbic IBTC Bank',
  'Standard Chartered Bank',
  'Sterling Bank',
  'SunTrust Bank',
  'Titan Trust Bank',
  'Union Bank',
  'United Bank for Africa (UBA)',
  'Unity Bank',
  'Wema Bank',
  'Zenith Bank',
];

export function BankPicker({ value, onSelect, error }) {
  return null;
}

export function BankPickerModal({ visible, onClose, onSelect }) {
  const { colors: c, shadows: s } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }} activeOpacity={1} onPress={onClose}>
        <View style={{ backgroundColor: c.surface, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, paddingTop: spacing.sm, paddingBottom: spacing.xl, maxHeight: '70%', ...s.lg }}>
          <View style={{ width: 40, height: 4, backgroundColor: c.divider, borderRadius: 2, alignSelf: 'center', marginBottom: spacing.md }} />
          <Text style={{ fontSize: fontSize.md, fontFamily: 'Inter_700Bold', color: c.text, paddingHorizontal: spacing.lg, marginBottom: spacing.sm }}>Select your bank</Text>
          <FlatList
            data={NIGERIAN_BANKS}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderBottomWidth: 1, borderBottomColor: c.divider }}
                onPress={() => { onSelect(item); onClose(); }}
              >
                <Text style={{ fontSize: fontSize.md, fontFamily: 'Inter_400Regular', color: c.text }}>{item}</Text>
              </TouchableOpacity>
            )}
            style={{ paddingHorizontal: 0 }}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export function BankInput({ value, onPress, error }) {
  const { colors: c } = useTheme();
  return (
    <View style={{ gap: spacing.xs }}>
      <Text style={{ fontSize: fontSize.sm, fontFamily: 'Inter_600SemiBold', color: c.textSecondary, letterSpacing: 0.3 }}>Bank name</Text>
      <TouchableOpacity
        style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          borderWidth: 1.5, borderColor: error ? c.danger : c.divider, borderRadius: radius.md,
          paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 4,
          backgroundColor: c.surface,
        }}
        onPress={onPress}
      >
        <Text style={{ fontSize: fontSize.md, fontFamily: 'Inter_400Regular', color: value ? c.text : c.textDisabled, flex: 1 }}>
          {value || 'Select your bank'}
        </Text>
        <Text style={{ fontSize: 10, color: c.textDisabled, marginLeft: spacing.sm }}>{'\u25BC'}</Text>
      </TouchableOpacity>
      {error && <Text style={{ fontSize: fontSize.sm, color: c.danger, fontFamily: 'Inter_400Regular' }}>{error}</Text>}
    </View>
  );
}
