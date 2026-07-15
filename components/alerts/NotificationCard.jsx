import { View, Text } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { radius, spacing, fontSize } from '../../constants/theme';
import { formatRelativeTime } from '../../utils/formatDate';

export function NotificationCard({ title, body, createdAt, isRead }) {
  const { colors: c, shadows: s } = useTheme();
  return (
    <View style={[{ backgroundColor: c.surface, borderRadius: radius.md, padding: spacing.md, gap: spacing.sm, borderWidth: 1, borderColor: c.divider, ...s.sm }, !isRead && { borderColor: c.accent }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: fontSize.base, fontFamily: 'Inter_700Bold', color: c.text, flex: 1 }}>{title}</Text>
        {!isRead && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.accent }} />}
      </View>
      <Text style={{ fontSize: fontSize.sm, fontFamily: 'Inter_400Regular', color: c.textSecondary, lineHeight: 20 }}>{body}</Text>
      <Text style={{ fontSize: fontSize.caption, fontFamily: 'Inter_400Regular', color: c.textDisabled }}>{formatRelativeTime(createdAt)}</Text>
    </View>
  );
}
