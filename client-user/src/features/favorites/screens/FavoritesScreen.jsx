import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { Plus, Star, Search, Send, Pencil, Trash2 } from 'lucide-react-native';
import { useFavorites } from '../hooks/useFavorites';
import { formatDate } from '../../../shared/utils/formatters';
import { COLORS, SPACING, SHADOWS } from '../../../shared/constants/theme';
import { showToast } from '../../../shared/components/common/Toast';
import AddFavoriteModal from '../components/AddFavoriteModal';
import QuickTransferModal from '../components/QuickTransferModal';
import DeleteFavoriteModal from '../components/DeleteFavoriteModal';

const AVATAR_COLORS = [COLORS.accent, COLORS.primaryDark, COLORS.gold];

const getInitials = (alias) =>
  alias
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || '?';

const getAvatarColor = (id) => {
  if (!id) return AVATAR_COLORS[0];
  const charCode = id.charCodeAt(id.length - 1);
  return AVATAR_COLORS[charCode % AVATAR_COLORS.length];
};

const StatCard = ({ title, value, color, icon }) => (
  <View style={[styles.statCard, { backgroundColor: color }]}>
    <View style={styles.statContent}>
      <Text style={styles.statLabel}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>

  </View>
);

const FavoriteItem = ({ item, onQuickTransfer, onEdit, onDelete }) => (
  <View style={styles.favoriteItem}>
    <View style={[styles.avatar, { backgroundColor: getAvatarColor(item._id) }]}>
      <Text style={styles.avatarText}>{getInitials(item.alias)}</Text>
    </View>
    <View style={styles.favoriteInfo}>
      <Text style={styles.favoriteAlias}>{item.alias}</Text>
      <Text style={styles.favoriteAccount}>{item.accountNumber}</Text>
    </View>
    <View style={[styles.typeBadge, item.accountType === 'AHORRO' ? styles.typeBadgeAhorro : styles.typeBadgeMonetaria]}>
      <Text style={styles.typeBadgeText}>{item.accountType}</Text>
    </View>
    <View style={styles.actionsContainer}>
      <TouchableOpacity onPress={() => onQuickTransfer(item)} style={styles.actionButton} title="Transferencia rápida">
        <Send size={13} color={COLORS.gold} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onEdit(item)} style={styles.actionButton} title="Editar alias">
        <Pencil size={13} color={COLORS.textSecondary} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(item)} style={styles.actionButton} title="Eliminar">
        <Trash2 size={13} color={COLORS.error} />
      </TouchableOpacity>
    </View>
  </View>
);

const FavoritesScreen = ({ rightAction }) => {
  const { favorites, filtered, loadings, search, setSearch, ahorro, monetaria } = useFavorites();
  const [modalState, setModalState] = useState({ open: false, mode: 'add', data: {} });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [txTarget, setTxTarget] = useState(null);

  const openAdd = () => setModalState({ open: true, mode: 'add', data: {} });
  const openEdit = (fav) => setModalState({ open: true, mode: 'edit', data: fav });
  const closeModal = () => setModalState((s) => ({ ...s, open: false }));

  const handleQuickTransfer = (fav) => setTxTarget(fav);
  const handleDelete = (fav) => setDeleteTarget(fav);

  return (
    <View style={styles.screenContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Cuentas favoritas</Text>
            <Text style={styles.headerSubtitle}>Administra tus cuentas de transferencia frecuente</Text>
          </View>
          <TouchableOpacity onPress={openAdd} style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Agregar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <StatCard title="Total" value={favorites.length} color={COLORS.primaryDark} />
          <StatCard title="Ahorro" value={ahorro} color={COLORS.accent} />
          <StatCard title="Monetaria" value={monetaria} color={COLORS.gold} />
        </View>

        <View style={styles.searchContainer}>
          <Search size={15} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar por alias o número de cuenta..."
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        <View style={styles.listContainer}>
          {loadings.favorites ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.accent} />
              <Text style={styles.loadingText}>Cargando favoritos…</Text>
            </View>
          ) : filtered.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Star size={32} color={COLORS.textSecondary} style={styles.emptyIcon} />
              <Text style={styles.emptyText}>
                {search ? 'Sin resultados para tu búsqueda' : 'No tienes favoritos registrados'}
              </Text>
              {!search && (
                <Text style={styles.emptySubtext}>Agrega una cuenta para hacer transferencias rápidas</Text>
              )}
            </View>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <FavoriteItem
                  item={item}
                  onQuickTransfer={handleQuickTransfer}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              )}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>

      <AddFavoriteModal
        isOpen={modalState.open}
        onClose={closeModal}
        mode={modalState.mode}
        initialData={modalState.data}
      />
      <DeleteFavoriteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        favorite={deleteTarget}
      />
      <QuickTransferModal
        isOpen={!!txTarget}
        onClose={() => setTxTarget(null)}
        favorite={txTarget}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, marginBottom: SPACING.lg },
  headerText: { flex: 1, marginRight: SPACING.md },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primaryDark },
  headerSubtitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  addButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.accent, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, ...SHADOWS.small },
  addButtonText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  statsContainer: { flexDirection: 'row', gap: SPACING.sm, paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  statCard: { flex: 1, borderRadius: 16, padding: SPACING.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', ...SHADOWS.small },
  statContent: { flex: 1 },
  statLabel: { fontSize: 10, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: '800', color: '#fff' },
  statIconContainer: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  searchIcon: { position: 'absolute', left: SPACING.lg + 12, zIndex: 1 },
  searchInput: { flex: 1, paddingLeft: 40, paddingRight: SPACING.md, paddingVertical: 12, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, backgroundColor: COLORS.surface, fontSize: 14, color: COLORS.textPrimary },
  listContainer: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg },
  loadingContainer: { alignItems: 'center', paddingVertical: SPACING.xl },
  loadingText: { fontSize: 14, color: COLORS.textSecondary, marginTop: SPACING.sm },
  emptyContainer: { alignItems: 'center', paddingVertical: SPACING.xl },
  emptyIcon: { marginBottom: SPACING.md },
  emptyText: { fontSize: 14, fontWeight: '500', color: COLORS.textSecondary, textAlign: 'center' },
  emptySubtext: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  favoriteItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: SPACING.sm, marginBottom: SPACING.xs },
  avatar: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
  favoriteInfo: { flex: 1, minWidth: 0, flexShrink:1 },
  favoriteAlias: { fontSize: 14, fontWeight: '600', color: COLORS.primaryDark },
  favoriteAccount: { fontSize: 12, color: COLORS.textSecondary, fontFamily: 'monospace' },
  typeBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 12 },
  typeBadgeAhorro: { backgroundColor: COLORS.blue100 },
  typeBadgeMonetaria: { backgroundColor: COLORS.orange100 },
  typeBadgeText: { fontSize: 10, fontWeight: 'bold', color: COLORS.primaryDark },
  actionsContainer: { flexDirection: 'row', gap: 2},
  actionButton: { width: 24, height: 24, borderRadius: 6, borderWidth: 1, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
});

export default FavoritesScreen;
