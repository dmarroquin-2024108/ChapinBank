import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, ShoppingBag, RotateCcw } from 'lucide-react-native';
import { formatAmount, formatDate } from '../../../shared/utils/formatters';
import { COLORS, SPACING } from '../../../shared/constants/theme';

const MOVEMENT_CONFIG = {
  DEPOSIT: {
    label: 'Deposito',
    icon: ArrowDownLeft,
    iconBg: COLORS.blue100,
    iconColor: COLORS.blue600,
    amountColor: COLORS.blue600,
    sign: '+',
  },
  DEPOSIT_REVERT: {
    label: 'Reversion de deposito',
    icon: RotateCcw,
    iconBg: COLORS.orange100,
    iconColor: COLORS.orange500,
    amountColor: COLORS.orange500,
    sign: '-',
  },
  TRANSFER: {
    label: 'Transferencia',
    icon: ArrowLeftRight,
    iconBg: COLORS.gold10,
    iconColor: COLORS.gold,
    amountColor: COLORS.gold,
    sign: '-',
  },
  TRANSACTION: {
    label: 'Transaccion',
    icon: ShoppingBag,
    iconBg: COLORS.primaryDark,
    iconColor: '#fff',
    amountColor: COLORS.primaryDark,
    sign: '-',
  },
};

const DEFAULT_CONFIG = {
  label: 'Movimiento',
  icon: ArrowUpRight,
  iconBg: COLORS.gray100,
  iconColor: COLORS.gray500,
  amountColor: COLORS.gray700,
  sign: '',
};

const DefaultDetail = ({ mov }) => (
  <Text style={styles.detailText}>
    {mov.accountNumber} - {formatDate(mov.date)}
  </Text>
);

const TransferDetail = ({ mov }) => (
  <View style={styles.detailContainer}>
    <Text style={styles.detailText}>
      De{' '}
      <Text style={styles.detailTextBold}>{mov.originHolder ?? mov.numberAccountOrigin}</Text>
    </Text>
    <Text style={styles.detailText}>
      Para{' '}
      <Text style={styles.detailTextBold}>{mov.destinationHolder ?? mov.numberAccountDestination}</Text>
    </Text>
    <Text style={styles.detailText}>{formatDate(mov.date)}</Text>
  </View>
);

const DepositDetail = ({ mov }) => (
  <View style={styles.detailContainer}>
    <Text style={[styles.detailText, styles.detailMono]}>{mov.accountNumber}</Text>
    {mov.depositMethod && <Text style={styles.detailText}>{mov.depositMethod}</Text>}
    <Text style={styles.detailText}>{formatDate(mov.date)}</Text>
  </View>
);

export const MovementCard = ({ mov, showAccount = false }) => {
  const config = MOVEMENT_CONFIG[mov.type] ?? DEFAULT_CONFIG;
  const Icon = config.icon;

  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: config.iconBg }]}>
        <Icon size={18} color={config.iconColor} />
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <Text style={[styles.label, { color: COLORS.primaryDark }]}>{config.label}</Text>
            {mov.status && mov.status !== 'COMPLETED' && (
              <View style={[
                styles.statusBadge,
                mov.status === 'PENDING' ? styles.statusPending : styles.statusFailed
              ]}>
                <Text style={[
                  styles.statusText,
                  mov.status === 'PENDING' ? styles.statusTextPending : styles.statusTextFailed
                ]}>
                  {mov.status === 'PENDING' ? 'Pendiente' : 'Fallido'}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.headerRight}>
            <Text style={[styles.amount, { color: config.amountColor }]}>
              {config.sign} Q {formatAmount(mov.amount)}
            </Text>
            {mov.commision > 0 && (
              <Text style={styles.commission}>comisión Q {formatAmount(mov.commision)}</Text>
            )}
          </View>
        </View>

        {mov.description && mov.description !== 'Sin descripcion' && (
          <Text style={styles.description}>{mov.description}</Text>
        )}

        <View style={styles.details}>
          {mov.type === 'TRANSFER' ? (
            <TransferDetail mov={mov} />
          ) : mov.type === 'DEPOSIT' || mov.type === 'DEPOSIT_REVERT' ? (
            <DepositDetail mov={mov} />
          ) : (
            <DefaultDetail mov={mov} />
          )}

          {showAccount && mov.accountNumber && (
            <Text style={[styles.detailText, styles.detailMono]}>
              Cuenta: {mov.accountNumber}
            </Text>
          )}

          {mov.noOperacion && (
            <Text style={[styles.detailText, styles.detailMono]}>Op. {mov.noOperacion}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: 12, padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  iconContainer: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardContent: { flex: 1, minWidth: 0 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', flex: 1 },
  label: { fontSize: 14, fontWeight: '600' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  statusPending: { backgroundColor: COLORS.yellow100 },
  statusFailed: { backgroundColor: COLORS.orange100 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  statusTextPending: { color: COLORS.yellow600 },
  statusTextFailed: { color: COLORS.orange500 },
  headerRight: { alignItems: 'flex-end' },
  amount: { fontSize: 16, fontWeight: 'bold' },
  commission: { fontSize: 10, color: COLORS.textSecondary },
  description: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  details: { marginTop: 8, gap: 4 },
  detailText: { fontSize: 12, color: COLORS.textSecondary },
  detailTextBold: { fontWeight: '500', color: COLORS.textPrimary },
  detailMono: { fontFamily: 'monospace' },
  detailContainer: { gap: 2 },
});
