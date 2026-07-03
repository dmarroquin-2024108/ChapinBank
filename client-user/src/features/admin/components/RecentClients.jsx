import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING } from '../../../shared/constants/theme';

const AVATAR_COLORS = [COLORS.primaryDark, COLORS.orange500, COLORS.gold];

const getInitials = (name = '', surname = '') =>
  `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();

export const RecentClients = ({ users = [] }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Clientes recientes</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Usuarios')}>
          <Text style={styles.viewAllText}>Ver todos</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.list}>
        {users.length === 0 ? (
          <Text style={styles.emptyText}>Sin clientes recientes</Text>
        ) : (
          users.map((user, i) => (
            <TouchableOpacity
              key={user.idUser}
              style={styles.clientItem}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] },
                ]}
              >
                <Text style={styles.avatarText}>{getInitials(user.name, user.surname)}</Text>
              </View>
              <Text style={styles.clientName} numberOfLines={1}>
                {user.name} {user.surname}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  user.status ? styles.statusActive : styles.statusInactive,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    user.status ? styles.statusTextActive : styles.statusTextInactive,
                  ]}
                >
                  {user.status ? 'activo' : 'inhabilitado'}
                </Text>
              </View>
              <ChevronRight size={14} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.orange500,
  },
  list: {
    flexDirection: 'column',
    gap: 8,
    maxHeight: 200,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: 16,
  },
  clientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 8,
    borderRadius: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  clientName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: COLORS.blue100,
  },
  statusInactive: {
    backgroundColor: COLORS.orange100,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusTextActive: {
    color: COLORS.blue700,
  },
  statusTextInactive: {
    color: COLORS.orange500,
  },
});
