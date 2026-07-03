import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, useWindowDimensions } from 'react-native';
import { History, Loader2, AlertCircle, BarChart3, RefreshCw, ChevronRight, ChevronLeft, Wallet, PiggyBank } from 'lucide-react-native';
import { useHistoryStore } from '../store/historyStore';
import { MovementCard } from '../components/MovementCard';
import { COLORS, SPACING, SHADOWS } from '../../../shared/constants/theme';
import { showToast } from '../../../shared/components/common/Toast';
import Header from '../../../shared/components/common/Header';
import CustomSelect from '../../../shared/components/common/CustomSelect';
import { accountsClient } from '../../../shared/api/authClient';

const LoadingState = () => (
  <View style={styles.loadingContainer}>
    <Loader2 size={18} color={COLORS.textSecondary} style={{ transform: [{ rotate: '45deg' }] }} />
    <Text style={styles.loadingText}>Cargando...</Text>
  </View>
);

const ErrorState = ({ message }) => (
  <View style={styles.errorContainer}>
    <AlertCircle size={16} color={COLORS.error} />
    <Text style={styles.errorText}>{message}</Text>
  </View>
);

const EmptyState = ({ message = 'Sin datos registrados' }) => (
  <View style={styles.emptyContainer}>
    <History size={36} color={COLORS.textSecondary} strokeWidth={1.5} />
    <Text style={styles.emptyText}>{message}</Text>
  </View>
);

const AccountMovementRow = ({ item, index }) => (
  <View style={styles.movementRow}>
    <View style={[
      styles.rankBadge,
      index === 0 ? styles.rankGold : index === 1 ? styles.rankBlue : index === 2 ? styles.rankOrange : styles.rankDefault
    ]}>
      <Text style={styles.rankText}>{index + 1}</Text>
    </View>
    <Text style={styles.accountNumber}>{item.accountNumber}</Text>
    <View style={styles.movementCount}>
      <Text style={styles.movementCountText}>{item.totalMovements}</Text>
      <Text style={styles.movementCountLabel}>mov.</Text>
    </View>
  </View>
);

const AccountCard = ({ account, selected, onClick }) => {
  const isMonetaria = account.accountType === 'MONETARIA';
  const Icon = isMonetaria ? Wallet : PiggyBank;

  return (
    <TouchableOpacity
      onPress={onClick}
      style={[styles.accountCard, selected ? styles.accountCardSelected : styles.accountCardDefault]}
    >
      <View style={[styles.accountIcon, isMonetaria ? styles.accountIconMonetaria : styles.accountIconAhorro]}>
        <Icon size={16} color={isMonetaria ? COLORS.orange500 : COLORS.blue600} />
      </View>
      <View style={styles.accountInfo}>
        <Text style={styles.accountNumberText}>{account.accountNumber}</Text>
        <Text style={styles.accountOwner}>{account.ownerName ?? '—'}</Text>
      </View>
      <ChevronRight size={14} color={selected ? COLORS.primaryDark : COLORS.border} />
    </TouchableOpacity>
  );
};

