import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../../shared/store/authStore';
import Button from '../../../shared/components/common/Button';
import { COLORS, SPACING } from '../../../shared/constants/theme';

const ActivateAccountScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const token = route.params?.token;
  
  const { activateUser, loading } = useAuthStore();
  const [verified, setVerified] = useState(null);

  useEffect(() => {
    const verify = async () => {
      const resultado = await activateUser({ token });
      if (resultado.success) {
        setVerified(true);
      } else {
        setVerified(false);
      }
    };
    if (token) verify();
  }, [token]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.logoText1}>Chapin</Text>
            <Text style={styles.logoText2}>Bank</Text>
          </View>

          <Text style={styles.title}>
            {loading
              ? 'Verificando tu cuenta...'
              : verified
                ? '¡Tu cuenta ha sido activada!'
                : 'No se pudo activar la cuenta'}
          </Text>

          <View style={styles.content}>
            {loading && <Text style={styles.loadingText}>Por favor espera...</Text>}

            {verified === true && (
              <>
                <Text style={styles.successText}>
                  Tu cuenta ha sido verificada exitosamente. Ya puedes iniciar sesión.
                </Text>

                <Button
                  title="Iniciar Sesión"
                  onPress={() => navigation.goBack()}
                  style={styles.button}
                />
              </>
            )}

            {verified === false && (
              <>
                <Text style={styles.errorText}>
                  El enlace de verificación es inválido o ya fue utilizado.
                </Text>

                <Button
                  title="Volver al Inicio"
                  onPress={() => navigation.goBack()}
                  style={styles.button}
                />
              </>
            )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  logoText1: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  logoText2: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  content: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  successText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 24,
  },
  button: {
    marginTop: SPACING.md,
  },
});

export default ActivateAccountScreen;
