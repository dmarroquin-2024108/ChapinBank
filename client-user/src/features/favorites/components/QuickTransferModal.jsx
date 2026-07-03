import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { X, Send } from 'lucide-react-native';
import { useQuickTransfer } from '../hooks/useQuickTransfer';
import { formatAmount } from '../../../shared/utils/formatters';
import { COLORS, SPACING, SHADOWS } from '../../../shared/constants/theme';
import { showToast } from '../../../shared/components/common/Toast';
import CustomSelect from '../../../shared/components/common/CustomSelect';

const CURRENCIES = ['GTQ', 'USD', 'EUR', 'MXN'];

const Field = ({ label, error, children, hint }) => (
  <View style={styles.field}>
    <Text style={styles.fieldLabel}>{label}</Text>
    {children}
    {hint && !error && <Text style={styles.fieldHint}>{hint}</Text>}
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const QuickTransferModal = ({ isOpen, onClose, favorite }) => {
  const { accounts, loadingAccounts, quickTransfer, loadingAction } = useQuickTransfer();
  const [formData, setFormData] = useState({
    numberAccountOrigin: '',
    originHolder: '',
    amount: '',
    currency: 'GTQ',
    description: '',
  });
  const [errors, setErrors] = useState({});

  const activeAccounts = accounts.filter((acc) => acc.status);

  useEffect(() => {
    if (isOpen) {
      setFormData({ numberAccountOrigin: '', originHolder: '', amount: '', currency: 'GTQ', description: '' });
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.numberAccountOrigin) newErrors.numberAccountOrigin = 'Selecciona una cuenta de origen';
    if (!formData.originHolder.trim()) newErrors.originHolder = 'Tu nombre es obligatorio';
    if (!formData.amount) newErrors.amount = 'El monto es obligatorio';
    else if (parseFloat(formData.amount) < 1) newErrors.amount = 'Mínimo 1';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const result = await quickTransfer(favorite._id, {
      numberAccountOrigin: formData.numberAccountOrigin,
      originHolder: formData.originHolder,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      description: formData.description || undefined,
    });

    if (result.success) {
      showToast('Transferencia creada. El destinatario recibirá un correo para confirmarla.', 'success');
      onClose();
    } else {
      showToast(result.error, 'error');
    }
  };

  const getInitials = (alias) =>
    alias
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() || '?';

  const accountOptions = activeAccounts.map((acc) => ({
    value: acc.accountNumber,
    label: `${acc.accountNumber} · ${acc.accountType} · Q ${formatAmount(acc.balance)}`,
  }));

  if (!isOpen || !favorite) return null;

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerAvatar}>
              <Send size={20} color="#fff" />
            </View>
          </View>

          <View style={styles.modalBody}>
            <Text style={styles.modalTitle}>Transferencia rápida</Text>
            <Text style={styles.modalSubtitle}>
              Hacia: <Text style={styles.modalSubtitleBold}>{favorite.alias}</Text>
            </Text>

            <View style={styles.recipientCard}>
              <View style={[styles.avatar, { backgroundColor: COLORS.accent }]}>
                <Text style={styles.avatarText}>{getInitials(favorite.alias)}</Text>
              </View>
              <View style={styles.recipientInfo}>
                <Text style={styles.recipientLabel}>Destinatario</Text>
                <Text style={styles.recipientAccount}>{favorite.accountNumber}</Text>
              </View>
              <View style={[styles.typeBadge, favorite.accountType === 'AHORRO' ? styles.typeBadgeAhorro : styles.typeBadgeMonetaria]}>
                <Text style={styles.typeBadgeText}>{favorite.accountType}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <ScrollView style={styles.formContainer}>
              <Field label="Cuenta de origen" error={errors.numberAccountOrigin}>
                {loadingAccounts ? (
                  <View style={styles.skeleton} />
                ) : activeAccounts.length > 0 ? (
                  <CustomSelect
                    value={formData.numberAccountOrigin}
                    onChange={(value) => handleChange('numberAccountOrigin', value)}
                    options={accountOptions}
                  />
                ) : (
                  <View style={styles.errorCard}>
                    <Text style={styles.errorCardText}>No tienes cuentas activas para realizar transferencias.</Text>
                  </View>
                )}
              </Field>

              <Field label="Tu nombre completo" error={errors.originHolder}>
                <TextInput
                  style={[styles.input, errors.originHolder && styles.inputError]}
                  value={formData.originHolder}
                  onChangeText={(value) => handleChange('originHolder', value)}
                  placeholder="Nombre completo"
                />
              </Field>

              <View style={styles.row}>
                <Field label="Monto" error={errors.amount} style={styles.half}>
                  <TextInput
                    style={[styles.input, errors.amount && styles.inputError]}
                    value={formData.amount}
                    onChangeText={(value) => handleChange('amount', value)}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                  />
                </Field>
                <Field label="Moneda" style={styles.half}>
                  <CustomSelect
                    value={formData.currency}
                    onChange={(value) => handleChange('currency', value)}
                    options={CURRENCIES.map((c) => ({ value: c, label: c }))}
                  />
                </Field>
              </View>

              <Field label="Descripción (opcional)">
                <TextInput
                  style={styles.textArea}
                  value={formData.description}
                  onChangeText={(value) => handleChange('description', value)}
                  placeholder="Ej. Pago de renta"
                  maxLength={255}
                  multiline
                  numberOfLines={3}
                />
              </Field>
            </ScrollView>

            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loadingAction || activeAccounts.length === 0}
                style={[styles.confirmButton, (loadingAction || activeAccounts.length === 0) && styles.confirmButtonDisabled]}
              >
                {loadingAction ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Send size={14} color="#fff" />
                    <Text style={styles.confirmButtonText}>Transferir</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: SPACING.lg },
  modalContent: { backgroundColor: COLORS.surface, borderRadius: 16, width: '100%', maxWidth: 400, maxHeight: '90%', ...SHADOWS.large, overflow: 'hidden', flex: 1 },
  modalHeader: { height: 80, backgroundColor: COLORS.primaryDark, paddingHorizontal: SPACING.md, paddingTop: SPACING.md, position: 'relative' },
  closeButton: { alignSelf: 'flex-end', padding: 4 },
  headerAvatar: { position: 'absolute', bottom: -28, left: SPACING.lg, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.accent, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: COLORS.surface },
  modalBody: { paddingTop: 36, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg, flex: 1 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.primaryDark },
  modalSubtitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  modalSubtitleBold: { fontWeight: '600', color: COLORS.primaryDark },
  recipientCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.background, borderRadius: 12, paddingHorizontal: SPACING.md, paddingVertical: 12, marginTop: SPACING.md },
  avatar: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', backgroundColor: `${COLORS.accent}20` },
  avatarText: { fontSize: 12, fontWeight: 'bold', color: COLORS.accent },
  recipientInfo: { flex: 1 },
  recipientLabel: { fontSize: 12, color: COLORS.textSecondary },
  recipientAccount: { fontSize: 14, fontWeight: '600', color: COLORS.primaryDark },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  typeBadgeAhorro: { backgroundColor: COLORS.blue100 },
  typeBadgeMonetaria: { backgroundColor: COLORS.orange100 },
  typeBadgeText: { fontSize: 11, fontWeight: 'bold', color: COLORS.primaryDark },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.md },
  formContainer: { marginBottom: SPACING.md, flex: 1 },
  field: { gap: 6, marginBottom: SPACING.sm },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  fieldHint: { fontSize: 12, color: COLORS.textSecondary },
  errorText: { fontSize: 12, color: COLORS.error, marginTop: 2 },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, backgroundColor: COLORS.surface, paddingHorizontal: SPACING.sm, paddingVertical: 10, fontSize: 14, color: COLORS.textPrimary },
  inputError: { borderColor: COLORS.error },
  textArea: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, backgroundColor: COLORS.surface, paddingHorizontal: SPACING.sm, paddingVertical: 10, fontSize: 14, color: COLORS.textPrimary, minHeight: 80, textAlignVertical: 'top' },
  skeleton: { height: 40, backgroundColor: COLORS.background, borderRadius: 8 },
  errorCard: { backgroundColor: COLORS.errorBg, borderRadius: 8, paddingHorizontal: SPACING.sm, paddingVertical: 12, borderWidth: 1, borderColor: COLORS.error },
  errorCardText: { fontSize: 12, color: COLORS.error },
  row: { flexDirection: 'row', gap: SPACING.sm },
  half: { flex: 1 },
  selectContainer: { position: 'relative' },
  selectButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.sm, paddingVertical: 10, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, backgroundColor: COLORS.surface },
  selectButtonDisabled: { opacity: 0.6 },
  selectText: { fontSize: 14, color: COLORS.textPrimary },
  selectTextDisabled: { color: COLORS.textSecondary },
  selectIcon: { marginLeft: SPACING.sm },
  selectArrow: { fontSize: 10, color: COLORS.textSecondary },
  selectDropdown: { backgroundColor: COLORS.surface, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.large, maxHeight: 200 },
  selectOption: { padding: SPACING.sm, paddingHorizontal: SPACING.md },
  selectOptionSelected: { backgroundColor: `${COLORS.accent}10` },
  selectOptionText: { fontSize: 14, color: COLORS.textPrimary },
  selectOptionTextSelected: { color: COLORS.accent, fontWeight: '600' },
  buttonContainer: { flexDirection: 'row', gap: SPACING.sm },
  cancelButton: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  cancelButtonText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  confirmButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 12, backgroundColor: COLORS.accent, ...SHADOWS.small },
  confirmButtonDisabled: { opacity: 0.6 },
  confirmButtonText: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
});

export default QuickTransferModal;
