import { useRef, useEffect } from 'react';
import { Animated, Easing, View, Dimensions, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Defs, RadialGradient as SvgRadialGradient, Stop } from 'react-native-svg';

const FOREST = '#123B2F';
const SAGE = '#D8DDD8';
const GOLD = '#D4A64F';

const { width: W, height: H } = Dimensions.get('window');

function useFloat(delay = 0, duration = 16000) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, { toValue: -8, duration: duration / 2, delay, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 8, duration: duration / 2, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    float.start();

    const fade = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: duration * 0.5, delay, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: duration * 0.5, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    fade.start();

    return () => { float.stop(); fade.stop(); };
  }, []);

  return { translateY, opacity };
}

function FloatingCircle({ size, left, top, color = FOREST, bgOpacity = 0.06, borderOnly = false, delay = 0, duration = 16000 }) {
  const { translateY, opacity } = useFloat(delay, duration);

  return (
    <Animated.View
      style={{
        position: 'absolute', left, top, width: size, height: size,
        borderRadius: size / 2,
        backgroundColor: borderOnly ? 'transparent' : color,
        borderWidth: borderOnly ? 1 : 0,
        borderColor: color,
        opacity: opacity.interpolate({
          inputRange: [0, 1],
          outputRange: [bgOpacity * 0.7, bgOpacity * 1.3],
        }),
        transform: [{ translateY }],
      }}
      pointerEvents="none"
    />
  );
}

function StarDot({ left, top, delay = 0 }) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 3000, delay, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute', left, top, width: 4, height: 4, borderRadius: 2,
        backgroundColor: GOLD,
        opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.1, 0.7] }),
        transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.4] }) }],
      }}
      pointerEvents="none"
    />
  );
}

function CornerGradient({ corner, size = 360 }) {
  const [x, y] = corner === 'topLeft' ? ['0%', '0%'] : corner === 'topRight' ? ['100%', '0%'] : ['100%', '100%'];
  const stylePos = corner === 'topLeft' ? { top: -size * 0.3, left: -size * 0.3 } :
    corner === 'topRight' ? { top: -size * 0.3, right: -size * 0.3 } :
    { bottom: -size * 0.3, right: -size * 0.3 };

  return (
    <Svg width={size} height={size} style={{ position: 'absolute', ...stylePos, zIndex: 0 }} pointerEvents="none">
      <Defs>
        <SvgRadialGradient id={`bgGlow${corner}`} cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={FOREST} stopOpacity="0.08" />
          <Stop offset="50%" stopColor={FOREST} stopOpacity="0.03" />
          <Stop offset="100%" stopColor={FOREST} stopOpacity="0" />
        </SvgRadialGradient>
      </Defs>
      <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#bgGlow${corner})`} />
    </Svg>
  );
}

