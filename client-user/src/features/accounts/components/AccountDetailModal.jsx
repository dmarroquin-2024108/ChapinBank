import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { X, CreditCard } from 'lucide-react-native';
import { useAccountStore } from '../store/accountsStore';
import { formatAmount, formatDate, formatBalance } from '../../../shared/utils/formatters';
import { COLORS, SPACING, SHADOWS } from '../../../shared/constants/theme';
import LoadingSpinner from '../../../shared/components/common/LoadingSpinner';

const AccountDetailModal = ({ visible, onClose, accountNumber }) => {
  const { selectedAccount, loadingDetail, fetchAccountById } = useAccountStore();

  useEffect(() => {
    if (visible && accountNumber) {
      useAccountStore.setState({ selectedAccount: null });
      fetchAccountById(accountNumber);
    }
  }, [visible, accountNumber]);

  const handleClose = () => {
    onClose();
  };

  const dark = selectedAccount?.accountType === 'AHORRO';
  const headerBackgroundColor = dark ? COLORS.primary : COLORS.accent;
  const iconBackgroundColor = dark ? COLORS.accent : COLORS.primary;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modal}>
          <View style={[styles.modalHeader, { backgroundColor: headerBackgroundColor }]}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={20} color="rgba(255, 255, 255, 0.6)" />
            </TouchableOpacity>
            <View style={styles.iconContainer}>
              <View style={[styles.iconCircle, { backgroundColor: iconBackgroundColor }]}>
                <CreditCard size={24} color="#fff" />
              </View>
            </View>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {loadingDetail ? '...' : `Cuenta ${selectedAccount?.accountType}`}
            </Text>
            <Text style={styles.modalSubtitle}>{selectedAccount?.accountNumber ?? '—'}</Text>
          </View>

          <View style={styles.divider} />

          {loadingDetail ? (
            <View style={styles.loadingContainer}>
              {[1, 2, 3].map((i) => (
                <View key={i} style={styles.skeleton} />
              ))}
            </View>
          ) : selectedAccount ? (
            <ScrollView style={styles.detailsContainer}>
              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Saldo disponible</Text>
                  <Text style={styles.detailValue}>{formatBalance(selectedAccount.balance)}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Tipo de cuenta</Text>
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor: dark
                          ? `${COLORS.primary}10`
                          : `${COLORS.accent}10`,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        { color: dark ? COLORS.primary : COLORS.accent },
                      ]}
                    >
                      {selectedAccount.accountType}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Número de cuenta</Text>
                  <Text style={styles.detailValue}>{selectedAccount.accountNumber}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Fecha de apertura</Text>
                  <Text style={styles.detailValue}>
                    {selectedAccount.createdAt
                      ? formatDate(selectedAccount.createdAt)
                      : '—'}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Estado de cuenta</Text>
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor: selectedAccount.status
                          ? COLORS.successBg
                          : COLORS.orange100,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        {
                          color: selectedAccount.status
                            ? COLORS.success
                            : COLORS.orange600,
                        },
                      ]}
                    >
                      {selectedAccount.status ? 'ACTIVA' : 'DESHABILITADA'}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.footer}>
                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.closeButtonBottom}
                >
                  <Text style={styles.closeButtonBottomText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>No se pudo cargar el detalle</Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  modal: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    ...SHADOWS.large,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    height: 96,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    padding: SPACING.xs,
  },
  iconContainer: {
    position: 'absolute',
    bottom: -32,
    left: SPACING.lg,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  modalContent: {
    paddingTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xs,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  modalSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
  },
  loadingContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  skeleton: {
    height: 32,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  detailsContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  detailsGrid: {
    gap: SPACING.md,
  },
  detailItem: {
    gap: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  closeButtonBottom: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonBottomText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

export default AccountDetailModal;
