import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CheckCircle, XCircle, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTransferStore } from '../store/transferStore';
import { formatAmount } from '../../../shared/utils/formatters';
import { COLORS, SPACING, SHADOWS } from '../../../shared/constants/theme';
import { showToast } from '../../../shared/components/common/Toast';

const ConfirmTransferScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { confirmTransfer, loading } = useTransferStore();
  
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [transferData, setTransferData] = useState(null);

  const urlToken = route.params?.token ?? '';
  const urlAction = route.params?.action ?? '';

  useEffect(() => {
    const processTransfer = async () => {
      if (!urlToken || !urlAction) {
        setStatus('error');
        setMessage('No se proporcionaron los parámetros necesarios');
        return;
      }

      const result = await confirmTransfer({ transferToken: urlToken, action: urlAction });
      
      if (result.success) {
        setStatus('success');
        setMessage(result.data?.message || 'Transferencia procesada exitosamente');
        setTransferData(result.data);
      } else {
        setStatus('error');
        setMessage(result.error || 'Error al procesar la transferencia');
      }
    };

    processTransfer();
  }, [urlToken, urlAction]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleRetry = () => {
    setStatus('loading');
    setMessage('');
    setTransferData(null);
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={20} color={COLORS.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirmar Transferencia</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {status === 'loading' && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={COLORS.accent} />
            <Text style={styles.loadingText}>Procesando transferencia…</Text>
          </View>
        )}

        {status === 'success' && (
          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <CheckCircle size={32} color={COLORS.success} />
            </View>
            <Text style={styles.successTitle}>¡Transferencia Procesada!</Text>
            <Text style={styles.successMessage}>{message}</Text>

            {transferData && (
              <View style={styles.detailsContainer}>
                <Text style={styles.detailsTitle}>Detalles de la operación</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>N° Operación:</Text>
                  <Text style={styles.detailValue}>{transferData.noOperacion || 'N/A'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Cuenta Origen:</Text>
                  <Text style={styles.detailValue}>{transferData.numberAccountOrigin || 'N/A'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Cuenta Destino:</Text>
                  <Text style={styles.detailValue}>{transferData.numberAccountDestination || 'N/A'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Monto:</Text>
                  <Text style={[styles.detailValue, styles.detailValueAccent]}>
                    {transferData.currency || 'GTQ'} {formatAmount(transferData.amount || 0)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Estado:</Text>
                  <Text style={[styles.detailValue, styles.detailValueSuccess]}>{transferData.status || 'Completado'}</Text>
                </View>
              </View>
            )}

            <TouchableOpacity onPress={handleBack} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Volver</Text>
            </TouchableOpacity>
          </View>
        )}

        {status === 'error' && (
          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <XCircle size={32} color={COLORS.error} />
            </View>
            <Text style={styles.errorTitle}>Error en la Transferencia</Text>
            <Text style={styles.errorMessage}>{message}</Text>

            <View style={styles.errorInfoContainer}>
              <AlertCircle size={16} color={COLORS.orange600} />
              <Text style={styles.errorInfoText}>
                {urlAction === 'CANCELAR' 
                  ? 'No se pudo cancelar la transferencia. Es posible que ya haya sido procesada o expirado el tiempo de cancelación.'
                  : 'No se pudo procesar la transferencia. Por favor, verifica los datos e intenta nuevamente.'}
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleBack} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Volver</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleRetry} style={styles.primaryButton}>
                <RefreshCw size={16} color="#fff" />
                <Text style={styles.primaryButtonText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl, paddingBottom: SPACING.md, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backButton: { padding: SPACING.sm },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primaryDark, marginLeft: SPACING.sm },
  container: { flex: 1 },
  contentContainer: { padding: SPACING.lg },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: SPACING.xl },
  loadingText: { fontSize: 16, color: COLORS.textSecondary, marginTop: SPACING.md },
  card: { backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.xl, ...SHADOWS.medium },
  iconContainer: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.successBg, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: SPACING.lg },
  successTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primaryDark, textAlign: 'center', marginBottom: SPACING.sm },
  successMessage: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.lg },
  errorTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primaryDark, textAlign: 'center', marginBottom: SPACING.sm },
  errorMessage: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.lg },
  errorInfoContainer: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm, backgroundColor: COLORS.orange100, borderRadius: 12, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, marginBottom: SPACING.lg },
  errorInfoText: { flex: 1, fontSize: 12, color: COLORS.orange600, lineHeight: 16 },
  detailsContainer: { backgroundColor: COLORS.background, borderRadius: 12, padding: SPACING.md, marginBottom: SPACING.lg },
  detailsTitle: { fontSize: 12, fontWeight: 'bold', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: SPACING.sm },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xs },
  detailLabel: { fontSize: 13, color: COLORS.textSecondary },
  detailValue: { fontSize: 13, fontWeight: '600', color: COLORS.primaryDark },
  detailValueAccent: { color: COLORS.accent },
  detailValueSuccess: { color: COLORS.success },
  buttonContainer: { flexDirection: 'row', gap: SPACING.sm },
  primaryButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, backgroundColor: COLORS.primaryDark, paddingVertical: 12, borderRadius: 12, ...SHADOWS.small },
  primaryButtonText: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
  secondaryButton: { flex: 1, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  secondaryButtonText: { fontSize: 14, fontWeight: '600', color: COLORS.primaryDark },
});

export default ConfirmTransferScreen;