const AdminBankHistoryScreen = ({ rightAction }) => {
  const {
    bankHistory,
    accountsByMovements,
    adminFilteredHistory,
    loadings,
    errors,
    fetchBankHistory,
    fetchAccountsByMovements,
    fetchAdminFilteredHistory,
  } = useHistoryStore();

  const { width } = useWindowDimensions();
  const isCompact = width < 700;
  const [rankOrder, setRankOrder] = useState('desc');
  const [allAccounts, setAllAccounts] = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('MONETARIA');
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    fetchBankHistory();
    fetchAccountsByMovements(rankOrder);
    loadAccounts();
  }, [fetchBankHistory, fetchAccountsByMovements, rankOrder]);

  const loadAccounts = async () => {
    setAccountsLoading(true);
    try {
      const { data } = await accountsClient.get('/accounts/admin/all');
      setAllAccounts(data.data ?? data.accounts ?? data ?? []);
    } catch {
      setAllAccounts([]);
    } finally {
      setAccountsLoading(false);
    }
  };

  const handleSelectAccount = (account) => {
    setSelectedAccount(account);
    fetchAdminFilteredHistory({ accountNumber: account.accountNumber, limit: 5 });
  };

  const handleOrderChange = (value) => {
    setRankOrder(value);
    fetchAccountsByMovements(value);
  };

  const filteredAccounts = allAccounts.filter((a) => a.accountType === typeFilter);

  return (
    <View style={styles.screenContainer}>
      <Header title="Historial del banco" showMenu />
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <History size={22} color={COLORS.primaryDark} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Historial del banco</Text>
              <Text style={styles.headerSubtitle}>Consulta movimientos por cuenta o revisa la actividad global</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              fetchBankHistory();
              fetchAccountsByMovements(rankOrder);
            }}
            disabled={loadings.bankHistory}
            style={[styles.refreshButton, loadings.bankHistory && styles.refreshButtonDisabled]}
          >
            <RefreshCw size={14} color="#fff" style={loadings.bankHistory && { transform: [{ rotate: '45deg' }] }} />
            <Text style={styles.refreshButtonText}>Actualizar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.accountSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Movimientos por cuenta</Text>
            <View style={styles.typeTabs}>
              {['MONETARIA', 'AHORRO'].map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => {
                    setTypeFilter(type);
                    setSelectedAccount(null);
                  }}
                  style={[styles.typeTab, typeFilter === type ? styles.typeTabActive : styles.typeTabInactive]}
                >
                  {type === 'MONETARIA' ? <Wallet size={13} color={typeFilter === type ? '#fff' : COLORS.textSecondary} /> : <PiggyBank size={13} color={typeFilter === type ? '#fff' : COLORS.textSecondary} />}
                  <Text style={[styles.typeTabText, typeFilter === type ? styles.typeTabTextActive : styles.typeTabTextInactive]}>
                    {type === 'MONETARIA' ? 'Cuentas Monetarias' : 'Cuentas Ahorro'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={[styles.accountGrid, isCompact && styles.accountGridCompact]}>
            {/* Lista de cuentas: se oculta en modo compacto cuando ya hay una cuenta seleccionada */}
            {(!isCompact || !selectedAccount) && (
              <View style={[styles.accountsList, isCompact && styles.accountsListCompact]}>
                <View style={styles.accountsListHeader}>
                  <Text style={styles.accountsListTitle}>
                    {filteredAccounts.length} cuenta{filteredAccounts.length !== 1 ? 's' : ''}
                  </Text>
                </View>
                <ScrollView style={styles.accountsScroll}>
                  {accountsLoading ? (
                    <LoadingState />
                  ) : filteredAccounts.length === 0 ? (
                    <Text style={styles.noAccountsText}>Sin cuentas de este tipo</Text>
                  ) : (
                    filteredAccounts.map((acc) => (
                      <AccountCard
                        key={acc.accountNumber}
                        account={acc}
                        selected={selectedAccount?.accountNumber === acc.accountNumber}
                        onClick={() => handleSelectAccount(acc)}
                      />
                    ))
                  )}
                </ScrollView>
              </View>
            )}

            {/* Movimientos: en modo compacto, solo se muestra cuando hay cuenta seleccionada */}
            {(!isCompact || selectedAccount) && (
              <View style={styles.accountMovements}>
                {!selectedAccount ? (
                  <View style={styles.selectPrompt}>
                    <ChevronRight size={32} color={COLORS.border} strokeWidth={1.5} />
                    <Text style={styles.selectPromptText}>Selecciona una cuenta para ver sus movimientos</Text>
                  </View>
                ) : (
                  <>
                    <View style={styles.selectedAccountHeader}>
                      {isCompact && (
                        <TouchableOpacity
                          onPress={() => setSelectedAccount(null)}
                          style={styles.backButton}
                        >
                          <ChevronLeft size={16} color={COLORS.primaryDark} />
                          <Text style={styles.backButtonText}>Volver a cuentas</Text>
                        </TouchableOpacity>
                      )}
                      <Text style={styles.selectedAccountNumber}>{selectedAccount.accountNumber}</Text>
                      <Text style={styles.selectedAccountInfo}>{selectedAccount.ownerName} · Últimos 5 movimientos</Text>
                    </View>
                    {errors.adminFilter ? (
                      <View style={styles.errorPadding}>
                        <ErrorState message={errors.adminFilter} />
                      </View>
                    ) : loadings.adminFilter ? (
                      <LoadingState />
                    ) : adminFilteredHistory.length === 0 ? (
                      <EmptyState message="Sin movimientos para esta cuenta" />
                    ) : (
                      <View>
                        {adminFilteredHistory.map((mov) => (
                          <MovementCard key={mov.id ?? mov._id} mov={mov} showAccount />
                        ))}
                      </View>
                    )}
                  </>
                )}
              </View>
            )}
          </View>
        </View>

        <View style={styles.recentSection}>
          <View style={styles.recentCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Movimientos recientes del banco</Text>
              {!loadings.bankHistory && bankHistory.length > 0 && (
                <Text style={styles.cardSubtitle}>{bankHistory.length} movimiento{bankHistory.length !== 1 ? 's' : ''}</Text>
              )}
            </View>
            {errors.bankHistory ? (
              <View style={styles.errorPadding}>
                <ErrorState message={errors.bankHistory} />
              </View>
            ) : loadings.bankHistory ? (
              <LoadingState />
            ) : bankHistory.length === 0 ? (
              <EmptyState message="Sin movimientos registrados en el banco" />
            ) : (
              <View>
                {bankHistory.map((mov, i) => (
                  <MovementCard key={mov.id ?? mov._id ?? i} mov={mov} showAccount />
                ))}
              </View>
            )}
          </View>

          <View style={styles.rankingCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <BarChart3 size={15} color={COLORS.orange500} />
                <Text style={styles.cardTitle}>Cuentas más activas</Text>
              </View>
              <CustomSelect
                value={rankOrder}
                onChange={handleOrderChange}
                disabled={loadings.accountsByMovements}
                options={[
                  { value: 'desc', label: 'Descendente' },
                  { value: 'asc', label: 'Ascendente' },
                ]}
              />
            </View>
            <Text style={styles.cardSubtitle}>Por número de movimientos</Text>
            {errors.accountsByMovements ? (
              <View style={styles.errorPadding}>
                <ErrorState message={errors.accountsByMovements} />
              </View>
            ) : loadings.accountsByMovements ? (
              <LoadingState />
            ) : accountsByMovements.length === 0 ? (
              <EmptyState message="Sin datos disponibles" />
            ) : (
              <View>
                {accountsByMovements.map((item, index) => (
                  <AccountMovementRow key={item.accountNumber} item={item} index={index} />
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  scrollContent: { paddingBottom: SPACING.xxl }, 
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, marginBottom: SPACING.lg },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  headerIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: COLORS.primaryDark10, justifyContent: 'center', alignItems: 'center' },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.primaryDark },
  headerSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  refreshButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.primaryDark, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  refreshButtonDisabled: { opacity: 0.6 },
  refreshButtonText: { fontSize: 14, color: '#fff' },
  accountSection: { backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.md, ...SHADOWS.small, overflow: 'hidden' },
  sectionHeader: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.primaryDark, marginBottom: 12 },
  typeTabs: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  typeTab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
  typeTabActive: { backgroundColor: COLORS.primaryDark, borderColor: COLORS.primaryDark },
  typeTabInactive: { borderColor: COLORS.border },
  typeTabText: { fontSize: 12, fontWeight: '600' },
  typeTabTextActive: { color: '#fff' },
  typeTabTextInactive: { color: COLORS.textSecondary },
  accountGrid: { flexDirection: 'row' },
  accountGridCompact: { flexDirection: 'column' },
  accountsList: { width: 280, borderRightWidth: 1, borderRightColor: COLORS.border },
  accountsListCompact: { width: '100%', borderRightWidth: 0 },
  accountsListHeader: { paddingHorizontal: SPACING.md, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  accountsListTitle: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, textTransform: 'uppercase' },
  accountsScroll: { maxHeight: 320, padding: SPACING.sm },
  noAccountsText: { fontSize: 12, color: COLORS.textSecondary, textAlign: 'center', paddingVertical: 24 },
  accountMovements: { flex: 1 },
  selectPrompt: { alignItems: 'center', paddingVertical: 64, gap: 8 },
  selectPromptText: { fontSize: 14, color: COLORS.textSecondary },
  selectedAccountHeader: { paddingHorizontal: SPACING.lg, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
    padding: 2
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  selectedAccountNumber: { fontSize: 14, fontWeight: 'bold', color: COLORS.primaryDark, fontFamily: 'monospace' },
  selectedAccountInfo: { fontSize: 12, color: COLORS.textSecondary },
  accountCard: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: SPACING.md, paddingVertical: 12, borderRadius: 12, borderWidth: 1, marginBottom: 6 },
  accountCardSelected: { backgroundColor: COLORS.primaryDark5, borderColor: COLORS.primaryDark },
  accountCardDefault: { backgroundColor: COLORS.surface, borderColor: COLORS.border },
  accountIcon: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  accountIconMonetaria: { backgroundColor: COLORS.orange100 },
  accountIconAhorro: { backgroundColor: COLORS.blue100 },
  accountInfo: { flex: 1, minWidth: 0 },
  accountNumberText: { fontSize: 12, fontWeight: 'bold', color: COLORS.primaryDark, fontFamily: 'monospace' },
  accountOwner: { fontSize: 11, color: COLORS.textSecondary },
  recentSection: { gap: SPACING.md },
  recentCard: { backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.small, overflow: 'hidden' },
  rankingCard: { backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.small, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.primaryDark },
  cardSubtitle: { fontSize: 12, color: COLORS.textSecondary, margin: 2, padding: 3 },
  errorPadding: { padding: SPACING.md },
  errorContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.errorBg, borderRadius: 12, paddingHorizontal: SPACING.md, paddingVertical: 12 },
  errorText: { fontSize: 14, color: COLORS.error },
  emptyContainer: { alignItems: 'center', paddingVertical: 48, gap: 12 },
  emptyText: { fontSize: 14, color: COLORS.textSecondary },
  loadingContainer: { alignItems: 'center', paddingVertical: 48, gap: 8 },
  loadingText: { fontSize: 14, color: COLORS.textSecondary },
  movementRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: SPACING.lg, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  rankBadge: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  rankGold: { backgroundColor: COLORS.gold },
  rankBlue: { backgroundColor: COLORS.primaryDark },
  rankOrange: { backgroundColor: COLORS.orange500 },
  rankDefault: { backgroundColor: COLORS.orange100 },
  rankText: { fontSize: 12, fontWeight: '800', color: '#fff' },
  accountNumber: { flex: 1, fontSize: 14, fontFamily: 'monospace', fontWeight: '500', color: COLORS.primaryDark },
  movementCount: { alignItems: 'flex-end' },
  movementCountText: { fontSize: 14, fontWeight: 'bold', color: COLORS.primaryDark },
  movementCountLabel: { fontSize: 12, color: COLORS.textSecondary },
});

export default AdminBankHistoryScreen;
