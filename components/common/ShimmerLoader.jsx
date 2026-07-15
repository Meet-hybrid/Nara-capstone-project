import { useRef, useEffect } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

export function ShimmerLoader({ width = '100%', height = 20, radius = 4, color }) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.bone,
        { width, height, borderRadius: radius, opacity, backgroundColor: color || '#D1D5DB' },
      ]}
    />
  );
}

export function SkeletonCard({ lines = 3, cardColor, boneColor }) {
  return (
    <View style={[styles.card, { backgroundColor: cardColor || '#FFFFFF' }]}>
      {Array.from({ length: lines }).map((_, i) => (
        <ShimmerLoader key={i} height={14} color={boneColor} width={i === 0 ? '60%' : i === lines - 1 ? '40%' : '100%'} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    gap: 12,
    borderRadius: 12,
  },
});
