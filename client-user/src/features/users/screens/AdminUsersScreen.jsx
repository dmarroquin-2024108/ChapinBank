import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { UserPlus, Search } from 'lucide-react-native';
import { useAdminStore } from '../../admin/store/adminStore';
import { useAuthStore } from '../../../shared/store/authStore';
import CreateUserModal from '../components/CreateUserModal';
import UserListItem from '../components/UserListItem';
import ConfirmModal from '../../../shared/components/common/ConfirmModal';
import LoadingSpinner from '../../../shared/components/common/LoadingSpinner';
import EmptyState from '../../../shared/components/common/EmptyState';
import Header from '../../../shared/components/common/Header';
import { COLORS, SPACING, SHADOWS } from '../../../shared/constants/theme';
import { showToast } from '../../../shared/components/common/Toast';

const AdminUsersScreen = () => {
  const { user } = useAuthStore();
  const { getAllUsers, deleteUser, users, loadings } = useAdminStore();
  const [showCreate, setShowCreate] = useState(false);
  const [confirmData, setConfirmData] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const safeUsers = Array.isArray(users) ? users : [];

  const filtered = useMemo(() => {
    if (!search.trim()) return safeUsers;
    const q = search.toLowerCase();
    return safeUsers.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.surname?.toLowerCase().includes(q) ||
        u.username?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
    );
  }, [search, safeUsers]);

  const stats = useMemo(
    () => ({
      total: safeUsers.length,
      active: safeUsers.filter((u) => u.status).length,
      pending: safeUsers.filter((u) => !u.status && !u.isDeleted).length,
      deleted: safeUsers.filter((u) => u.isDeleted).length,
    }),
    [safeUsers]
  );

  const handleDeleteConfirm = async () => {
    if (!confirmData) return;
    const { userId } = confirmData;
    setConfirmData(null);
    try {
      const response = await deleteUser(userId);
      if (response?.success) {
        showToast('Usuario deshabilitado correctamente.', 'success');
      } else {
        showToast(response?.error ?? 'Error al deshabilitar el usuario.', 'error');
      }
    } catch {
      showToast('Error inesperado al deshabilitar el usuario.', 'error');
    }
  };

  const handleCreateClose = useCallback(
    (created = false) => {
      setShowCreate(false);
      if (created) getAllUsers();
    },
    [getAllUsers]
  );

  const StatCard = ({ title, value, color }) => {
    const backgroundColor = color === 'dark' ? COLORS.primaryDark : color === 'orange' ? COLORS.accent : COLORS.gold;
    return (
      <View style={[styles.statCard, { backgroundColor }]}>
        <Text style={styles.statValue}>{loadings.users ? '...' : value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    );
  };

  return (
    <View style={styles.screenContainer}>
      <Header title="Gestión de usuarios" showMenu/>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>
            Registra nuevos clientes y consulta los usuarios del banco
          </Text>
        </View>

      <View style={styles.statsContainer}>
        <StatCard title="Total" value={stats.total} color="dark" />
        <StatCard title="Activos" value={stats.active} color="orange" />
        <StatCard title="Sin Activar" value={stats.pending} color="gold" />
        <StatCard title="Inhabilitados" value={stats.deleted} color="dark" />
      </View>

      <View style={styles.searchBarContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={15} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar por nombre, usuario o correo..."
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>
        <TouchableOpacity
          onPress={() => setShowCreate(true)}
          style={styles.createButton}
        >
          <UserPlus size={16} color="#fff" />
          <Text style={styles.createButtonText}>Registrar usuario</Text>
        </TouchableOpacity>
      </View>

      {loadings.users ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <EmptyState
          message={search ? 'Sin resultados para la búsqueda.' : 'No hay usuarios registrados.'}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.idUserResponse}
          renderItem={({ item, index }) => (
            <UserListItem
              user={item}
              index={index}
              onDelete={(u) =>
                setConfirmData({
                  userId: u.idUserResponse,
                  fullName: `${u.name} ${u.surname}`,
                })
              }
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
      </View>

      <CreateUserModal
        visible={showCreate}
        onClose={handleCreateClose}
        currentUserRole={user?.role}
      />

      <ConfirmModal
        visible={!!confirmData}
        title="Deshabilitar usuario"
        description={`¿Estás seguro de deshabilitar a "${confirmData?.fullName}"? El usuario perderá acceso al sistema.`}
        confirmLabel="Deshabilitar"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmData(null)}
        loading={loadings.action}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: SPACING.md,
    borderRadius: 12,
    ...SHADOWS.small,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statTitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  searchBarContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: SPACING.sm,
    gap: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.sm,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 12,
    ...SHADOWS.medium,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  listContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
});

export default AdminUsersScreen;
