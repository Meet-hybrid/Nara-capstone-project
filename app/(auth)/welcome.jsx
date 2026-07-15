import { View, Text, TouchableOpacity, Animated, StyleSheet} from 'react-native';
import { useRouter } from 'expo-router';
import { useRef, useEffect, useState, useCallback } from 'react';
import { spacing, fontSize } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/common/Button';
import ThePot from '../../components/common/ThePot';
import BackgroundCircles from '../../components/common/BackgroundCircles';

const PHRASES = [
  { text: 'Ajo, Reimagined.', size: 28, weight: 'Inter_700Bold' },
  { text: 'Modern savings. Timeless trust.', size: 22, weight: 'Inter_600SemiBold' },
  { text: 'Save together. Achieve together.', size: 22, weight: 'Inter_600SemiBold' },
];

const DISPLAY_DURATION = 2200;
const TRANSITION_DURATION = 200;

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors: c } = useTheme();
  const [index, setIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const animateTo = useCallback((nextIndex) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: TRANSITION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -8,
        duration: TRANSITION_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIndex(nextIndex);
      slideAnim.setValue(8);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: TRANSITION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: TRANSITION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    const timer = setInterval(() => {
      animateTo((index + 1) % PHRASES.length);
    }, DISPLAY_DURATION);
    return () => clearInterval(timer);
  }, [index, animateTo]);

  const phrase = PHRASES[index];

  return (
    <View style={[styles.container, { backgroundColor: c.canvas }]}>
      <BackgroundCircles />

      <View style={styles.center}>
        <View style={styles.content}>
          <View style={{ width: 220, height: 220, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md }}>
            <ThePot size={160} />
          </View>

          <Text style={[styles.logo, { color: c.forest }]}>NARA</Text>

          <View style={styles.animatedWrap}>
            <Animated.Text
              style={[
                styles.phrase,
                { color: c.text, fontSize: phrase.size, fontFamily: phrase.weight },
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
            >
              {phrase.text}
            </Animated.Text>
          </View>

          <View style={styles.dots}>
            {PHRASES.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  { backgroundColor: i === index ? c.forest : c.divider },
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.bottom}>
        <Button
          title="Create your account"
          onPress={() => router.push('/(auth)/register')}
        />
        <View style={styles.loginRow}>
          <Text style={[styles.loginPrefix, { color: c.textSecondary }]}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')} activeOpacity={0.7}>
            <Text style={[styles.loginLink, { color: c.forest }]}>Log in</Text>
          </TouchableOpacity>
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
    paddingHorizontal: spacing.xl,
  },
  content: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 6,
    marginBottom: spacing.xxl,
  },
  animatedWrap: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  phrase: {
    textAlign: 'center',
    lineHeight: 36,
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bottom: {
    width: '100%',
    paddingHorizontal: spacing.xl,
    paddingBottom: 48,
    gap: spacing.md,
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
