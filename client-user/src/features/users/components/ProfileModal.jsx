import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { useUserStore } from '../store/userStore';
import Input from '../../../shared/components/common/Input';
import Button from '../../../shared/components/common/Button';
import { COLORS, SPACING, SHADOWS } from '../../../shared/constants/theme';
import { showToast } from '../../../shared/components/common/Toast';

const ProfileModal = ({ visible, onClose, userBase }) => {
  const { profile, loading, getPerfil, editPerfil } = useUserStore();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm();

  useEffect(() => {
    if (visible) getPerfil();
  }, [visible]);

  useEffect(() => {
    if (profile) {
      reset({
        username: profile.username ?? '',
        email: profile.email ?? '',
        phone: profile.phone ?? '',
        direction: profile.direction ?? '',
        nameWork: profile.nameWork ?? '',
        ingresosMensuales:
          profile.ingresosMensuales != null ? String(profile.ingresosMensuales) : '',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (formData) => {
    const payload = Object.fromEntries(
      Object.entries(formData).filter(([key, value]) => {
        if (value === '' || value == null) return false;
        return value !== profile[key];
      })
    );

    if (payload.ingresosMensuales !== undefined) {
      payload.ingresosMensuales = Number(payload.ingresosMensuales);
    }

    if (Object.keys(payload).length === 0) {
      showToast('No realizaste ningún cambio', 'info');
      return;
    }

    const response = await editPerfil(payload);
    if (response.success) {
      showToast('Perfil actualizado correctamente', 'success');
      onClose();
    } else {
      showToast(response.error, 'error');
    }
  };

  const getInitials = () => {
    if (userBase?.name && userBase?.surname) {
      return `${userBase.name[0]}${userBase.surname[0]}`.toUpperCase();
    }
    return 'U';
  };

  const getFullName = () => {
    if (userBase?.name && userBase?.surname) {
      return `${userBase.name} ${userBase.surname}`.trim();
    }
    return 'Usuario';
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modal}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials()}</Text>
              </View>
            </View>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{getFullName()}</Text>
            <View style={styles.userMeta}>
              <Text style={styles.userEmail}>{profile?.email}</Text>
              <Text style={styles.userRole}>{userBase?.role ?? 'USER'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <ScrollView style={styles.formContainer}>
            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>Nombre Completo</Text>
                <View style={styles.disabledInput}>
                  <Text style={styles.disabledText}>{getFullName() || '-'}</Text>
                </View>
              </View>

              <View style={styles.half}>
                <Text style={styles.label}>Rol</Text>
                <View style={styles.disabledInput}>
                  <Text style={styles.disabledText}>{userBase?.role ?? '-'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.half}>
                <Input
                  label="Username"
                  control={control}
                  name="username"
                  rules={{ minLength: { value: 5, message: 'Mínimo 5 caracteres' } }}
                />
              </View>

              <View style={styles.half}>
                <Input
                  label="Correo electrónico"
                  control={control}
                  name="email"
                  rules={{ pattern: { value: /^\S+@\S+$/i, message: 'Email inválido' } }}
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.half}>
                <Input
                  label="Teléfono"
                  control={control}
                  name="phone"
                  rules={{
                    minLength: { value: 8, message: '8 dígitos' },
                    maxLength: { value: 8, message: '8 dígitos' },
                    pattern: { value: /^\d+$/, message: 'Solo números' },
                  }}
                  keyboardType="numeric"
                  maxLength={8}
                />
              </View>

              <View style={styles.half}>
                <Input
                  label="Dirección"
                  control={control}
                  name="direction"
                />
              </View>

              <View style={styles.half}>
                <Input
                  label="Lugar de trabajo"
                  control={control}
                  name="nameWork"
                  rules={{ minLength: { value: 5, message: 'Mínimo 5 caracteres' } }}
                />
              </View>

              <View style={styles.half}>
                <Input
                  label="Ingresos mensuales (Q)"
                  control={control}
                  name="ingresosMensuales"
                  rules={{ min: { value: 100, message: 'Mínimo Q.100' } }}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title="Cancelar"
                onPress={onClose}
                variant="outline"
                style={styles.button}
              />
              <Button
                title={loading ? 'Guardando...' : 'Guardar'}
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                disabled={!isDirty}
                style={styles.button}
              />
            </View>
          </ScrollView>
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
    borderRadius: 20,
    ...SHADOWS.large,
    maxHeight: '90%',
  },
  header: {
    height: 96,
    backgroundColor: COLORS.primaryDark,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    zIndex: 1,
  },
  closeButtonText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 20,
    fontWeight: '600',
  },
  avatarContainer: {
    position: 'absolute',
    bottom: -32,
    left: SPACING.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.accent,
    borderWidth: 4,
    borderColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userInfo: {
    paddingTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 4,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  userEmail: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  userRole: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
  },
  formContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  half: {
    flex: 1,
    minWidth: '45%',
  },
  label: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  disabledInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },
  disabledText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  button: {
    flex: 1,
  },
});

export default ProfileModal;
