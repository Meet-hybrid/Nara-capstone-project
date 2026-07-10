import { useRef, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Circle,
  Path,
  Defs,
  RadialGradient,
  Stop,
  G,
} from 'react-native-svg';

const FOREST = '#123B2F';
const GOLD = '#D4A64F';
const SURFACE = '#FAF9F6';
const SAGE = '#D8DDD8';

const SIZE = 280;
const CX = SIZE / 2;
const CY = SIZE / 2;
const ORBIT_R = 88;
const DOT_R = 7;
const MEMBER_COUNT = 6;

const ANGLES = Array.from({ length: MEMBER_COUNT }, (_, i) => i * (360 / MEMBER_COUNT));

const MEMBER_POINTS = ANGLES.map((deg) => {
  const rad = (deg * Math.PI) / 180;
  return {
    x: CX + ORBIT_R * Math.cos(rad),
    y: CY + ORBIT_R * Math.sin(rad),
  };
});

function arcPath(p1, p2, r) {
  const midX = (p1.x + p2.x) / 2;
  const midY = (p1.y + p2.y) / 2;
  const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
  const h = Math.sqrt(Math.max(0, r * r - (dist / 2) * (dist / 2)));
  const cx = midX - (h * (p2.y - p1.y)) / dist;
  const cy = midY + (h * (p2.x - p1.x)) / dist;
  return `M ${p1.x} ${p1.y} A ${r} ${r} 0 0 1 ${p2.x} ${p2.y}`;
}

const ARC_PATH = MEMBER_POINTS.map((p, i) => {
  const next = MEMBER_POINTS[(i + 1) % MEMBER_COUNT];
  return arcPath(p, next, ORBIT_R + 22);
}).join(' ');

function useAnimationFrame(callback, running = true) {
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    if (!running) return;
    let id;
    let start = Date.now();
    const tick = () => {
      id = requestAnimationFrame(tick);
      cbRef.current((Date.now() - start) / 1000);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [running]);
}

function getOrbitPosition(angleRad) {
  return {
    x: CX + ORBIT_R * Math.cos(angleRad),
    y: CY + ORBIT_R * Math.sin(angleRad),
  };
}

export default function ThePot({ size = 280 }) {
  const [time, setTime] = useState(0);
  const [orbitOffset, setOrbitOffset] = useState(0);

  useAnimationFrame((seconds) => {
    setTime(seconds);
    setOrbitOffset(seconds * 0.3);
  });

  const rotateAngle = Math.sin(time * 0.25) * 2;
  const glowOpacity = 0.12 + Math.sin(time * 1.2) * 0.06;

  const dotOffsets = ANGLES.map((_, i) => {
    const angle = (time * 0.4 + i * (Math.PI / 3)) % (2 * Math.PI);
    return getOrbitPosition(angle);
  });

  const pulseScales = MEMBER_POINTS.map((_, i) => {
    return 1 + Math.sin(time * 1.5 + i * 1.2) * 0.08;
  });

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ transform: [{ rotate: `${rotateAngle}deg` }] }}
      >
        <Defs>
          <RadialGradient id="potGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={GOLD} stopOpacity="0.25" />
            <Stop offset="40%" stopColor={GOLD} stopOpacity="0.1" />
            <Stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="potCore" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={GOLD} stopOpacity="0.5" />
            <Stop offset="60%" stopColor={GOLD} stopOpacity="0.1" />
            <Stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="memberGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={FOREST} stopOpacity="0.12" />
            <Stop offset="100%" stopColor={FOREST} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Circle cx={CX} cy={CY} r={80} fill="url(#potGlow)" />
        <Circle cx={CX} cy={CY} r={55} fill="url(#potCore)" />

        <Circle
          cx={CX} cy={CY}
          r={ORBIT_R + DOT_R + 6}
          fill="none" stroke={SAGE} strokeWidth={0.8}
          opacity={0.12} strokeDasharray="3,5"
        />

        <Path d={ARC_PATH} fill="none" stroke={SAGE} strokeWidth={1} opacity={0.3} />

        <Circle
          cx={CX} cy={CY}
          r={ORBIT_R * 0.55}
          fill="none" stroke={SAGE} strokeWidth={0.5}
          opacity={0.1} strokeDasharray="2,4"
        />

        {MEMBER_POINTS.map((p, i) => (
          <Path
            key={`spoke-${i}`}
            d={`M ${CX} ${CY} L ${p.x} ${p.y}`}
            stroke={SAGE} strokeWidth={0.5}
            opacity={0.12} strokeDasharray="2,3"
          />
        ))}

        {MEMBER_POINTS.map((p, i) => (
          <Circle
            key={`member-outer-${i}`}
            cx={p.x} cy={p.y}
            r={DOT_R + 4}
            fill="url(#memberGlow)"
            opacity={0.5 + Math.sin(time * 1.5 + i * 1.2) * 0.3}
          />
        ))}

        {MEMBER_POINTS.map((p, i) => (
          <Circle
            key={`member-dot-${i}`}
            cx={p.x} cy={p.y}
            r={DOT_R * (0.95 + Math.sin(time * 1.5 + i * 1.2) * 0.05)}
            fill={SURFACE}
            opacity={0.95}
          />
        ))}

        {MEMBER_POINTS.map((p, i) => (
          <Circle
            key={`member-core-${i}`}
            cx={p.x} cy={p.y}
            r={2.5}
            fill={FOREST}
            opacity={0.5}
          />
        ))}

        {dotOffsets.map((pos, i) => (
          <Circle
            key={`orbit-dot-${i}`}
            cx={pos.x} cy={pos.y}
            r={3}
            fill={GOLD}
            opacity={0.85}
          />
        ))}

        <Circle
          cx={CX} cy={CY}
          r={44}
          fill="none" stroke={GOLD} strokeWidth={1.5}
          opacity={glowOpacity}
        />

        <Circle cx={CX} cy={CY} r={16} fill={GOLD} opacity={0.15} />
        <Circle cx={CX} cy={CY} r={6} fill={GOLD} opacity={0.6} />
        <Circle cx={CX} cy={CY} r={2.5} fill={SURFACE} opacity={0.8} />
      </Svg>
    </View>
  );
}
