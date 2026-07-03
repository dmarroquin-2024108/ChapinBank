import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { ShoppingCart, X } from 'lucide-react-native';
import { formatAmount } from '../../../shared/utils/formatters';
import { COLORS, SPACING, SHADOWS } from '../../../shared/constants/theme';
import CustomSelect from '../../../shared/components/common/CustomSelect';

const BuyModal = ({ isOpen, product, accounts = [], onClose, onConfirm, loading = false }) => {
  const [selectedAccount, setSelectedAccount] = useState('');
  const activeAccounts = useMemo(
    () => accounts.filter((acc) => acc.status),
    [accounts]
  );

  useEffect(() => {
    if (isOpen) {
      const first = accounts.filter((acc) => acc.status)[0]?.accountNumber ?? '';
      setSelectedAccount(first);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!selectedAccount) return;
    await onConfirm({ productId: product._id, accountNumber: selectedAccount });
  };

  if (!isOpen || !product) return null;

  const accountOptions = activeAccounts.map((acc) => ({
    value: acc.accountNumber,
    label: `${acc.accountNumber} — Q ${formatAmount(acc.balance)} (${acc.accountType})`,
  }));

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.headerText}>
              <Text style={styles.modalTitle}>Contratar servicio</Text>
              <Text style={styles.modalSubtitle}>Selecciona la cuenta a debitar</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.productCard}>
            {product.imageUrl ? (
              <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
            ) : (
              <View style={styles.productImagePlaceholder} />
            )}
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
              <Text style={styles.productType}>{product.type}</Text>
              <Text style={styles.productPrice}>
                Q {formatAmount(product.price)}
                <Text style={styles.pricePeriod}>/mes</Text>
              </Text>
            </View>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.fieldLabel}>Cuenta bancaria</Text>
            {activeAccounts.length === 0 ? (
              <View style={styles.errorCard}>
                <Text style={styles.errorText}>No tienes cuentas disponibles para realizar esta compra.</Text>
              </View>
            ) : (
              <CustomSelect
                value={selectedAccount}
                onChange={setSelectedAccount}
                options={accountOptions}
              />
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} disabled={loading} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirm}
              disabled={loading || activeAccounts.length === 0}
              style={[styles.confirmButton, (loading || activeAccounts.length === 0) && styles.confirmButtonDisabled]}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <ShoppingCart size={15} color="#fff" />
                  <Text style={styles.confirmButtonText}>Confirmar compra</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: SPACING.lg },
  modalContent: { backgroundColor: COLORS.surface, borderRadius: 16, width: '100%', maxWidth: 400, ...SHADOWS.large, overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, paddingBottom: SPACING.md },
  headerText: { flex: 1 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primaryDark },
  modalSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  closeButton: { padding: 4 },
  productCard: { flexDirection: 'row', gap: 16, backgroundColor: COLORS.background, borderRadius: 12, paddingHorizontal: SPACING.md, paddingVertical: 16, marginHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  productImage: { width: 56, height: 56, borderRadius: 12 },
  productImagePlaceholder: { width: 56, height: 56, borderRadius: 12, backgroundColor: COLORS.gray100 },
  productInfo: { flex: 1, minWidth: 0 },
  productName: { fontSize: 16, fontWeight: '600', color: COLORS.primaryDark },
  productType: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  productPrice: { fontSize: 18, fontWeight: '800', color: COLORS.accent, marginTop: 4 },
  pricePeriod: { fontSize: 12, fontWeight: 'normal', color: COLORS.textSecondary },
  formContainer: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 8 },
  errorCard: { backgroundColor: COLORS.errorBg, borderRadius: 12, paddingHorizontal: SPACING.md, paddingVertical: 12, borderWidth: 1, borderColor: COLORS.error },
  errorText: { fontSize: 14, color: COLORS.error },
  selectContainer: { position: 'relative' },
  selectButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: 12, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, backgroundColor: COLORS.surface },
  selectButtonDisabled: { opacity: 0.6 },
  selectText: { fontSize: 14, color: COLORS.textPrimary },
  selectTextDisabled: { color: COLORS.textSecondary },
  selectArrow: { fontSize: 10, color: COLORS.textSecondary },
  selectDropdown: { backgroundColor: COLORS.surface, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.large, maxHeight: 200 },
  selectOption: { padding: SPACING.md, paddingHorizontal: SPACING.lg },
  selectOptionSelected: { backgroundColor: `${COLORS.accent}10` },
  selectOptionText: { fontSize: 14, color: COLORS.textPrimary },
  selectOptionTextSelected: { color: COLORS.accent, fontWeight: '600' },
  buttonContainer: { flexDirection: 'row', gap: 12, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg },
  cancelButton: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  cancelButtonText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  confirmButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 12, backgroundColor: COLORS.accent, ...SHADOWS.small },
  confirmButtonDisabled: { opacity: 0.6 },
  confirmButtonText: { fontSize: 11, fontWeight: 'bold', color: '#fff' },
});

export default BuyModal;
