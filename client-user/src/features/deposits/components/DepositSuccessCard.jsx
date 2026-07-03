import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle, RotateCcw, Clock } from 'lucide-react-native';
import { COLORS, SPACING, SHADOWS } from '../../../shared/constants/theme';
import { formatAmount } from '../../../shared/utils/formatters';

const REVERT_LIMIT_SECONDS = 60;

const DetailRow = ({ label, value, accent = false }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={[styles.detailValue, accent && styles.detailValueAccent]}>
      {value}
    </Text>
  </View>
);

const DepositSuccessCard = ({ deposit, onRevert, onDismiss, revertLoading }) => {
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const elapsed = Math.floor((Date.now() - new Date(deposit.createdAt).getTime()) / 1000);
    return Math.max(0, REVERT_LIMIT_SECONDS - elapsed);
  });

  const canRevert = secondsLeft > 0;

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          onDismiss(); 
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <CheckCircle size={20} color={COLORS.accent} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Depósito registrado</Text>
          <Text style={styles.headerSubtitle}>
            ID: <Text style={styles.depositId}>{deposit.depositId}</Text>
          </Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <DetailRow label="Cuenta" value={deposit.accountNumber} />
        <DetailRow
          label="Monto"
          value={`Q ${formatAmount(deposit.amount)}`}
          accent
        />
        <DetailRow
          label="Método"
          value={deposit.depositMethod === 'EFECTIVO' ? 'Efectivo' : 'Cheque'}
        />
        <DetailRow label="Moneda" value={deposit.currency} />
        {deposit.currency !== 'GTQ' && (
          <DetailRow
            label="Equivalente en GTQ"
            value={`Q ${formatAmount(deposit.amountInGTQ)}`}
          />
        )}
        {deposit.currency !== 'GTQ' && (
          <DetailRow
            label="Tasa de cambio"
            value={`1 ${deposit.currency} = Q ${deposit.exchangeRate}`}
          />
        )}
        <DetailRow
          label="Nuevo saldo"
          value={`Q ${formatAmount(deposit.balanceActual)}`}
        />
        {deposit.description && <DetailRow label="Referencia" value={deposit.description} />}
      </View>

      <View style={styles.timerContainer}>
        <View style={styles.timerHeader}>
          <View style={styles.timerLabelContainer}>
            <Clock size={12} color={COLORS.textSecondary} />
            <Text style={styles.timerLabel}>
              {canRevert ? 'Tiempo para revertir' : 'Tiempo expirado'}
            </Text>
          </View>
          <Text style={[styles.timerValue, !canRevert && styles.timerValueExpired]}>
            {secondsLeft}s
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(secondsLeft / REVERT_LIMIT_SECONDS) * 100}%` },
            ]}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {canRevert && (
          <TouchableOpacity
            onPress={() => onRevert(deposit.depositId)}
            disabled={revertLoading}
            style={[styles.revertButton, revertLoading && styles.buttonDisabled]}
          >
            <RotateCcw size={14} color={COLORS.textSecondary} style={revertLoading && styles.spinning} />
            <Text style={styles.revertButtonText}>
              {revertLoading ? 'Revirtiendo…' : 'Revertir'}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={onDismiss}
          style={[styles.newDepositButton, !canRevert && styles.newDepositButtonFull]}
        >
          <Text style={styles.newDepositButtonText}>Nuevo depósito</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    ...SHADOWS.small,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.orange50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  depositId: {
    fontFamily: 'monospace',
  },
  detailsContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  detailValueAccent: {
    color: COLORS.accent,
  },
  timerContainer: {
    marginBottom: SPACING.md,
  },
  timerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  timerLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timerLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  timerValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  timerValueExpired: {
    color: COLORS.textSecondary,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.background,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  revertButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  revertButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  newDepositButton: {
    flex: 1,
    backgroundColor: COLORS.primaryDark,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  newDepositButtonFull: {
    flex: 1,
  },
  newDepositButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  spinning: {
    animation: 'spin 1s linear infinite',
  },
});

export default DepositSuccessCard;
