import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFavoriteStore } from '../store/favoriteStore';
import { COLORS, SPACING, SHADOWS } from '../../../shared/constants/theme';
import { showToast } from '../../../shared/components/common/Toast';

const AddFavoriteModal = ({ isOpen, onClose, mode = 'add', initialData = {} }) => {
  const { addFavorite, updateFavorite, loadings } = useFavoriteStore();
  const [formData, setFormData] = useState({ accountNumber: '', alias: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      if (mode === 'edit' && initialData) {
        setFormData({
          accountNumber: initialData.accountNumber || '',
          alias: initialData.alias || '',
        });
      } else {
        setFormData({ accountNumber: '', alias: '' });
      }
    }
  }, [isOpen, mode, initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (mode === 'add') {
      if (!formData.accountNumber.trim()) {
        newErrors.accountNumber = 'El número de cuenta es obligatorio';
      } else if (formData.accountNumber.trim().length < 8) {
        newErrors.accountNumber = 'Número de cuenta inválido';
      }
    }
    if (!formData.alias.trim()) {
      newErrors.alias = 'El alias es obligatorio';
    } else if (formData.alias.trim().length > 50) {
      newErrors.alias = 'Máximo 50 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    let result;
    if (mode === 'add') {
      result = await addFavorite({
        accountNumber: formData.accountNumber.trim().toUpperCase(),
        alias: formData.alias.trim(),
      });
    } else {
      result = await updateFavorite(initialData._id, formData.alias.trim());
    }

    if (result.success) {
      showToast(
        mode === 'add' ? 'Cuenta agregada a favoritos' : 'Alias actualizado correctamente',
        'success'
      );
      onClose();
    } else {
      showToast(result.error, 'error');
    }
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {mode === 'add' ? 'Agregar favorito' : 'Editar alias'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {mode === 'add'
                ? 'Guarda una cuenta para transferencias rápidas.'
                : `Editando: ${initialData.accountNumber} · ${initialData.accountType}`}
            </Text>
          </View>

          <View style={styles.formContainer}>
            {mode === 'add' && (
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Número de cuenta</Text>
                <TextInput
                  style={[styles.input, errors.accountNumber && styles.inputError]}
                  value={formData.accountNumber}
                  onChangeText={(value) => handleChange('accountNumber', value)}
                  placeholder="Ej. AH12345678"
                  autoCapitalize="characters"
                />
                {errors.accountNumber && (
                  <Text style={styles.errorText}>{errors.accountNumber}</Text>
                )}
              </View>
            )}

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Alias</Text>
              <TextInput
                style={[styles.input, errors.alias && styles.inputError]}
                value={formData.alias}
                onChangeText={(value) => handleChange('alias', value)}
                placeholder="Ej. María - Trabajo"
                maxLength={50}
              />
              {errors.alias && <Text style={styles.errorText}>{errors.alias}</Text>}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loadings.action}
              style={[styles.confirmButton, loadings.action && styles.confirmButtonDisabled]}
            >
              {loadings.action ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.confirmButtonText}>
                  {mode === 'add' ? 'Agregar favorito' : 'Guardar cambios'}
                </Text>
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
  modalContent: { backgroundColor: COLORS.surface, borderRadius: 16, width: '100%', maxWidth: 400, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.large },
  modalHeader: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg, paddingBottom: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primaryDark },
  modalSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  formContainer: { padding: SPACING.xl, gap: SPACING.md },
  field: { gap: 6 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, backgroundColor: COLORS.surface, paddingHorizontal: SPACING.sm, paddingVertical: 12, fontSize: 14, color: COLORS.textPrimary },
  inputError: { borderColor: COLORS.error },
  errorText: { fontSize: 12, color: COLORS.error, marginTop: 2 },
  buttonContainer: { flexDirection: 'row', gap: SPACING.sm, paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xl, paddingTop: SPACING.md },
  cancelButton: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  cancelButtonText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  confirmButton: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: COLORS.accent, alignItems: 'center', ...SHADOWS.small },
  confirmButtonDisabled: { opacity: 0.6 },
  confirmButtonText: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
});

export default AddFavoriteModal;
