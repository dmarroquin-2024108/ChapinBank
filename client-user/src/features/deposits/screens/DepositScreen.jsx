import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { ArrowDownToLine, AlertCircle, Loader2 } from 'lucide-react-native';
import { useDepositStore } from '../store/depositStore';
import { useAccountStore } from '../../accounts/store/accountsStore';
import { getCurrencyRequest } from '../../../shared/api/deposits.requests';
import DepositSuccessCard from '../components/DepositSuccessCard';
import { COLORS, SPACING, SHADOWS } from '../../../shared/constants/theme';
import { formatAmount } from '../../../shared/utils/formatters';
import { showToast } from '../../../shared/components/common/Toast';
import CustomSelect from '../../../shared/components/common/CustomSelect';

const DEPOSIT_METHODS = [
  { value: 'EFECTIVO', label: 'Efectivo' },
  { value: 'CHEQUE', label: 'Cheque' },
];

const CURRENCIES = [
  { value: 'GTQ', label: 'GTQ · Q' },
  { value: 'USD', label: 'USD · $' },
  { value: 'EUR', label: 'EUR · €' },
  { value: 'MXN', label: 'MXN · $' },
];


const Field = ({ label, error, children }) => (
  <View style={styles.field}>
    <Text style={styles.fieldLabel}>{label}</Text>
    {children}
    {error && (
      <View style={styles.errorContainer}>
        <AlertCircle width={12} height={12} stroke={COLORS.error} />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )}
  </View>
);

