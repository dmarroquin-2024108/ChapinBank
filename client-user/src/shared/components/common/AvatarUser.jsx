import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { COLORS, SPACING, SHADOWS } from '../../constants/theme';
import ProfileModal from '../../../features/users/components/ProfileModal';

const AvatarUser = ({ onLogout }) => {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const getInitials = () => {
    if (user?.username) {
      return user.username.slice(0, 2).toUpperCase();
    }
    if (user?.name && user?.surname) {
      return `${user.name[0]}${user.surname[0]}`.toUpperCase();
    }
    return 'AD';
  };

  const getFullName = () => {
    if (user?.name && user?.surname) {
      return `${user.name} ${user.surname}`;
    }
    return user?.username || 'Usuario';
  };

  const handleOpenProfile = () => {
    setOpen(false);
    setTimeout(() => setShowProfile(true), 50);
  };

  return (
    <>
      <TouchableOpacity onPress={() => setOpen(!open)} style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitials()}</Text>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View style={styles.dropdown}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownName}>{getFullName()}</Text>
              <Text style={styles.dropdownEmail}>{user?.email || ''}</Text>
            </View>

            <TouchableOpacity style={styles.dropdownItem} onPress={handleOpenProfile}>
              <Text style={styles.dropdownItemText}>Mi Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dropdownItem, styles.dropdownItemDanger]}
              onPress={onLogout}
            >
              <Text style={[styles.dropdownItemText, styles.dropdownItemTextDanger]}>
                Cerrar Sesión
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <ProfileModal visible={showProfile} onClose={() => setShowProfile(false)} userBase={user} />
    </>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.accent,
    borderWidth: 2,
    borderColor: 'rgba(242, 140, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: SPACING.md,
  },
  dropdown: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    width: 250,
    ...SHADOWS.medium,
  },
  dropdownHeader: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
  },
  dropdownName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
  },
  dropdownEmail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  dropdownItem: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  dropdownItemDanger: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  dropdownItemText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  dropdownItemTextDanger: {
    color: COLORS.error,
  },
});

export default AvatarUser;
