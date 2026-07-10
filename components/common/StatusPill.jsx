import { View, Text, StyleSheet } from 'react-native';
import { radius, fontSize } from '../../constants/theme';

const typeColors = {
  active: { bg: '#E8F5EE', text: '#2D6A4F' },
  grace: { bg: '#FFF8E1', text: '#B8860B' },
  collected: { bg: '#FFF8E1', text: '#B8860B' },
  pending: { bg: '#F0F0F0', text: '#8A95A3' },
  processed: { bg: '#E8F5EE', text: '#2D6A4F' },
  scheduled: { bg: '#FFF8E1', text: '#B8860B' },
  upcoming: { bg: '#F0F0F0', text: '#8A95A3' },
};

export function StatusPill({ type }) {
  const config = typeColors[type] || typeColors.pending;
  return (
    <View style={[styles.pill, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>{type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: fontSize.xs,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'capitalize',
  },
});
