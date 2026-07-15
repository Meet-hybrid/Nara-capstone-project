import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fontSize, spacing } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import useNotificationStore from '../../store/notificationStore';

const tabIcons = {
  index: { focused: 'home', unfocused: 'home-outline' },
  circle: { focused: 'people', unfocused: 'people-outline' },
  history: { focused: 'receipt', unfocused: 'receipt-outline' },
  protection: { focused: 'shield-checkmark', unfocused: 'shield-checkmark-outline' },
  alerts: { focused: 'notifications', unfocused: 'notifications-outline' },
  account: { focused: 'person', unfocused: 'person-outline' },
};

const tabLabels = {
  index: 'Home',
  circle: 'Circle',
  history: 'History',
  protection: 'Cover',
  alerts: 'Alerts',
  account: 'Account',
};

export default function MainTabLayout() {
  const { colors: c } = useTheme();
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: c.surface,
          borderTopColor: c.divider,
          borderTopWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: c.accent,
        tabBarInactiveTintColor: c.textDisabled,
        tabBarLabel: tabLabels[route.name] || route.name,
        tabBarLabelStyle: {
          fontSize: fontSize.caption,
          fontFamily: 'Inter_500Medium',
          letterSpacing: 0.3,
          marginTop: 2,
        },
        tabBarShowLabel: true,
        tabBarIcon: ({ focused, color }) => (
          <View style={styles.iconWrap}>
            <Ionicons
              name={focused ? tabIcons[route.name]?.focused : tabIcons[route.name]?.unfocused}
              size={22}
              color={color}
            />
            {route.name === 'alerts' && unreadCount > 0 && (
              <View style={[styles.badge, { backgroundColor: c.danger }]}>
                <Text style={[styles.badgeText, { color: '#FFFFFF' }]}>{unreadCount}</Text>
              </View>
            )}
          </View>
        ),
      })}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="circle" />
      <Tabs.Screen name="history" />
      <Tabs.Screen name="protection" />
      <Tabs.Screen name="alerts" />
      <Tabs.Screen name="account" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
});
