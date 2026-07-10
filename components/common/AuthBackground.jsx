import { View, Dimensions } from 'react-native';

const FOREST = '#123B2F';
const GOLD = '#D4A64F';

const { width: W, height: H } = Dimensions.get('window');

const CIRCLES = [
  { size: 14, left: '8%', top: '5%', op: 0.18 },
  { size: 8, left: '85%', top: '4%', op: 0.22 },
  { size: 30, left: '72%', top: '16%', op: 0.14, outline: true },
  { size: 18, left: '4%', top: '22%', op: 0.2 },
  { size: 10, left: '90%', top: '28%', op: 0.22 },
  { size: 40, left: '78%', top: '40%', op: 0.12, outline: true },
  { size: 8, left: '14%', top: '42%', op: 0.25 },
  { size: 22, left: '60%', top: '55%', op: 0.16 },
  { size: 6, left: '88%', top: '60%', op: 0.28, color: GOLD },
  { size: 16, left: '6%', top: '62%', op: 0.18 },
  { size: 36, left: '84%', top: '72%', op: 0.12, outline: true },
  { size: 12, left: '30%', top: '80%', op: 0.2 },
  { size: 8, left: '65%', top: '86%', op: 0.22 },
  { size: 24, left: '50%', top: '12%', op: 0.14, outline: true },
  { size: 6, left: '45%', top: '35%', op: 0.3, color: GOLD },
  { size: 14, left: '35%', top: '55%', op: 0.16 },
  { size: 5, left: '55%', top: '72%', op: 0.3, color: GOLD },
  { size: 20, left: '20%', top: '90%', op: 0.14, outline: true },
];

export default function AuthBackground() {
  return (
    <View style={{ position: 'absolute', width: '100%', height: '100%' }} pointerEvents="none">
      {CIRCLES.map((c, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: c.left, top: c.top,
            width: c.size, height: c.size,
            borderRadius: c.size / 2,
            backgroundColor: c.outline ? 'transparent' : (c.color || FOREST),
            borderWidth: c.outline ? 1 : 0,
            borderColor: FOREST,
            opacity: c.op,
          }}
        />
      ))}
    </View>
  );
}
