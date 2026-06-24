import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Bell } from 'lucide-react-native';
import { useNotificationStore } from '../store/notificationStore';
import { COLORS, SPACING } from '../../../shared/constants/theme';

export const BellIcon = ({ onPress }) => {
  const { unreadCount, fetchNotifications } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <TouchableOpacity onPress={onPress} style={styles.bellButton} activeOpacity={0.7}>
      <Bell size={18} color={COLORS.textSecondary} />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bellButton: { padding: 6, position: 'relative' },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 2,
    borderRadius: 8,
    backgroundColor: COLORS.orange500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#fff', lineHeight: 12 },
});
