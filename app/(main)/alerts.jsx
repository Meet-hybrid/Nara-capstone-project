import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet} from 'react-native';
import { useState, useEffect } from 'react';
import { spacing, fontSize } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { getNotifications, markNotificationsRead } from '../../services/memberService';
import useNotificationStore from '../../store/notificationStore';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { NotificationCard } from '../../components/alerts/NotificationCard';

export default function AlertsScreen() {
  console.log('Rendering AlertsScreen — notification feed');
  const { colors: c } = useTheme();
  const { notifications, setNotifications, markAllRead } = useNotificationStore();
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data.data || data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleMarkAllRead = async () => {
    try {
      await markNotificationsRead();
      markAllRead();
    } catch {
      // silent
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <View style={[styles.container, { backgroundColor: c.canvas }]}>
      <ScreenHeader
        label="Alerts"
        title="Notifications"
        rightElement={
          unreadCount > 0 && (
            <TouchableOpacity onPress={handleMarkAllRead}>
              <Text style={[styles.markAllRead, { color: c.parchment }]}>Mark all read</Text>
            </TouchableOpacity>
          )
        }
      />
      <View style={[styles.unreadBar, { backgroundColor: c.forest }]}>
        <View style={[styles.unreadDot, { backgroundColor: c.parchment }]} />
        <Text style={styles.unreadText}>
          {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
        </Text>
      </View>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={c.forest} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <NotificationCard
              title={item.title}
              body={item.body}
              createdAt={item.created_at}
              isRead={item.is_read}
            />
          )}
          refreshing={loading}
          onRefresh={fetchNotifications}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  markAllRead: { fontSize: fontSize.sm, fontFamily: 'Inter_600SemiBold' },
  unreadBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  unreadDot: { width: 8, height: 8, borderRadius: 4 },
  unreadText: { color: 'rgba(255,255,255,0.8)', fontSize: fontSize.sm, fontFamily: 'Inter_600SemiBold' },
  list: { padding: spacing.lg, gap: spacing.sm, paddingBottom: spacing.xl },
});