const DepositScreen = ({ rightAction }) => {
  const { createDeposit, revertDeposit, loading, lastDeposit, clearLastDeposit } = useDepositStore();
  const { accounts, loading: accountsLoading } = useAccountStore();
  const [depositMethod, setDepositMethod] = useState('EFECTIVO');
  const [currency, setCurrency] = useState('GTQ');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [revertLoading, setRevertLoading] = useState(false);

  useEffect(() => {
    if (accounts.length > 0 && !selectedAccount) {
      setSelectedAccount(accounts[0].accountNumber);
    }
  }, [accounts]);

  useEffect(() => {
    if (currency === 'GTQ') {
      setExchangeRate(null);
      return;
    }
    getCurrencyRequest(currency)
      .then(({ data }) => setExchangeRate(data.data.exchangeRate))
      .catch(() => setExchangeRate(null));
  }, [currency]);

  const accountOptions = accounts
    .filter((acc) => acc.status)
    .map((acc) => ({
      value: acc.accountNumber,
      label: `${acc.accountType === 'AHORRO' ? 'Cuenta de Ahorro' : 'Cuenta Monetaria'} · •••• ${acc.accountNumber.slice(-4)} · Q ${formatAmount(acc.balance)}`,
    }));

  const currentAccount = accounts.find((a) => a.accountNumber === selectedAccount);

  const validateForm = () => {
    const newErrors = {};
    if (!amount) {
      newErrors.amount = 'El monto es requerido';
    } else if (parseFloat(amount) < 1) {
      newErrors.amount = 'El monto mínimo es Q 1.00';
    } else if (parseFloat(amount) > 999999999.99) {
      newErrors.amount = 'El monto máximo es Q 999,999,999.99';
    } else if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
      newErrors.amount = 'Máximo 2 decimales';
    }
    if (description && description.length > 255) {
      newErrors.description = 'Máximo 255 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const res = await createDeposit({
      accountNumber: selectedAccount,
      amount: parseFloat(amount),
      currency,
      depositMethod,
      description: description?.trim() || undefined,
    });

    if (res.success) {
      setAmount('');
      setDescription('');
      showToast('Depósito registrado exitosamente', 'success');
    } else {
      showToast(res.error, 'error');
    }
  };

  const handleRevert = async (depositId) => {
    setRevertLoading(true);
    const res = await revertDeposit(depositId);
    setRevertLoading(false);
    if (res.success) {
      clearLastDeposit();
      showToast('Depósito revertido exitosamente', 'success');
    } else {
      showToast(res.error, 'error');
    }
  };

  return (
    <View style={styles.screenContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <ArrowDownToLine width={22} height={22} stroke={COLORS.accent} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Realizar un depósito</Text>
            <Text style={styles.headerSubtitle}>Acredita fondos en tus cuentas ChapinBank</Text>
          </View>
        </View>

        {lastDeposit ? (
          <DepositSuccessCard
            deposit={lastDeposit}
            onRevert={handleRevert}
            onDismiss={clearLastDeposit}
            revertLoading={revertLoading}
          />
        ) : (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Detalles del depósito</Text>

            {accountsLoading ? (
              <View style={styles.loadingContainer}>
                <Loader2 width={18} height={18} stroke={COLORS.textSecondary} style={styles.spinner} />
                <Text style={styles.loadingText}>Cargando cuentas…</Text>
              </View>
            ) : accounts.length === 0 ? (
              <Text style={styles.noAccountsText}>No tienes cuentas registradas.</Text>
            ) : (
              <View style={styles.form}>
                <Field label="Cuenta destino">
                  <CustomSelect
                    value={selectedAccount}
                    onChange={setSelectedAccount}
                    options={accountOptions}
                  />
                </Field>

                {currentAccount && (
                  <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Saldo actual</Text>
                    <Text style={styles.balanceValue}>Q {formatAmount(currentAccount.balance)}</Text>
                  </View>
                )}

                <Field label="Método de depósito">
                  <CustomSelect
                    value={depositMethod}
                    onChange={setDepositMethod}
                    options={DEPOSIT_METHODS}
                  />
                </Field>

                <View style={styles.row}>
                  <Field label="Moneda" style={styles.half}>
                    <CustomSelect value={currency} onChange={setCurrency} options={CURRENCIES} />
                  </Field>
                  <Field label="Monto a depositar" error={errors.amount} style={styles.half}>
                    <View style={styles.amountInputContainer}>
                      <Text style={styles.amountPrefix}>Q</Text>
                      <TextInput
                        style={[styles.amountInput, errors.amount && styles.amountInputError]}
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="0.00"
                        keyboardType="decimal-pad"
                        maxLength={12}
                      />
                    </View>
                  </Field>
                </View>

                {currency !== 'GTQ' && exchangeRate && parseFloat(amount) > 0 && (
                  <View style={styles.conversionCard}>
                    <Text style={styles.conversionLabel}>Conversión a Quetzales</Text>
                    <View style={styles.conversionRow}>
                      <Text style={styles.conversionFrom}>
                        $ {formatAmount(parseFloat(amount))}
                      </Text>
                      <Text style={styles.conversionArrow}>→</Text>
                      <Text style={styles.conversionTo}>
                        Q {formatAmount(parseFloat(amount) * exchangeRate)}
                      </Text>
                    </View>
                    <Text style={styles.exchangeRateText}>
                      Tipo de cambio: 1 {currency} = Q {exchangeRate}
                    </Text>
                  </View>
                )}

                <Field label="Referencia (opcional)" error={errors.description}>
                  <TextInput
                    style={[styles.textArea, errors.description && styles.textAreaError]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Agrega una nota o referencia para este depósito"
                    multiline
                    numberOfLines={3}
                    maxLength={255}
                  />
                </Field>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      setAmount('');
                      setDescription('');
                    }}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading}
                    style={[styles.confirmButton, loading && styles.confirmButtonDisabled]}
                  >
                    <Text style={styles.confirmButtonText}>
                      {loading ? 'Procesando…' : 'Confirmar'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.lg, paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg },
  iconContainer: { width: 48, height: 48, borderRadius: 16, backgroundColor: `${COLORS.accent}10`, justifyContent: 'center', alignItems: 'center' },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.primaryDark },
  headerSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  formCard: { backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.lg, marginHorizontal: SPACING.lg, marginBottom: SPACING.lg, ...SHADOWS.small },
  formTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.primaryDark, marginBottom: SPACING.md },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, paddingVertical: SPACING.xl },
  spinner: { animation: 'spin 1s linear infinite' },
  loadingText: { fontSize: 14, color: COLORS.textSecondary },
  noAccountsText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', paddingVertical: SPACING.xl },
  form: { gap: SPACING.md },
  field: { gap: 6 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  selectContainer: { position: 'relative' },
  selectButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.sm, paddingVertical: 10, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, backgroundColor: COLORS.surface },
  selectButtonDisabled: { opacity: 0.6 },
  selectText: { fontSize: 14, color: COLORS.textPrimary },
  selectTextDisabled: { color: COLORS.textSecondary },
  selectIcon: { marginLeft: SPACING.sm },
  selectIconRotated: { transform: [{ rotate: '180deg' }] },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', padding: SPACING.lg },
  selectDropdown: { backgroundColor: COLORS.surface, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.large },
  selectOption: { padding: SPACING.sm, paddingHorizontal: SPACING.md },
  selectOptionSelected: { backgroundColor: `${COLORS.accent}10` },
  selectOptionText: { fontSize: 14, color: COLORS.textPrimary },
  selectOptionTextSelected: { color: COLORS.accent, fontWeight: '600' },
  errorContainer: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  errorText: { fontSize: 12, color: COLORS.error },
  balanceCard: { backgroundColor: COLORS.background, borderRadius: 12, paddingHorizontal: SPACING.md, paddingVertical: 12 },
  balanceLabel: { fontSize: 12, color: COLORS.textSecondary },
  balanceValue: { fontSize: 18, fontWeight: '800', color: COLORS.primaryDark, marginTop: 2 },
  row: { flexDirection: 'row', gap: SPACING.md },
  half: { flex: 1 },
  amountInputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, backgroundColor: COLORS.surface },
  amountInput: { flex: 1, paddingHorizontal: SPACING.sm, paddingVertical: 10, fontSize: 14, color: COLORS.textPrimary },
  amountInputError: { borderColor: COLORS.error },
  amountPrefix: { paddingHorizontal: SPACING.sm, fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  conversionCard: { backgroundColor: `${COLORS.accent}05`, borderWidth: 1, borderColor: `${COLORS.accent}20`, borderRadius: 12, paddingHorizontal: SPACING.md, paddingVertical: 12 },
  conversionLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  conversionRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  conversionFrom: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  conversionArrow: { fontSize: 14, fontWeight: 'bold', color: COLORS.accent },
  conversionTo: { fontSize: 18, fontWeight: '800', color: COLORS.accent },
  exchangeRateText: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  textArea: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, backgroundColor: COLORS.surface, paddingHorizontal: SPACING.sm, paddingVertical: 10, fontSize: 14, color: COLORS.textPrimary, minHeight: 80, textAlignVertical: 'top' },
  textAreaError: { borderColor: COLORS.error },
  buttonContainer: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.xs },
  cancelButton: { flex: 1, borderWidth: 1, borderColor: COLORS.border, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  cancelButtonText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  confirmButton: { flex: 1, backgroundColor: COLORS.accent, paddingVertical: 12, borderRadius: 12, alignItems: 'center', ...SHADOWS.medium },
  confirmButtonDisabled: { opacity: 0.6 },
  confirmButtonText: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
});

export default DepositScreen;
