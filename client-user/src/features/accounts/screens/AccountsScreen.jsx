import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronRight, Plus } from 'lucide-react-native';
import { useAccountStore } from '../store/accountsStore';
import CreateAccountModal from '../components/CreateAccountModal';
import AccountDetailModal from '../components/AccountDetailModal';
import { formatAmount, formatDate } from '../../../shared/utils/formatters';
import { COLORS, SPACING, SHADOWS } from '../../../shared/constants/theme';
import LoadingSpinner from '../../../shared/components/common/LoadingSpinner';
import EmptyState from '../../../shared/components/common/EmptyState';

const AccountCard = ({ account, onDetail }) => {
  const dark = account.accountType === 'AHORRO';
  const backgroundColor = dark ? COLORS.primary : COLORS.accent;

  return (
    <TouchableOpacity
      onPress={() => onDetail(account.accountNumber)}
      style={[styles.accountCard, { backgroundColor }]}
      activeOpacity={0.9}
    >
      <View style={styles.accountCardHeader}>
        <View style={styles.accountTypeBadge}>
          <View style={[styles.accountTypeDot, { backgroundColor: dark ? COLORS.accent : '#fff' }]} />
          <Text style={styles.accountTypeText}>CUENTA {account.accountType}</Text>
        </View>
        <View style={styles.currencyBadge}>
          <Text style={styles.currencyText}>GTQ</Text>
        </View>
      </View>

      <View style={styles.accountCardBody}>
        <Text style={styles.balance}>Q {formatAmount(account.balance)}</Text>
        <Text style={styles.accountNumber}>•••• {account.accountNumber.slice(-4)}</Text>
      </View>

      <View style={styles.accountCardFooter}>
        <Text style={styles.accountDate}>
          {account.createdAt ? formatDate(account.createdAt) : '—'}
        </Text>
        <View style={styles.detailButton}>
          <Text style={styles.detailButtonText}>Ver detalle</Text>
          <ChevronRight size={12} color="#fff" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const AccountsScreen = () => {
  const { accounts, loading, fetchAccounts } = useAccountStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedAccountNumber, setSelectedAccountNumber] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const canCreateAccount = accounts.length < 2;

  const handleDetail = (accountNumber) => {
    setSelectedAccountNumber(accountNumber);
  };

  const handleCloseDetail = () => {
    setSelectedAccountNumber(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sus cuentas registradas</Text>
        <View style={styles.headerActions}>
          <View style={styles.accountsCountBadge}>
            <Text style={styles.accountsCountText}>
              {loading ? '...' : `${accounts.length} cuentas activas`}
            </Text>
          </View>
          {canCreateAccount && (
            <TouchableOpacity
              onPress={() => setShowModal(true)}
              style={styles.newAccountButton}
            >
              <Plus size={13} color="#fff" />
              <Text style={styles.newAccountButtonText}>Nueva cuenta</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          {[1, 2].map((i) => (
            <View key={i} style={styles.skeletonCard} />
          ))}
        </View>
      ) : accounts.length === 0 ? (
        <EmptyState
          message="No tienes cuentas registradas"
          submessage="Crea tu primera cuenta para comenzar"
        />
      ) : (
        <View style={styles.accountsGrid}>
          {accounts.map((acc) => (
            <AccountCard key={acc.accountNumber} account={acc} onDetail={handleDetail} />
          ))}
        </View>
      )}

      <CreateAccountModal
        visible={showModal}
        onClose={() => setShowModal(false)}
      />

      <AccountDetailModal
        visible={!!selectedAccountNumber}
        onClose={handleCloseDetail}
        accountNumber={selectedAccountNumber}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Padding separado en contentContainer para que no afecte el ancho del ScrollView
  contentContainer: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  header: {
    marginBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  accountsCountBadge: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  accountsCountText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  newAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newAccountButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  loadingContainer: {
    gap: SPACING.md,
  },
  skeletonCard: {
    height: 155,
    backgroundColor: '#e5e5e5',
    borderRadius: 16,
  },
  accountsGrid: {
    gap: SPACING.md,
  },
  accountCard: {
    borderRadius: 16,
    padding: SPACING.lg,
    minHeight: 155,
    justifyContent: 'space-between',
    ...SHADOWS.medium,
    position: 'relative',
    overflow: 'hidden',
  },
  accountCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accountTypeDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  accountTypeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
    opacity: 0.9,
  },
  currencyBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  currencyText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  accountCardBody: {
    marginTop: SPACING.sm,
  },
  balance: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },
  accountNumber: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.6,
    marginTop: 4,
  },
  accountCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  accountDate: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.6,
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  detailButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    opacity: 0.8,
  },
});

export default AccountsScreen;