import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Bell, CheckCheck, ArrowDownCircle, ArrowRightLeft, AlertTriangle, Tag, ShieldAlert, Info, X } from 'lucide-react-native';
import { useNotificationStore } from '../store/notificationStore';
import { formatDate } from '../../../shared/utils/formatters';
import { COLORS, SPACING, SHADOWS } from '../../../shared/constants/theme';

const TYPE_CONFIG = {
  DEPÓSITO: {
    icon: ArrowDownCircle,
    bg: COLORS.blue100,
    iconColor: COLORS.blue600,
    dot: COLORS.blue400,
  },
  TRANSFERENCIA_ENVIADA: {
    icon: ArrowRightLeft,
    bg: COLORS.gold10,
    iconColor: COLORS.gold,
    dot: COLORS.gold400,
  },
  TRANSFERENCIA_RECIBIDA: {
    icon: ArrowRightLeft,
    bg: COLORS.orange100,
    iconColor: COLORS.orange500,
    dot: COLORS.orange400,
  },
  PRODUCTO: {
    icon: Tag,
    bg: COLORS.primaryDark,
    iconColor: COLORS.primaryDark,
    dot: COLORS.primaryDark,
  },
  DEFAULT: {
    icon: Info,
    bg: COLORS.gray100,
    iconColor: COLORS.gray400,
    dot: COLORS.gray400,
  },
};

const getTypeConfig = (type = '') => TYPE_CONFIG[type] ?? TYPE_CONFIG.DEFAULT;

const NotificationItem = ({ notification, onMarkRead }) => {
  const cfg = getTypeConfig(notification.type);
  const Icon = cfg.icon;
  const isUnread = !notification.read;

  return (
    <TouchableOpacity
      style={[styles.notificationItem, isUnread && styles.notificationItemUnread]}
      onPress={() => isUnread && onMarkRead(notification._id)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: cfg.bg }]}>
        <Icon size={17} color={cfg.iconColor} />
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={[styles.notificationTitle, isUnread && styles.notificationTitleUnread]} numberOfLines={2}>
            {notification.title}
          </Text>
          {isUnread && <View style={[styles.unreadDot, { backgroundColor: cfg.dot }]} />}
        </View>
        <Text style={styles.notificationMessage} numberOfLines={3}>{notification.message}</Text>
        <Text style={styles.notificationDate}>{formatDate(notification.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyIcon}>
      <Bell size={24} color={COLORS.gray300} />
    </View>
    <Text style={styles.emptyText}>Sin notificaciones</Text>
    <Text style={styles.emptySubtext}>Aquí aparecerán tus alertas y movimientos.</Text>
  </View>
);

export const NotificationPanel = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead } =
    useNotificationStore();

  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen, fetchNotifications]);

  if (!isOpen) return null;

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.panelContainer}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Notificaciones</Text>
            <View style={styles.headerActions}>
              {unreadCount > 0 && (
                <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
                  <CheckCheck size={13} color={COLORS.orange500} />
                  <Text style={styles.markAllText}>Marcar todas como leídas</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={15} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.panelContent}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size={24} color={COLORS.orange500} />
              </View>
            ) : notifications.length === 0 ? (
              <EmptyState />
            ) : (
              notifications.map((n) => (
                <NotificationItem key={n._id} notification={n} onMarkRead={markAsRead} />
              ))
            )}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  panelContainer: { backgroundColor: COLORS.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%', ...SHADOWS.large },
  panelHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  panelTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.primaryDark },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  markAllButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  markAllText: { fontSize: 12, fontWeight: '600', color: COLORS.orange500 },
  closeButton: { padding: 4 },
  panelContent: { maxHeight: 420 },
  loadingContainer: { paddingVertical: 48, alignItems: 'center' },
  notificationItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  notificationItemUnread: { backgroundColor: COLORS.orange10040 },
  iconContainer: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  notificationContent: { flex: 1, minWidth: 0 },
  notificationHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  notificationTitle: { fontSize: 14, fontWeight: '500', color: COLORS.textPrimary },
  notificationTitleUnread: { fontWeight: '600', color: COLORS.primaryDark },
  unreadDot: { width: 8, height: 8, borderRadius: 4 },
  notificationMessage: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  notificationDate: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  emptyContainer: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: SPACING.lg },
  emptyIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.gray100, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  emptyText: { fontSize: 14, fontWeight: '500', color: COLORS.textSecondary },
  emptySubtext: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
});
