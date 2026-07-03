import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Trash2, CheckCircle, XCircle } from 'lucide-react-native';
import { COLORS, SPACING } from '../../../shared/constants/theme';

const AVATAR_COLORS = [COLORS.primary, COLORS.accent, COLORS.gold];

const ROLE_LABELS = {
  SUPERADMIN_ROLE: { label: 'Super Admin', backgroundColor: COLORS.gold, textColor: '#fff' },
  ADMIN_ROLE: { label: 'Admin', backgroundColor: COLORS.orange500, textColor: '#fff' },
  USER_ROLE: { label: 'Usuario', backgroundColor: COLORS.primary, textColor: '#fff' },
};

const getInitials = (name = '', surname = '') =>
  `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-GT');
};

const UserListItem = ({ user, index, onDelete }) => {
  const role = ROLE_LABELS[user.role] ?? ROLE_LABELS['USER_ROLE'];
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];

  const getStatusBadge = () => {
    if (user.isDeleted) {
      return (
        <View style={[styles.statusBadge, { backgroundColor: COLORS.orange100 }]}>
          <XCircle size={12} color={COLORS.orange600} />
          <Text style={[styles.statusText, { color: COLORS.orange600 }]}>Eliminado</Text>
        </View>
      );
    }
    if (user.status) {
      return (
        <View style={[styles.statusBadge, { backgroundColor: '#dbeafe' }]}>
          <CheckCircle size={12} color={COLORS.info} />
          <Text style={[styles.statusText, { color: COLORS.info }]}>Activo</Text>
        </View>
      );
    }
    return (
      <View style={[styles.statusBadge, { backgroundColor: COLORS.orange100 }]}>
        <XCircle size={12} color={COLORS.orange600} />
        <Text style={[styles.statusText, { color: COLORS.orange600 }]}>Sin activar</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarText}>{getInitials(user.name, user.surname)}</Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName} numberOfLines={1}>
            {user.name} {user.surname}
          </Text>
          <Text style={styles.userMeta} numberOfLines={1}>@{user.username}</Text>
          <Text style={styles.userDate} numberOfLines={1}>{formatDate(user.createdAt)}</Text>
          <Text style={styles.userEmail} numberOfLines={1}>{user.email}</Text>
        </View>
      </View>

      <View style={styles.badgesColumn}>
        <View style={[styles.roleBadge, { backgroundColor: role.backgroundColor }]}>
          <Text style={[styles.roleText, { color: role.textColor }]}>{role.label}</Text>
        </View>
        {getStatusBadge()}
      </View>

      <View style={styles.actions}>
        {user.status && !user.isDeleted && (
          <TouchableOpacity
            onPress={() => onDelete(user)}
            style={styles.deleteButton}
          >
            <Trash2 size={16} color={COLORS.orange400} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  avatarText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  userMeta: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  userDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  userEmail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  badgesColumn: {
    width: 100,
    alignItems: 'flex-end',
    gap: 4,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  actions: {
    flex: 0,
    alignItems: 'center',
    marginLeft: SPACING.xs,
  },
  deleteButton: {
    padding: SPACING.xs,
  },
});

export default UserListItem;