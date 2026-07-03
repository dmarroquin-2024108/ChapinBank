import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, SHADOWS } from '../../../shared/constants/theme';
import { useAuthStore } from '../../../shared/store/authStore';
import Input from '../../../shared/components/common/Input';
import Button from '../../../shared/components/common/Button';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import ActivateRequestModal from '../components/ActivateRequestModal';
import ChangeTempPasswordModal from '../components/ChangeTempPasswordModal';
import { showToast } from '../../../shared/components/common/Toast';

const { width } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation();
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

  const [isForgot, setIsForgot] = useState(false);
  const [isActivate, setIsActivate] = useState(false);
  const [showTempModal, setShowTempModal] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const res = await login(data);

    if (res.success) {
      showToast('¡Bienvenido!', 'success');
    } else if (res.requiresPasswordChange) {
      setShowTempModal(true);
    } else {
      showToast(res.error, 'error');
    }
  };

  const getTitle = () => {
    if (isForgot) return 'Recuperar Contraseña';
    if (isActivate) return 'Activar Cuenta';
    return 'ChapinBank';
  };

  const getSubtitle = () => {
    if (isForgot) return 'Ingresa tu correo para recuperar tu acceso';
    if (isActivate) return 'Solicita la activación de tu cuenta';
    return 'Ingresa a tu cuenta de ChapinBank';
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../../assets/ChapinLogo.png')}
              style={styles.logo}
            />
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>
              Chapin
              <Text style={styles.bankText}>Bank</Text>
            </Text>
            <Text style={styles.subtitle}>{getSubtitle()}</Text>
          </View>

          {isForgot ? (
            <ForgotPasswordModal onSwitch={() => setIsForgot(false)} />
          ) : isActivate ? (
            <ActivateRequestModal onSwitch={() => setIsActivate(false)} />
          ) : (
            <View style={styles.form}>
              <Input
                label="Email o Username"
                placeholder="correo@example.com o Username"
                control={control}
                name="emailOrUsername"
                rules={{ required: 'Este campo es obligatorio' }}
              />

              <Input
                label="Contraseña"
                placeholder="* * * * * * *"
                secureTextEntry
                control={control}
                name="password"
                rules={{ required: 'Este campo es obligatorio' }}
              />

              <View style={styles.forgotContainer}>
                <Text
                  style={styles.forgotText}
                  onPress={() => setIsForgot(true)}
                >
                  ¿Olvidaste Contraseña?
                </Text>
              </View>

              {error && <Text style={styles.errorText}>{error}</Text>}

              <Button
                title={loading ? 'Iniciando...' : 'Iniciar Sesión'}
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                style={styles.button}
              />

              <View style={styles.activateContainer}>
                <Text style={styles.activateText}>
                  ¿No Tienes Activa tu Cuenta?{' '}
                  <Text
                    style={styles.activateLink}
                    onPress={() => setIsActivate(true)}
                  >
                    Activar Cuenta
                  </Text>
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {showTempModal && (
        <ChangeTempPasswordModal
          onClose={() => setShowTempModal(false)}
        />
      )}
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
    ...SHADOWS.large,
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },

  logo: {
    width: Math.min(width * 0.25, 100),
    height: Math.min(width * 0.25, 100),
    resizeMode: 'contain',
  },

  header: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },

  bankText: {
    color: COLORS.accent,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  form: {
    marginTop: SPACING.md,
  },

  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: SPACING.sm,
  },

  forgotText: {
    fontSize: 12,
    color: COLORS.accent,
  },

  errorText: {
    fontSize: 14,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },

  button: {
    marginTop: SPACING.sm,
  },

  activateContainer: {
    marginTop: SPACING.md,
    alignItems: 'center',
  },

  activateText: {
    fontSize: 14,
    color: COLORS.primary,
  },

  activateLink: {
    color: COLORS.accent,
    fontWeight: '600',
  },
});

export default LoginScreen;