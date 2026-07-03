import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../../shared/store/authStore';
import Input from '../../../shared/components/common/Input';
import Button from '../../../shared/components/common/Button';
import { COLORS, SPACING, SHADOWS } from '../../../shared/constants/theme';
import { showToast } from '../../../shared/components/common/Toast';

const ChangeTempPasswordModal = ({ onClose }) => {
  const { changeTempPassword, loading } = useAuthStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    const resultado = await changeTempPassword(formData.NewPassword);
    if (resultado.success) {
      showToast('Contraseña actualizada, inicia sesión', 'success');
      onClose();
    } else {
      showToast(resultado.error || 'Error al cambiar la contraseña', 'error');
    }
  };

  return (
    <Modal
      visible={true}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Cambiar Contraseña Temporal</Text>
          <Text style={styles.subtitle}>Debes cambiar tu contraseña antes de continuar</Text>

          <Input
            label="Nueva Contraseña"
            placeholder="* * * * * *"
            secureTextEntry
            control={control}
            name="NewPassword"
            rules={{ required: 'Este campo es obligatorio' }}
          />

          {errors.NewPassword && (
            <Text style={styles.errorText}>{errors.NewPassword.message}</Text>
          )}

          <Button
            title={loading ? 'Cambiando...' : 'Cambiar Contraseña'}
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.button}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modal: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 400,
    ...SHADOWS.large,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginBottom: SPACING.sm,
  },
  button: {
    marginTop: SPACING.md,
  },
});

export default ChangeTempPasswordModal;
