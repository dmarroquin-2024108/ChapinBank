import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { X, PiggyBank, Wallet } from 'lucide-react-native';
import { useAccountStore } from '../store/accountsStore';
import { COLORS, SPACING, SHADOWS } from '../../../shared/constants/theme';
import { showToast } from '../../../shared/components/common/Toast';

const ACCOUNT_TYPES = [
  {
    type: 'AHORRO',
    label: 'Cuenta de Ahorro',
    description: 'Ideal para guardar tu dinero y generar rendimientos.',
    icon: PiggyBank,
  },
  {
    type: 'MONETARIA',
    label: 'Cuenta Monetaria',
    description: 'Para tus transacciones y pagos del día a día.',
    icon: Wallet,
  },
];

const CreateAccountModal = ({ visible, onClose }) => {
  const { createAccount, loading } = useAccountStore();
  const [selected, setSelected] = useState(null);

  const handleConfirm = async () => {
    if (!selected) return;
    const res = await createAccount({ accountType: selected });
    if (res.success) {
      showToast('¡Cuenta creada exitosamente!', 'success');
      setSelected(null);
      onClose();
    } else {
      showToast(res.error, 'error');
    }
  };

  const handleClose = () => {
    setSelected(null);
    onClose();
  };

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
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nueva Cuenta</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.modalSubtitle}>Selecciona el tipo de cuenta que deseas abrir</Text>

          <ScrollView style={styles.accountTypesList}>
            {ACCOUNT_TYPES.map(({ type, label, description, icon: Icon }) => {
              const isSelected = selected === type;
              return (
                <TouchableOpacity
                  key={type}
                  onPress={() => setSelected(type)}
                  style={[
                    styles.accountTypeCard,
                    isSelected && styles.accountTypeCardSelected,
                  ]}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      isSelected && styles.iconContainerSelected,
                    ]}
                  >
                    <Icon size={20} color={isSelected ? '#fff' : COLORS.textSecondary} />
                  </View>
                  <View style={styles.accountTypeInfo}>
                    <Text
                      style={[
                        styles.accountTypeLabel,
                        isSelected && styles.accountTypeLabelSelected,
                      ]}
                    >
                      {label}
                    </Text>
                    <Text style={styles.accountTypeDescription}>{description}</Text>
                  </View>
                  <View
                    style={[
                      styles.radioButton,
                      isSelected && styles.radioButtonSelected,
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirm}
              disabled={!selected || loading}
              style={[
                styles.confirmButton,
                (!selected || loading) && styles.confirmButtonDisabled,
              ]}
            >
              <Text style={styles.confirmButtonText}>
                {loading ? 'Creando...' : 'Abrir Cuenta'}
              </Text>
            </TouchableOpacity>
          </View>
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
    padding: SPACING.lg,
    ...SHADOWS.large,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  accountTypesList: {
    marginBottom: SPACING.lg,
  },
  accountTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  accountTypeCardSelected: {
    borderColor: COLORS.accent,
    backgroundColor: `${COLORS.accent}05`,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  iconContainerSelected: {
    backgroundColor: COLORS.accent,
  },
  accountTypeInfo: {
    flex: 1,
  },
  accountTypeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  accountTypeLabelSelected: {
    color: COLORS.primaryDark,
  },
  accountTypeDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  radioButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  radioButtonSelected: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accent,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

export default CreateAccountModal;
