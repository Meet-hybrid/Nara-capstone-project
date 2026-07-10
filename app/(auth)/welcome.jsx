import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle, Path, Defs, RadialGradient as SvgRadialGradient, Stop } from 'react-native-svg';
import { spacing, fontSize } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/common/Button';
import ThePot from '../../components/common/ThePot';
import BackgroundCircles from '../../components/common/BackgroundCircles';

const ORBIT_R = 130;
const CX = 140;
const CY = 140;
const ANGLES = [30, 90, 150, 210, 270, 330];
const MEMBER_POINTS = ANGLES.map((deg) => {
  const rad = (deg * Math.PI) / 180;
  return { x: CX + ORBIT_R * Math.cos(rad), y: CY + ORBIT_R * Math.sin(rad) };
});
const ARC_PATH = MEMBER_POINTS.map((p, i) => {
  const next = MEMBER_POINTS[(i + 1) % 6];
  const midX = (p.x + next.x) / 2, midY = (p.y + next.y) / 2;
  const dist = Math.hypot(next.x - p.x, next.y - p.y);
  const r = ORBIT_R + 18;
  const h = Math.sqrt(Math.max(0, r * r - (dist / 2) * (dist / 2)));
  const cx = midX - (h * (next.y - p.y)) / dist;
  const cy = midY + (h * (next.x - p.x)) / dist;
  return `M ${p.x} ${p.y} A ${r} ${r} 0 0 1 ${next.x} ${next.y}`;
}).join(' ');

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors: c } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: c.surface }]}>
      <BackgroundCircles />

      <View style={styles.center}>
        <View style={styles.content}>
          <View style={{ width: 280, height: 280, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={280} height={280} viewBox="0 0 280 280" style={{ position: 'absolute' }}>
              <Defs>
                <SvgRadialGradient id="potOrbitGlow" cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor="#123B2F" stopOpacity="0" />
                  <Stop offset="70%" stopColor="#123B2F" stopOpacity="0" />
                  <Stop offset="100%" stopColor="#D8DDD8" stopOpacity="0.06" />
                </SvgRadialGradient>
              </Defs>
              <Circle cx={CX} cy={CY} r={ORBIT_R + 24} fill="url(#potOrbitGlow)" />
              <Circle cx={CX} cy={CY} r={ORBIT_R + 8} fill="none" stroke="#D8DDD8" strokeWidth={0.6} opacity={0.15} strokeDasharray="3,6" />
              <Path d={ARC_PATH} fill="none" stroke="#D8DDD8" strokeWidth={0.8} opacity={0.2} />
            </Svg>
            <ThePot size={200} />
          </View>

          <Text style={[styles.potTitle, { color: c.forest }]}>THE POT</Text>

          <Text style={[styles.logo, { color: c.forest }]}>NARA</Text>

          <View style={styles.taglineRow}>
            <Text style={[styles.taglineGold, { color: c.parchment }]}>Ajo, </Text>
            <Text style={[styles.taglineGreen, { color: c.forest }]}>Reimagined.</Text>
          </View>

          <View style={styles.supportingBlock}>
            <Text style={[styles.supportingText, { color: c.slate }]}>Modern savings. Timeless trust.</Text>
            <Text style={[styles.supportingText, { color: c.slate }]}>Save together. Achieve together.</Text>
          </View>

          <View style={styles.actions}>
            <Button
              title="Create your account"
              onPress={() => router.push('/(auth)/register')}
              style={[styles.primaryButtonShadow, { shadowColor: c.forest }]}
            />
            <View style={styles.loginRow}>
              <Text style={[styles.loginPrefix, { color: c.slate }]}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')} activeOpacity={0.7}>
                <Text style={[styles.loginLink, { color: c.forest }]}>Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  content: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    gap: 0,
  },

  potTitle: {
    fontSize: fontSize.md,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 6,
    marginTop: spacing.sm,
  },
  logo: {
    fontSize: 64,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 8,
    marginTop: spacing.md,
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: spacing.lg,
  },
  taglineGold: {
    fontSize: fontSize.lg,
    fontFamily: 'Inter_700Bold',
    lineHeight: 28,
  },
  taglineGreen: {
    fontSize: fontSize.lg,
    fontFamily: 'Inter_700Bold',
    lineHeight: 28,
  },

  supportingBlock: {
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: 2,
  },
  supportingText: {
    fontSize: fontSize.base,
    fontFamily: 'Inter_400Regular',
    lineHeight: 22,
  },

  actions: {
    width: '100%',
    gap: spacing.md,
    marginTop: spacing.xl + spacing.md,
  },
  primaryButtonShadow: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  loginPrefix: {
    fontSize: fontSize.base,
    fontFamily: 'Inter_400Regular',
  },
  loginLink: {
    fontSize: fontSize.base,
    fontFamily: 'Inter_600SemiBold',
  },

});