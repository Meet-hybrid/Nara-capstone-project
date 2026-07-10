import { Tabs } from 'expo-router';
import { View, Text, StyleSheet} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fontSize } from '../../constants/theme';
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

export default function MainTabLayout() {
  const { colors: themeColors } = useTheme();
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: themeColors.surface,
          borderTopColor: themeColors.divider,
          borderTopWidth: 1,
          elevation: 12,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: -4 },
          shadowRadius: 12,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: themeColors.forest,
        tabBarInactiveTintColor: themeColors.slateLight,
        tabBarLabelStyle: {
          fontSize: fontSize.xs,
          fontFamily: 'Inter_600SemiBold',
          textTransform: 'uppercase',
          marginTop: 2,
        },
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Overview',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? tabIcons.index.focused : tabIcons.index.unfocused} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="circle"
        options={{
          title: 'Circle',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? tabIcons.circle.focused : tabIcons.circle.unfocused} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? tabIcons.history.focused : tabIcons.history.unfocused} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="protection"
        options={{
          title: 'Protection',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? tabIcons.protection.focused : tabIcons.protection.unfocused} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ focused, color }) => (
            <View>
              <Ionicons name={focused ? tabIcons.alerts.focused : tabIcons.alerts.unfocused} size={22} color={color} />
              {unreadCount > 0 && (
                <View style={[styles.badge, { backgroundColor: themeColors.danger }]}>
                  <Text style={[styles.badgeText, { color: themeColors.surface }]}>{unreadCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? tabIcons.account.focused : tabIcons.account.unfocused} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
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
