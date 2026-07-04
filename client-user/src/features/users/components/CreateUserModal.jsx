import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Shield } from 'lucide-react-native';
import Input from '../../../shared/components/common/Input';
import Button from '../../../shared/components/common/Button';
import { COLORS, SPACING, SHADOWS } from '../../../shared/constants/theme';
import { showToast } from '../../../shared/components/common/Toast';
import { useAdminStore } from '../../admin/store/adminStore';
import CustomSelect from '../../../shared/components/common/CustomSelect'

const ROLE_OPTIONS = [
  { value: 'USER_ROLE', label: 'Usuario' },
  { value: 'ADMIN_ROLE', label: 'Admin' },
];

const CreateUserModal = ({ visible, onClose, currentUserRole }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm();
  const { createUser } = useAdminStore();
  const availableRoles = currentUserRole === 'SUPERADMIN_ROLE'
    ? ROLE_OPTIONS
    : ROLE_OPTIONS.filter((r) => r.value === 'USER_ROLE');

  const onSubmit = async (formData) => {
    const payload = {
      name: formData.name,
      surname: formData.surname,
      username: formData.username,
      email: formData.email,
      dpi: formData.dpi,
      phone: formData.phone,
      direction: formData.direction,
      nameWork: formData.nameWork,
      ingresosMensuales: parseFloat(formData.ingresosMensuales),
      role: formData.role,
      password: formData.password,
    };

    const response = await createUser(payload);
    if (response?.success) {
      showToast('Usuario creado correctamente. Se enviará un correo de verificación.', 'success');
      reset();
      onClose(true);
    } else {
      showToast(response?.error ?? 'Error al crear el usuario.', 'error');
    }
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
                <Shield size={24} color="#fff" />
              </View>
            </View>
          </View>

          <View style={styles.headerContent}>
            <Text style={styles.title}>Crear nuevo usuario</Text>
            <Text style={styles.subtitle}>
              Se enviará un correo de verificación al usuario registrado.
            </Text>
          </View>

          <View style={styles.divider} />

          <ScrollView style={styles.formContainer}>
            <View style={styles.row}>
              <View style={styles.half}>
                <Input
                  label="Nombre"
                  placeholder="Juan"
                  control={control}
                  name="name"
                  rules={{
                    required: 'El nombre es obligatorio',
                    maxLength: { value: 25, message: 'Máximo 25 caracteres' },
                  }}
                />
              </View>

              <View style={styles.half}>
                <Input
                  label="Apellido"
                  placeholder="Pérez"
                  control={control}
                  name="surname"
                  rules={{
                    required: 'El apellido es obligatorio',
                    maxLength: { value: 25, message: 'Máximo 25 caracteres' },
                  }}
                />
              </View>

              <View style={styles.half}>
                <Input
                  label="Username"
                  placeholder="juanperez123"
                  control={control}
                  name="username"
                  rules={{ required: 'El username es obligatorio' }}
                />
              </View>

              <View style={styles.half}>
                <Input
                  label="Correo electrónico"
                  placeholder="juan@email.com"
                  control={control}
                  name="email"
                  rules={{
                    required: 'El correo es obligatorio',
                    pattern: { value: /^\S+@\S+$/i, message: 'Correo inválido' },
                  }}
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.half}>
                <Input
                  label="DPI"
                  placeholder="1234567890123"
                  control={control}
                  name="dpi"
                  rules={{
                    required: 'El DPI es obligatorio',
                    pattern: { value: /^\d{13}$/, message: 'Debe tener exactamente 13 dígitos' },
                  }}
                  keyboardType="numeric"
                  maxLength={13}
                />
              </View>

              <View style={styles.half}>
                <Input
                  label="Teléfono"
                  placeholder="55554444"
                  control={control}
                  name="phone"
                  rules={{
                    required: 'El teléfono es obligatorio',
                    pattern: { value: /^\d{8}$/, message: 'Debe tener exactamente 8 dígitos' },
                  }}
                  keyboardType="numeric"
                  maxLength={8}
                />
              </View>

              <View style={styles.full}>
                <Input
                  label="Dirección"
                  placeholder="Zona 1, Ciudad de Guatemala"
                  control={control}
                  name="direction"
                  rules={{ required: 'La dirección es obligatoria' }}
                />
              </View>

              <View style={styles.half}>
                <Input
                  label="Lugar de trabajo"
                  placeholder="Chapin Bank"
                  control={control}
                  name="nameWork"
                  rules={{ required: 'El lugar de trabajo es obligatorio' }}
                />
              </View>

              <View style={styles.half}>
                <Input
                  label="Ingresos mensuales (Q)"
                  placeholder="500.00"
                  control={control}
                  name="ingresosMensuales"
                  rules={{
                    required: 'Los ingresos son obligatorios',
                    min: { value: 100, message: 'Mínimo Q.100.00' },
                  }}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.half}>
                <Text style={styles.fieldLabel}>Rol</Text>
                <Controller
                  control={control}
                  name="role"
                  rules={{ required: 'El rol es obligatorio' }}
                  defaultValue={availableRoles[0]?.value}
                  render={({ field: { value, onChange } }) => (
                    <CustomSelect
                      value={value}
                      onChange={onChange}
                      options={availableRoles}
                    />
                  )}
                />
                {errors.role && <Text style={styles.errorText}>{errors.role.message}</Text>}
              </View>

              <View style={styles.full}>
                <Input
                  label="Contraseña temporal"
                  placeholder="Mínimo 8 caracteres"
                  secureTextEntry
                  control={control}
                  name="password"
                  rules={{
                    required: 'La contraseña es obligatoria',
                    minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                  }}
                />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title="Cancelar"
                onPress={() => {
                  reset();
                  onClose();
                }}
                variant="outline"
                style={styles.button}
              />
              <Button
                title="Crear"
                onPress={handleSubmit(onSubmit)}
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
  headerContent: {
    paddingTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
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
  full: {
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  button: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 2,
  },
});

export default CreateUserModal;
