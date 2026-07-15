import useThemeStore from '../store/themeStore';
import { colors, darkColors, darkShadows, fonts, spacing, radius, fontSize, shadows } from '../constants/theme';

export function useTheme() {
  const { isDark, toggleTheme, setDark } = useThemeStore();

  const activeColors = isDark ? darkColors : colors;
  const activeShadows = isDark ? darkShadows : shadows;

  return {
    isDark,
    toggleTheme,
    setDark,
    colors: activeColors,
    shadows: activeShadows,
    fonts,
    spacing,
    radius,
    fontSize,
  };
}
