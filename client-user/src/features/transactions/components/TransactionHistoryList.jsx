import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react-native';
import { formatAmount, formatDate } from '../../../shared/utils/formatters';
import { COLORS, SPACING, SHADOWS } from '../../../shared/constants/theme';

const MOVEMENT_LABELS = {
  DEPOSIT: 'Depósito realizado',
  DEPOSIT_REVERT: 'Reversión de depósito',
  TRANSFER: 'Transferencia realizada',
  TRANSACTION: 'Transacción',
  WITHDRAWAL: 'Retiro',
  PAYMENT: 'Pago',
};

const CREDIT_TYPES = new Set(['DEPOSIT']);

const TransactionHistoryList = ({ movements = [], title = 'Historial de movimientos', loading = false }) => {
  if (loading) {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>

      <View style={styles.listContainer}>
        {movements.length === 0 ? (
          <Text style={styles.emptyText}>Sin movimientos registrados</Text>
        ) : (
          movements.map((mov) => {
            const isCredit = CREDIT_TYPES.has(mov.type);
            return (
              <View key={mov.id || `${mov.accountNumber}-${mov.date}`} style={styles.movementItem}>
                <View style={[styles.iconContainer, isCredit ? styles.iconContainerCredit : styles.iconContainerDebit]}>
                  {isCredit ? <ArrowDownLeft size={16} color={isCredit ? COLORS.blue400 : COLORS.accent} /> : <ArrowUpRight size={16} color={isCredit ? COLORS.blue400 : COLORS.accent} />}
                </View>

                <View style={styles.movementInfo}>
                  <Text style={styles.movementLabel} numberOfLines={1}>
                    {MOVEMENT_LABELS[mov.type] ?? mov.type}
                  </Text>
                  <Text style={styles.movementSublabel} numberOfLines={1}>
                    {mov.originHolder ?? mov.accountNumber} · {formatDate(mov.date)}
                  </Text>
                </View>
                <Text style={[styles.movementAmount, isCredit ? styles.movementAmountCredit : styles.movementAmountDebit]}>
                  {isCredit ? '+' : '-'}Q {formatAmount(mov.amount)}
                </Text>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.small },
  cardHeader: { paddingHorizontal: SPACING.lg, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  cardTitle: { fontSize: 16, fontWeight: '600', color: COLORS.primaryDark },
  loadingContainer: { paddingVertical: 32, alignItems: 'center' },
  listContainer: { paddingVertical: 8 },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', paddingVertical: 32 },
  movementItem: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: SPACING.lg, paddingVertical: 12 },
  iconContainer: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  iconContainerCredit: { backgroundColor: COLORS.blue100 },
  iconContainerDebit: { backgroundColor: COLORS.orange100 },
  movementInfo: { flex: 1, minWidth: 0 },
  movementLabel: { fontSize: 14, fontWeight: '500', color: COLORS.primaryDark },
  movementSublabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  movementAmount: { fontSize: 14, fontWeight: '600' },
  movementAmountCredit: { color: COLORS.blue400 },
  movementAmountDebit: { color: COLORS.accent },
});

export default TransactionHistoryList;
