import { useRef, useEffect } from 'react';
import { Animated, View, Text } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { useTheme } from '../../hooks/useTheme';
import { fontSize } from '../../constants/theme';

const AnimatedSvgCircle = Animated.createAnimatedComponent(Circle);

export function CircleRing({ progress, size = 80, strokeWidth = 6 }) {
  const { colors: c } = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const animatedValue = useRef(new Animated.Value(0)).current;
  const center = size / 2;

  useEffect(() => {
    animatedValue.setValue(0);
    Animated.spring(animatedValue, {
      toValue: progress,
      friction: 6,
      tension: 40,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const offset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={c.divider}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <G transform={{ rotation: -90, originX: center, originY: center }}>
          <AnimatedSvgCircle
            cx={center}
            cy={center}
            r={radius}
            stroke={c.accent}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text style={{ fontSize: fontSize.base, fontFamily: 'Inter_700Bold', color: c.accent }}>{Math.round(progress * 100)}%</Text>
      </View>
    </View>
  );
}
