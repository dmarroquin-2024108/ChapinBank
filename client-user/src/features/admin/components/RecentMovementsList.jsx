import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react-native';
import { formatAmount, formatDate } from '../../../shared/utils/formatters';
import { COLORS, SPACING } from '../../../shared/constants/theme';

const MOVEMENT_LABELS = {
  DEPOSIT: 'Depósito realizado',
  DEPOSIT_REVERT: 'Reversión de depósito',
  TRANSFER: 'Transferencia realizada',
  TRANSACTION: 'Transacción',
};

const CREDIT_TYPES = new Set(['DEPOSIT']);

export const RecentMovementsList = ({ history = [], onViewAll }) => {
  const recentHistory = Array.isArray(history) ? history.slice(0, 5) : [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Movimientos recientes del banco</Text>
          <Text style={styles.headerSubtitle}>Últimas transacciones de todos los clientes</Text>
        </View>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll}>
            <Text style={styles.viewAllText}>Ver historial completo</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        {recentHistory.length === 0 ? (
          <Text style={styles.emptyText}>Sin movimientos registrados</Text>
        ) : (
          recentHistory.map((mov) => {
            const isCredit = CREDIT_TYPES.has(mov.type);
            return (
              <View key={mov.id ?? mov._id} style={styles.movementItem}>
                <View style={[styles.iconContainer, isCredit ? styles.iconCredit : styles.iconDebit]}>
                  {isCredit ? (
                    <ArrowDownLeft size={16} color={isCredit ? COLORS.blue400 : COLORS.orange500} />
                  ) : (
                    <ArrowUpRight size={16} color={COLORS.orange500} />
                  )}
                </View>

                <View style={styles.movementContent}>
                  <Text style={styles.movementLabel} numberOfLines={1}>
                    {MOVEMENT_LABELS[mov.type] ?? mov.type}
                  </Text>
                  <Text style={styles.movementMeta}>
                    {mov.originHolder ?? mov.accountNumber} · {formatDate(mov.date)}
                  </Text>
                </View>
                <Text style={[styles.movementAmount, isCredit ? styles.amountCredit : styles.amountDebit]}>
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
  container: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#fff',
    textDecorationLine: 'underline',
  },
  content: {
    backgroundColor: COLORS.backgroundAlt,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: 32,
  },
  movementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.border,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCredit: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  iconDebit: {
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
  },
  movementContent: {
    flex: 1,
    minWidth: 0,
  },
  movementLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  movementMeta: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  movementAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  amountCredit: {
    color: COLORS.blue400,
  },
  amountDebit: {
    color: COLORS.orange500,
  },
});