const CIRCLES = [
  { size: 14, left: '10%', top: '5%', bgOpacity: 0.2, color: FOREST },
  { size: 8, left: '80%', top: '3%', bgOpacity: 0.25, color: FOREST },
  { size: 36, left: '70%', top: '14%', bgOpacity: 0.18, borderOnly: true, color: FOREST },
  { size: 6, left: '92%', top: '12%', bgOpacity: 0.3, color: GOLD },
  { size: 200, left: -60, top: '0%', bgOpacity: 0.08, borderOnly: true, color: FOREST, duration: 22000 },
  { size: 18, left: '5%', top: '24%', bgOpacity: 0.22, color: FOREST },
  { size: 50, left: '82%', top: '30%', bgOpacity: 0.15, borderOnly: true, color: FOREST, duration: 20000 },
  { size: 10, left: '90%', top: '24%', bgOpacity: 0.25, color: FOREST },
  { size: 140, left: '-10%', top: '28%', bgOpacity: 0.07, borderOnly: true, color: FOREST, duration: 25000 },
  { size: 28, left: '68%', top: '42%', bgOpacity: 0.18, color: FOREST },
  { size: 8, left: '16%', top: '44%', bgOpacity: 0.28, color: FOREST },
  { size: 220, left: '50%', top: '32%', bgOpacity: 0.06, borderOnly: true, color: FOREST, duration: 26000 },
  { size: 16, left: '86%', top: '54%', bgOpacity: 0.2, color: FOREST },
  { size: 40, left: '4%', top: '56%', bgOpacity: 0.16, borderOnly: true, color: FOREST },
  { size: 12, left: '12%', top: '70%', bgOpacity: 0.22, color: FOREST },
  { size: 180, left: '65%', top: '58%', bgOpacity: 0.07, borderOnly: true, color: FOREST, duration: 24000 },
  { size: 22, left: '48%', top: '74%', bgOpacity: 0.2, color: FOREST },
  { size: 8, left: '76%', top: '84%', bgOpacity: 0.28, color: GOLD },
  { size: 30, left: '86%', top: '74%', bgOpacity: 0.16, borderOnly: true, color: FOREST },
  { size: 14, left: '33%', top: '88%', bgOpacity: 0.22, color: FOREST },
  { size: 120, left: '-8%', top: '70%', bgOpacity: 0.07, borderOnly: true, color: FOREST, duration: 20000 },
  { size: 70, left: '38%', top: '16%', bgOpacity: 0.1, borderOnly: true, color: FOREST, duration: 18000 },
  { size: 8, left: '22%', top: '12%', bgOpacity: 0.3, color: GOLD },
  { size: 6, left: '46%', top: '30%', bgOpacity: 0.35, color: GOLD },
  { size: 18, left: '56%', top: '56%', bgOpacity: 0.18, color: FOREST },
  { size: 44, left: '28%', top: '62%', bgOpacity: 0.14, borderOnly: true, color: FOREST },
  { size: 7, left: '62%', top: '6%', bgOpacity: 0.3, color: GOLD },
  { size: 4, left: '40%', top: '52%', bgOpacity: 0.4, color: GOLD },
];

export default function BackgroundCircles() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <CornerGradient corner="topLeft" size={400} />
      <CornerGradient corner="topRight" size={300} />
      <CornerGradient corner="bottomRight" size={420} />

      <Svg
        width={W}
        height={H}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        <Defs>
          <SvgRadialGradient id="blurGlow1" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={SAGE} stopOpacity="0.06" />
            <Stop offset="60%" stopColor={SAGE} stopOpacity="0.02" />
            <Stop offset="100%" stopColor={SAGE} stopOpacity="0" />
          </SvgRadialGradient>
          <SvgRadialGradient id="blurGlow2" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={FOREST} stopOpacity="0.05" />
            <Stop offset="70%" stopColor={FOREST} stopOpacity="0.01" />
            <Stop offset="100%" stopColor={FOREST} stopOpacity="0" />
          </SvgRadialGradient>
        </Defs>
        <Circle cx="15%" cy="25%" r={120} fill="url(#blurGlow1)" />
        <Circle cx="85%" cy="50%" r={100} fill="url(#blurGlow2)" />
        <Circle cx="30%" cy="80%" r={90} fill="url(#blurGlow1)" />
      </Svg>

      {CIRCLES.map((c, i) => (
        <FloatingCircle
          key={i}
          size={c.size}
          left={c.left}
          top={c.top}
          color={c.color || FOREST}
          bgOpacity={c.bgOpacity}
          borderOnly={c.borderOnly || false}
          delay={c.delay || 0}
          duration={c.duration || 16000}
        />
      ))}

      <StarDot left="28%" top="18%" delay={0} />
      <StarDot left="72%" top="8%" delay={2000} />
      <StarDot left="12%" top="48%" delay={4000} />
      <StarDot left="85%" top="62%" delay={1000} />
      <StarDot left="42%" top="85%" delay={6000} />
      <StarDot left="5%" top="78%" delay={3000} />
      <StarDot left="60%" top="28%" delay={5000} />
    </View>
  );
}
