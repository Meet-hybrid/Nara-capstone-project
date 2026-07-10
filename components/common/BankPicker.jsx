import { View, Text, Modal, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import { colors, spacing, fontSize, radius } from '../../constants/theme';

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
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Select your bank</Text>
          <FlatList
            data={NIGERIAN_BANKS}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.option} onPress={() => { onSelect(item); onClose(); }}>
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            )}
            style={styles.list}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export function BankInput({ value, onPress, error }) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Bank name</Text>
      <TouchableOpacity style={[styles.input, error && styles.inputError]} onPress={onPress}>
        <Text style={[styles.inputText, !value && styles.placeholder]}>
          {value || 'Select your bank'}
        </Text>
        <Text style={styles.chevron}>{'\u25BC'}</Text>
      </TouchableOpacity>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  label: { fontSize: fontSize.sm, fontFamily: 'Inter_600SemiBold', color: colors.slate },
  input: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: colors.divider, borderRadius: radius.sm,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 4,
    backgroundColor: colors.surface,
  },
  inputError: { borderColor: colors.danger },
  inputText: { fontSize: fontSize.md, fontFamily: 'Inter_400Regular', color: colors.text, flex: 1 },
  placeholder: { color: colors.slateLight },
  chevron: { fontSize: 10, color: colors.slateLight, marginLeft: spacing.sm },
  error: { fontSize: fontSize.sm, color: colors.danger, fontFamily: 'Inter_400Regular' },
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg,
    paddingTop: spacing.sm, paddingBottom: spacing.xl, maxHeight: '70%',
  },
  handle: {
    width: 40, height: 4, backgroundColor: colors.divider, borderRadius: 2,
    alignSelf: 'center', marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.md, fontFamily: 'Inter_700Bold', color: colors.text,
    paddingHorizontal: spacing.lg, marginBottom: spacing.sm,
  },
  list: { paddingHorizontal: spacing.lg },
  option: {
    paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  optionText: { fontSize: fontSize.md, fontFamily: 'Inter_400Regular', color: colors.text },
});
