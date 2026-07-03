import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { History, Loader2, AlertCircle, SlidersHorizontal, Search } from 'lucide-react-native';
import { useHistoryStore } from '../store/historyStore';
import { useAccountStore } from '../../accounts/store/accountsStore';
import { MovementCard } from '../components/MovementCard';
import { COLORS, SPACING, SHADOWS } from '../../../shared/constants/theme';
import { showToast } from '../../../shared/components/common/Toast';
import CustomSelect from '../../../shared/components/common/CustomSelect';

const FILTER_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'DEPOSIT', label: 'Depósitos' },
  { value: 'DEPOSIT_REVERT', label: 'Reversiones' },
  { value: 'TRANSFER', label: 'Transferencias' },
  { value: 'TRANSACTION', label: 'Transacciones' },
];

const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <History size={40} color={COLORS.textSecondary} strokeWidth={1.5} />
    <Text style={styles.emptyText}>Sin movimientos registrados</Text>
    <Text style={styles.emptySubtext}>Selecciona una cuenta o realiza tu primera operación</Text>
  </View>
);

const LoadingState = () => (
  <View style={styles.loadingContainer}>
    <Loader2 size={18} color={COLORS.textSecondary} style={{ transform: [{ rotate: '45deg' }] }} />
    <Text style={styles.loadingText}>Cargando movimientos…</Text>
  </View>
);

const ErrorState = ({ message }) => (
  <View style={styles.errorContainer}>
    <AlertCircle size={16} color={COLORS.orange500} />
    <Text style={styles.errorText}>{message}</Text>
  </View>
);

const AccountHistoryScreen = ({ rightAction }) => {
  const {
    accountHistory,
    selectedAccountNumber,
    loadings,
    errors,
    fetchAccountHistory,
    clearAccountHistory,
  } = useHistoryStore();
  const { accounts, fetchAccounts } = useAccountStore();

  const [accountsLoading, setAccountsLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [filterType, setFilterType] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAccounts()
      .then((data) => {
        const list = data ?? [];
        if (list.length > 0) {
          const first = list[0].accountNumber;
          setSelectedAccount(first);
          fetchAccountHistory(first);
        }
      })
      .catch(() => {})
      .finally(() => setAccountsLoading(false));

    return () => clearAccountHistory();
  }, [fetchAccounts, fetchAccountHistory, clearAccountHistory]);

  const handleAccountChange = (accountNumber) => {
    setSelectedAccount(accountNumber);
    setFilterType('');
    setSearch('');
    if (accountNumber) {
      fetchAccountHistory(accountNumber);
    } else {
      clearAccountHistory();
    }
  };

  const filteredHistory = accountHistory.filter((m) => {
    const matchType = filterType === '' || m.type === filterType;
    const matchSearch =
      search === '' ||
      (m.description ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (m.type ?? '').toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const isLoading = loadings.accountHistory || accountsLoading;
  const hasError = errors.accountHistory;

  return (
    <View style={styles.screenContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <History size={22} color={COLORS.primaryDark} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Historial de movimientos</Text>
            <Text style={styles.headerSubtitle}>Consulta todos los movimientos de tus cuentas</Text>
          </View>
        </View>

        <View style={styles.controlsCard}>
          <View style={styles.controlsRow}>
            <View style={styles.controlHalf}>
              <Text style={styles.controlLabel}>Cuenta bancaria</Text>
              <CustomSelect
                value={selectedAccount}
                onChange={handleAccountChange}
                disabled={accountsLoading}
                options={accounts.map((acc) => ({
                  value: acc.accountNumber,
                  label: `${acc.accountNumber}${acc.accountType ? ` · ${acc.accountType}` : ''}`,
                }))}
              />
            </View>

            <View style={styles.controlHalf}>
              <Text style={styles.controlLabel}>Filtrar por tipo</Text>
              <CustomSelect
                value={filterType}
                onChange={setFilterType}
                disabled={!selectedAccount || isLoading}
                options={FILTER_OPTIONS}
              />
            </View>
          </View>

          <View style={styles.searchRow}>
            <Search size={15} color={COLORS.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar por descripción..."
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          {!isLoading && filteredHistory.length > 0 && (
            <Text style={styles.summaryText}>
              Mostrando <Text style={styles.summaryBold}>{filteredHistory.length}</Text> movimiento{filteredHistory.length !== 1 ? 's' : ''}
              {selectedAccount && (
                <>
                  {' '}para la cuenta{' '}
                  <Text style={[styles.summaryBold, styles.summaryMono]}>{selectedAccount}</Text>
                </>
              )}
            </Text>
          )}
        </View>

        <View style={styles.listCard}>
          {hasError ? (
            <View style={styles.errorPadding}>
              <ErrorState message={hasError} />
            </View>
          ) : isLoading ? (
            <LoadingState />
          ) : filteredHistory.length === 0 ? (
            <EmptyState />
          ) : (
            <View>
              {filteredHistory.map((mov) => (
                <MovementCard key={mov.id ?? mov._id} mov={mov} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, marginBottom: SPACING.lg },
  headerIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: COLORS.primaryDark10, justifyContent: 'center', alignItems: 'center' },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.primaryDark },
  headerSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  controlsCard: { backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOWS.small },
  controlsRow: { flexDirection: 'row', gap: SPACING.md },
  controlHalf: { flex: 1 },
  controlLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 6 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: SPACING.md },
  searchIcon: { position: 'absolute', left: 12, zIndex: 1 },
  searchInput: { flex: 1, paddingLeft: 36, paddingRight: SPACING.md, paddingVertical: 10, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, backgroundColor: COLORS.background, fontSize: 14, color: COLORS.textPrimary },
  summaryText: { fontSize: 12, color: COLORS.textSecondary, marginTop: 12 },
  summaryBold: { fontWeight: '600', color: COLORS.primaryDark },
  summaryMono: { fontFamily: 'monospace' },
  listCard: { backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.small, overflow: 'hidden' },
  errorPadding: { padding: SPACING.md },
  errorContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.orange100, borderRadius: 12, paddingHorizontal: SPACING.md, paddingVertical: 12 },
  errorText: { fontSize: 14, color: COLORS.orange500 },
  emptyContainer: { alignItems: 'center', paddingVertical: 64, gap: 12 },
  emptyText: { fontSize: 14, fontWeight: '500', color: COLORS.textSecondary },
  emptySubtext: { fontSize: 12, color: COLORS.textSecondary },
  loadingContainer: { alignItems: 'center', paddingVertical: 64, gap: 8 },
  loadingText: { fontSize: 14, color: COLORS.textSecondary },
  selectContainer: { position: 'relative' },
  selectButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.sm, paddingVertical: 10, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, backgroundColor: COLORS.background },
  selectButtonDisabled: { opacity: 0.6 },
  selectText: { fontSize: 14, color: COLORS.primaryDark },
  selectTextDisabled: { color: COLORS.textSecondary },
  selectArrow: { fontSize: 10, color: COLORS.textSecondary },
  selectDropdown: { backgroundColor: COLORS.surface, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.large, maxHeight: 200 },
  selectOption: { padding: SPACING.sm, paddingHorizontal: SPACING.md },
  selectOptionSelected: { backgroundColor: COLORS.primaryDark10 },
  selectOptionText: { fontSize: 14, color: COLORS.textPrimary },
  selectOptionTextSelected: { color: COLORS.primaryDark, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: SPACING.lg },
});

export default AccountHistoryScreen;
