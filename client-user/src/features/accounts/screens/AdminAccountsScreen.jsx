import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { CreditCard, CheckSquare, XSquare, DollarSign, Power, PowerOff } from 'lucide-react-native';
import { useAdminStore } from '../../admin/store/adminStore';
import AccountDetailModal from '../components/AccountDetailModal';
import ConfirmModal from '../../../shared/components/common/ConfirmModal';
import LoadingSpinner from '../../../shared/components/common/LoadingSpinner';
import EmptyState from '../../../shared/components/common/EmptyState';
import Header from '../../../shared/components/common/Header';
import { formatBalance } from '../../../shared/utils/formatters';
import { COLORS, SPACING, SHADOWS } from '../../../shared/constants/theme';
import { showToast } from '../../../shared/components/common/Toast';

const AdminAccountsScreen = () => {
  const { accounts, accountsList, loadings, getAllAccounts, getAccountsList, toggleAccount } = useAdminStore();
  const [detailAccount, setDetailAccount] = useState(null);
  const [confirmData, setConfirmData] = useState(null);

  useEffect(() => {
    getAllAccounts();
    getAccountsList();
  }, []);

  const handleToggleConfirm = async () => {
    if (!confirmData) return;
    const { account } = confirmData;
    setConfirmData(null);
    const result = await toggleAccount({ accountNumber: account.accountNumber, currentStatus: account.status });
    if (result.success) {
      const action = result.newStatus ? 'habilitada' : 'deshabilitada';
      showToast(`Cuenta ${action} correctamente.`, 'success');
    } else {
      showToast(result.error ?? 'Error al cambiar el estado de la cuenta.', 'error');
    }
  };

  const handleToggleRequest = (account) => setConfirmData({ account });
  const handleDetailOpen = (account) => setDetailAccount(account);
  const isLoadingStats = loadings.accounts || loadings.accountsList;

  const stats = useMemo(
    () => ({
      total: accounts?.total ?? 0,
      active: accounts?.active ?? 0,
      disabled: accounts?.disabled ?? 0,
      totalBalance: accounts?.totalBalance ?? null,
    }),
    [accounts]
  );

  const StatCard = ({ title, value, color }) => {
    const backgroundColor = color === 'dark' ? COLORS.primaryDark : color === 'orange' ? COLORS.accent : COLORS.gold;
    return (
      <View style={[styles.statCard, { backgroundColor }]}>
        <Text style={styles.statValue}>{isLoadingStats ? '...' : value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    );
  };

  const AccountListItem = ({ account }) => {
    const isActive = account.status;
    return (
      <View style={styles.accountItem}>
        <View style={styles.accountInfo}>
          <Text style={styles.accountNumber}>{account.accountNumber}</Text>
          <Text style={styles.accountOwner}>{account.ownerName ?? '—'}</Text>
          <Text style={styles.accountUsername}>{account.ownerUsername ? `@${account.ownerUsername}` : ''}</Text>
        </View>
        <View style={styles.accountDetails}>
          <Text style={styles.accountBalance}>{formatBalance(account.balance)}</Text>
          <Text style={styles.accountType}>{account.accountType}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: isActive ? '#dbeafe' : COLORS.orange100 }]}>
          {isActive ? <CheckSquare size={11} color={COLORS.info} /> : <XSquare size={11} color={COLORS.orange600} />}
          <Text style={[styles.statusText, { color: isActive ? COLORS.info : COLORS.orange600 }]}>{isActive ? 'Activa' : 'Inhabilitada'}</Text>
        </View>
        <TouchableOpacity onPress={() => handleToggleRequest(account)} style={styles.toggleButton}>
          {isActive ? <PowerOff size={15} color={COLORS.orange400} /> : <Power size={15} color={COLORS.info} />}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.screenContainer}>
      <Header title="Gestión de cuentas" showMenu/>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Gestión de cuentas</Text>
        <Text style={styles.headerSubtitle}>Consulta el estado de todas las cuentas bancarias</Text>

        <View style={styles.statsContainer}>
          <StatCard title="Total cuentas" value={stats.total} color="dark" />
          <StatCard title="Activas" value={stats.active} color="orange" />
          <StatCard title="Inhabilitadas" value={stats.disabled} color="gold" />
          <StatCard title="Saldo total" value={stats.totalBalance != null ? formatBalance(stats.totalBalance) : '—'} color="dark" />
        </View>

        {loadings.accountsList ? (
          <LoadingSpinner />
        ) : accountsList.length === 0 ? (
          <EmptyState message="No hay cuentas registradas" />
        ) : (
          <FlatList
            data={accountsList}
            keyExtractor={(item) => item.accountNumber}
            renderItem={({ item }) => <AccountListItem account={item} />}
            contentContainerStyle={styles.listContent}
          />
        )}

        <AccountDetailModal visible={!!detailAccount} onClose={() => setDetailAccount(null)} accountNumber={detailAccount?.accountNumber} />

        <ConfirmModal
          visible={!!confirmData}
          title={confirmData?.account && !confirmData.account.status ? 'Habilitar cuenta' : 'Deshabilitar cuenta'}
          description={confirmData?.account ? `¿${confirmData.account.status ? 'Deshabilitar' : 'Habilitar'} la cuenta "${confirmData.account.accountNumber}" de ${confirmData.account.ownerName}?` : ''}
          confirmLabel={confirmData?.account && !confirmData.account.status ? 'Habilitar' : 'Deshabilitar'}
          onConfirm={handleToggleConfirm}
          onCancel={() => setConfirmData(null)}
          loading={loadings.action}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, padding: SPACING.lg },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primaryDark },
  headerSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4, marginBottom: 10},
  statsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  statCard: { flex: 1, minWidth: '45%', padding: SPACING.md, borderRadius: 12, ...SHADOWS.small },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  statTitle: { fontSize: 12, color: 'rgba(255, 255, 255, 0.8)', marginTop: 4 },
  listContent: { backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.small },
  accountItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, paddingHorizontal: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  accountInfo: { flex: 2 },
  accountNumber: { fontSize: 14, fontWeight: '600', color: COLORS.primaryDark },
  accountOwner: { fontSize: 14, color: COLORS.textSecondary },
  accountUsername: { fontSize: 12, color: COLORS.textSecondary },
  accountDetails: { flex: 1, alignItems: 'center' },
  accountBalance: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  accountType: { fontSize: 12, color: COLORS.textSecondary },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: '600' },
  toggleButton: { padding: SPACING.xs },
});

export default AdminAccountsScreen;
