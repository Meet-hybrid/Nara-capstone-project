import useThemeStore from '../store/themeStore';
import { colors, darkColors, fonts, spacing, radius, fontSize } from '../constants/theme';

export function useTheme() {
  const { isDark, toggleTheme, setDark } = useThemeStore();

  const activeColors = isDark ? darkColors : colors;

  return {
    isDark,
    toggleTheme,
    setDark,
    colors: activeColors,
    fonts,
    spacing,
    radius,
    fontSize,
  };
}
