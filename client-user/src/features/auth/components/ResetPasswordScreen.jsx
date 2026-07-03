import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../../shared/store/authStore';
import Input from '../../../shared/components/common/Input';
import Button from '../../../shared/components/common/Button';
import { COLORS, SPACING } from '../../../shared/constants/theme';
import { showToast } from '../../../shared/components/common/Toast';

const ResetPasswordScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const token = route.params?.token;
  
  const { resetPassword, loading, error } = useAuthStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!token) {
      showToast('Token no proporcionado', 'error');
      navigation.goBack();
    }
  }, [token]);

  const onSubmit = async (formData) => {
    const resultado = await resetPassword({ token, NewPassword: formData.NewPassword });
    if (resultado.success) {
      showToast('Contraseña Actualizada', 'success');
      navigation.goBack();
    } else {
      showToast('El enlace ya expiró o no es válido, solicite uno nuevo', 'error');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Cambiar Contraseña</Text>
          <Text style={styles.subtitle}>Ingresa tu nueva contraseña</Text>

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
            title={loading ? 'Cambiando...' : 'Cambiar contraseña'}
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.button}
          />

          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>
              ¿Recordaste tu contraseña?{' '}
              <Text style={styles.switchLink} onPress={() => navigation.goBack()}>
                Iniciar Sesión
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: SPACING.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
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

export default ResetPasswordScreen;
