import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../../shared/store/authStore';
import Input from '../../../shared/components/common/Input';
import Button from '../../../shared/components/common/Button';
import { COLORS, SPACING } from '../../../shared/constants/theme';
import { showToast } from '../../../shared/components/common/Toast';

const ForgotPasswordModal = ({ onSwitch }) => {
  const { lostPassword, error } = useAuthStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    const resultado = await lostPassword(formData);
    if (resultado.success) {
      showToast('Correo enviado.', 'success');
    } else {
      showToast('Error al enviar el correo. Inténtelo de nuevo.', 'error');
    }
  };

  return (
    <View style={styles.container}>
      <Input
        label="Email"
        placeholder="correo@example.com"
        control={control}
        name="email"
        rules={{ required: 'Este campo es obligatorio' }}
        keyboardType="email-address"
      />

      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Button
        title="Mandar Token"
        onPress={handleSubmit(onSubmit)}
        style={styles.button}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>
          ¿Recordaste tu contraseña?{' '}
          <Text style={styles.switchLink} onPress={onSwitch}>
            Iniciar Sesión
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.md,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginBottom: SPACING.sm,
  },
  button: {
    marginTop: SPACING.sm,
  },
  switchContainer: {
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  switchText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  switchLink: {
    color: COLORS.accent,
    fontWeight: '600',
  },
});

export default ForgotPasswordModal;
