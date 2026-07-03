import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { ArrowLeftRight, Star, AlertCircle, Loader2, CheckCircle, RotateCcw, Clock } from 'lucide-react-native';
import { useTransferStore } from '../store/transferStore';
import { useAccountStore } from '../../accounts/store/accountsStore';
import { useFavoriteStore } from '../../favorites/store/favoriteStore';
import { getCurrencyRatesRequest } from '../../../shared/api/transfers.requests';
import { formatAmount, formatDate } from '../../../shared/utils/formatters';
import { COLORS, SPACING, SHADOWS } from '../../../shared/constants/theme';
import { showToast } from '../../../shared/components/common/Toast';
import CustomSelect from '../../../shared/components/common/CustomSelect';

const CURRENCIES = [
  { value: 'GTQ', label: 'GTQ · Q' },
  { value: 'USD', label: 'USD · $' },
  { value: 'EUR', label: 'EUR · €' },
  { value: 'MXN', label: 'MXN · $' },
];

const AVATAR_COLORS = [COLORS.primaryDark, COLORS.gold, COLORS.accent];

const getInitials = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';

const avatarColor = (str = '') => {
  let h = 0;
  for (const c of str) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
};

const CANCEL_WINDOW_SECONDS = 30 * 60;

const Field = ({ label, error, children, hint }) => (
  <View style={styles.field}>
    <Text style={styles.fieldLabel}>{label}</Text>
    {children}
    {hint && !error && <Text style={styles.fieldHint}>{hint}</Text>}
    {error && (
      <View style={styles.errorContainer}>
        <AlertCircle size={12} color={COLORS.error} />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )}
  </View>
);

const DetailRow = ({ label, value, accent = false }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={[styles.detailValue, accent && styles.detailValueAccent]}>{value}</Text>
  </View>
);

const TransferSuccessCard = ({ transfer, onCancel, onDismiss, cancelLoading }) => {
  const [secondsLeft, setSecondsLeft] = useState(CANCEL_WINDOW_SECONDS);
  const canCancel = secondsLeft > 0;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <CheckCircle size={20} color={COLORS.success} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Transferencia enviada</Text>
          <Text style={styles.headerSubtitle}>El destinatario recibirá un correo para aceptar o rechazar.</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <DetailRow label="N° operación" value={transfer.noOperacion} />
        <DetailRow label="Cuenta origen" value={transfer.numberAccountOrigin} />
        <DetailRow label="Cuenta destino" value={transfer.numberAccountDestination} />
        <DetailRow label="Monto" value={`${transfer.currency} ${formatAmount(transfer.amount)}`} accent />
        {transfer.currency !== 'GTQ' && <DetailRow label="Equivalente GTQ" value={`Q ${formatAmount(transfer.amountInGTQ)}`} />}
        {transfer.currency !== 'GTQ' && <DetailRow label="Tasa de cambio" value={`1 ${transfer.currency} = Q ${transfer.exchangeRate}`} />}
        <DetailRow label="Comisión" value={`Q ${formatAmount(transfer.commision)}`} />
        <DetailRow label="Nuevo saldo origen" value={`Q ${formatAmount(transfer.nuevoBalanceOrigen)}`} />
        <DetailRow label="Estado" value={transfer.status} />
      </View>

      <View style={styles.timerContainer}>
        <View style={styles.timerHeader}>
          <View style={styles.timerLabelContainer}>
            <Clock size={12} color={COLORS.textSecondary} />
            <Text style={styles.timerLabel}>{canCancel ? 'Tiempo para cancelar' : 'Tiempo expirado'}</Text>
          </View>
          <Text style={[styles.timerValue, !canCancel && styles.timerValueExpired]}>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(secondsLeft / CANCEL_WINDOW_SECONDS) * 100}%` }]} />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {canCancel && (
          <TouchableOpacity onPress={() => onCancel(transfer.transferToken)} disabled={cancelLoading} style={[styles.cancelButton, cancelLoading && styles.buttonDisabled]}>
            <RotateCcw size={14} color={COLORS.textSecondary} style={cancelLoading && styles.spinning} />
            <Text style={styles.cancelButtonText}>{cancelLoading ? 'Cancelando…' : 'Cancelar'}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onDismiss} style={[styles.newTransferButton, !canCancel && styles.newTransferButtonFull]}>
          <Text style={styles.newTransferButtonText}>Nueva transferencia</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const TransfersScreen = ({ navigation, rightAction }) => {
  const { createTransfer, confirmTransfer, loading, lastTransfer, clearLastTransfer } = useTransferStore();
  const { accounts, loading: accountsLoading } = useAccountStore();
  const { favorites, getFavorites, deleteFavorite } = useFavoriteStore();

  const [transferType, setTransferType] = useState('externa');
  const [currency, setCurrency] = useState('GTQ');
  const [originAccount, setOriginAccount] = useState('');
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [numberAccountDestination, setNumberAccountDestination] = useState('');
  const [destinationHolder, setDestinationHolder] = useState('');
  const [errors, setErrors] = useState({});
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    const activeAccount = accounts.find((acc) => acc.status);
    if (activeAccount) setOriginAccount(activeAccount.accountNumber);
  }, [accounts]);

  useEffect(() => {
    if (currency === 'GTQ') {
      setExchangeRate(null);
      return;
    }
    getCurrencyRatesRequest(currency)
      .then(({ data }) => setExchangeRate(data.data.rates?.GTQ ?? null))
      .catch(() => setExchangeRate(null));
  }, [currency]);

  const originOptions = accounts.filter((acc) => acc.status).map((acc) => ({
    value: acc.accountNumber,
    label: `${acc.accountType === 'AHORRO' ? 'Ahorro' : 'Monetaria'} · •••• ${acc.accountNumber.slice(-4)} · Q ${formatAmount(acc.balance)}`,
  }));

  const currentOriginAccount = accounts.find((a) => a.accountNumber === originAccount);

  const validateForm = () => {
    const newErrors = {};
    if (!amount) newErrors.amount = 'El monto es requerido';
    else if (parseFloat(amount) < 10) newErrors.amount = 'El monto mínimo es Q 10.00';
    else if (parseFloat(amount) > 2000) newErrors.amount = 'El monto máximo es Q 2,000.00';
    else if (!/^\d+(\.\d{1,2})?$/.test(amount)) newErrors.amount = 'Máximo 2 decimales';
    
    if (transferType === 'externa') {
      if (!numberAccountDestination) newErrors.numberAccountDestination = 'Este campo es obligatorio';
      if (!destinationHolder) newErrors.destinationHolder = 'Este campo es obligatorio';
    }
    
    if (description && description.length > 255) newErrors.description = 'Máximo 255 caracteres';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const originAcc = accounts.find((a) => a.accountNumber === originAccount);
    const destination = transferType === 'favorita' && selectedFavorite
      ? { numberAccountDestination: selectedFavorite.accountNumber, destinationHolder: selectedFavorite.alias }
      : { numberAccountDestination, destinationHolder };

    const res = await createTransfer({
      numberAccountOrigin: originAccount,
      originHolder: originAcc?.accountType ?? '',
      ...destination,
      amount: parseFloat(amount),
      currency,
      description,
    });

    if (res.success) {
      setAmount('');
      setDescription('');
      setNumberAccountDestination('');
      setDestinationHolder('');
      setSelectedFavorite(null);
    }
  };

  const handleCancel = async (transferToken) => {
    setCancelLoading(true);
    await confirmTransfer({ transferToken, action: 'CANCELAR' });
    setCancelLoading(false);
    clearLastTransfer();
  };

  const handleDeleteFavorite = async (id) => {
    const res = await deleteFavorite(id);
    if (res.success) {
      if (selectedFavorite?._id === id) setSelectedFavorite(null);
    }
  };

  const canSubmit = originAccount && (transferType === 'externa' || (transferType === 'favorita' && selectedFavorite !== null));

  return (
    <View style={styles.screenContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <ArrowLeftRight size={22} color={COLORS.accent} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Realizar transferencia</Text>
            <Text style={styles.headerSubtitle}>Envía dinero a cualquier cuenta o a tus favoritos</Text>
          </View>
        </View>

        {lastTransfer ? (
          <TransferSuccessCard transfer={lastTransfer} onCancel={handleCancel} onDismiss={clearLastTransfer} cancelLoading={cancelLoading} />
        ) : accountsLoading ? (
          <View style={styles.loadingContainer}>
            <Loader2 size={18} color={COLORS.textSecondary} style={styles.spinner} />
            <Text style={styles.loadingText}>Cargando…</Text>
          </View>
        ) : (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Detalles de la transferencia</Text>

            <Field label="Tipo de transferencia">
              <View style={styles.tabContainer}>
                {[
                  { id: 'externa', label: 'A otra cuenta' },
                  { id: 'favorita', label: 'Favoritos', icon: <Star size={13} color={COLORS.accent} /> },
                ].map((tab) => (
                  <TouchableOpacity
                    key={tab.id}
                    onPress={() => { setTransferType(tab.id); setSelectedFavorite(null); }}
                    style={[styles.tab, transferType === tab.id && styles.tabActive]}
                  >
                    {tab.icon}
                    <Text style={[styles.tabText, transferType === tab.id && styles.tabTextActive]}>{tab.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Field>

            <Field
              label="Cuenta origen"
              hint={currentOriginAccount ? `Saldo disponible: Q ${formatAmount(currentOriginAccount.balance)}` : undefined}
            >
              <CustomSelect value={originAccount} onChange={setOriginAccount} options={originOptions} />
            </Field>

            {transferType === 'externa' ? (
              <>
                <Field label="Número de cuenta destino" error={errors.numberAccountDestination}>
                  <TextInput
                    style={[styles.input, errors.numberAccountDestination && styles.inputError]}
                    value={numberAccountDestination}
                    onChangeText={setNumberAccountDestination}
                    placeholder="Ej. MO00000001"
                    autoCapitalize="characters"
                  />
                </Field>
                <Field label="Nombre del destinatario" error={errors.destinationHolder}>
                  <TextInput
                    style={[styles.input, errors.destinationHolder && styles.inputError]}
                    value={destinationHolder}
                    onChangeText={setDestinationHolder}
                    placeholder="Nombre completo"
                  />
                </Field>
              </>
            ) : (
              <View style={styles.favoritesContainer}>
                <Text style={styles.favoritesLabel}>Tus cuentas favoritas ({favorites.length})</Text>
                {favorites.length === 0 ? (
                  <View style={styles.emptyFavorites}>
                    <Star size={22} color={COLORS.textSecondary} style={styles.emptyIcon} />
                    <Text style={styles.emptyText}>Sin cuentas favoritas</Text>
                    <Text style={styles.emptySubtext}>Ve al módulo de Favoritos para agregar cuentas.</Text>
                  </View>
                ) : (
                  <View style={styles.favoritesList}>
                    {favorites.map((fav) => (
                      <TouchableOpacity
                        key={fav._id}
                        onPress={() => setSelectedFavorite(fav)}
                        style={[styles.favoriteItem, selectedFavorite?._id === fav._id && styles.favoriteItemSelected]}
                      >
                        <View style={[styles.avatar, { backgroundColor: avatarColor(fav.alias) }]}>
                          <Text style={styles.avatarText}>{getInitials(fav.alias)}</Text>
                        </View>
                        <View style={styles.favoriteInfo}>
                          <Text style={styles.favoriteAlias}>{fav.alias}</Text>
                          <Text style={styles.favoriteType}>{fav.accountType}</Text>
                          <Text style={styles.favoriteAccount}>•••• {fav.accountNumber.slice(-4)}</Text>
                        </View>
                        {selectedFavorite?._id === fav._id && <View style={styles.selectedDot} />}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {favorites.length > 0 && !selectedFavorite && (
                  <View style={styles.warningContainer}>
                    <AlertCircle size={12} color={COLORS.orange600} />
                    <Text style={styles.warningText}>Selecciona una cuenta favorita para continuar.</Text>
                  </View>
                )}
              </View>
            )}

            {(transferType === 'externa' || selectedFavorite) && (
              <>
                {transferType === 'favorita' && selectedFavorite && (
                  <View style={styles.selectedFavoriteCard}>
                    <View style={[styles.avatar, { backgroundColor: avatarColor(selectedFavorite.alias) }]}>
                      <Text style={styles.avatarText}>{getInitials(selectedFavorite.alias)}</Text>
                    </View>
                    <View style={styles.selectedFavoriteInfo}>
                      <Text style={styles.selectedFavoriteAlias}>{selectedFavorite.alias}</Text>
                      <Text style={styles.selectedFavoriteAccount}>{selectedFavorite.accountNumber}</Text>
                    </View>
                    <CheckCircle size={15} color={COLORS.accent} />
                  </View>
                )}

                <View style={styles.row}>
                  <Field label="Moneda" style={styles.half}>
                    <CustomSelect value={currency} onChange={setCurrency} options={CURRENCIES} />
                  </Field>
                  <Field label="Monto a transferir" error={errors.amount} style={styles.half}>
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
                      <Text style={styles.conversionFrom}>{formatAmount(parseFloat(amount))} {currency}</Text>
                      <Text style={styles.conversionArrow}>→</Text>
                      <Text style={styles.conversionTo}>Q {formatAmount(parseFloat(amount) * exchangeRate)}</Text>
                    </View>
                    <Text style={styles.exchangeRateText}>Tipo de cambio: 1 {currency} = Q {exchangeRate}</Text>
                  </View>
                )}

                <Field label="Descripción (opcional)" error={errors.description}>
                  <TextInput
                    style={[styles.textArea, errors.description && styles.textAreaError]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Motivo o referencia"
                    multiline
                    numberOfLines={3}
                    maxLength={255}
                  />
                </Field>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={() => { setAmount(''); setDescription(''); setNumberAccountDestination(''); setDestinationHolder(''); }} style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSubmit} disabled={loading || !canSubmit} style={[styles.confirmButton, (loading || !canSubmit) && styles.confirmButtonDisabled]}>
                    <Text style={styles.confirmButtonText}>{loading ? 'Procesando…' : 'Transferir'}</Text>
                  </TouchableOpacity>
                </View>
              </>
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
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.lg, paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl },
  iconContainer: { width: 48, height: 48, borderRadius: 16, backgroundColor: `${COLORS.accent}10`, justifyContent: 'center', alignItems: 'center' },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.primaryDark },
  headerSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, paddingVertical: SPACING.xl },
  spinner: { animation: 'spin 1s linear infinite' },
  loadingText: { fontSize: 14, color: COLORS.textSecondary },
  formCard: { backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.lg, marginHorizontal: SPACING.lg, marginBottom: SPACING.lg, ...SHADOWS.small },
  formTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.primaryDark, marginBottom: SPACING.md },
  field: { gap: 6 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, margin: 7 },
  fieldHint: { fontSize: 12, color: COLORS.textSecondary },
  errorContainer: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  errorText: { fontSize: 12, color: COLORS.error },
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
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, backgroundColor: COLORS.surface, paddingHorizontal: SPACING.sm, paddingVertical: 10, fontSize: 14, color: COLORS.textPrimary },
  inputError: { borderColor: COLORS.error },
  tabContainer: { flexDirection: 'row', gap: SPACING.sm },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: SPACING.md, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, backgroundColor: COLORS.background },
  tabActive: { backgroundColor: COLORS.surface, borderColor: COLORS.accent, ...SHADOWS.small },
  tabText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  tabTextActive: { color: COLORS.primaryDark },
  favoritesContainer: { gap: SPACING.sm },
  favoritesLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  emptyFavorites: { alignItems: 'center', paddingVertical: SPACING.xl },
  emptyIcon: { marginBottom: SPACING.sm },
  emptyText: { fontSize: 14, fontWeight: '500', color: COLORS.textSecondary },
  emptySubtext: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  favoritesList: { gap: SPACING.xs },
  favoriteItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.sm, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, backgroundColor: COLORS.surface },
  favoriteItemSelected: { borderColor: COLORS.accent, backgroundColor: `${COLORS.accent}05`, ...SHADOWS.small },
  avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
  favoriteInfo: { flex: 1 },
  favoriteAlias: { fontSize: 14, fontWeight: '600', color: COLORS.primaryDark },
  favoriteType: { fontSize: 12, color: COLORS.textSecondary },
  favoriteAccount: { fontSize: 12, color: COLORS.textSecondary, fontFamily: 'monospace', marginTop: 2 },
  selectedDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.accent },
  warningContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.orange100, borderRadius: 8, paddingHorizontal: SPACING.sm, paddingVertical: 8 },
  warningText: { fontSize: 12, color: COLORS.orange600 },
  selectedFavoriteCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: `${COLORS.accent}05`, borderWidth: 1, borderColor: `${COLORS.accent}20`, borderRadius: 12, paddingHorizontal: SPACING.sm, paddingVertical: 10 },
  selectedFavoriteInfo: { flex: 1 },
  selectedFavoriteAlias: { fontSize: 12, fontWeight: 'bold', color: COLORS.primaryDark, margin: 4 },
  selectedFavoriteAccount: { fontSize: 12, color: COLORS.textSecondary },
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
  card: { backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.lg, ...SHADOWS.small },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm, marginBottom: SPACING.md },
  iconContainer: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.successBg, justifyContent: 'center', alignItems: 'center' },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.primaryDark },
  headerSubtitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  detailsContainer: { backgroundColor: COLORS.background, borderRadius: 12, padding: SPACING.md, gap: SPACING.xs, marginBottom: SPACING.md },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailLabel: { fontSize: 12, color: COLORS.textSecondary },
  detailValue: { fontSize: 12, fontWeight: '600', color: COLORS.primaryDark },
  detailValueAccent: { color: COLORS.accent },
  timerContainer: { marginBottom: SPACING.md },
  timerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  timerLabelContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timerLabel: { fontSize: 12, color: COLORS.textSecondary },
  timerValue: { fontSize: 12, fontWeight: 'bold', color: COLORS.accent },
  timerValueExpired: { color: COLORS.textSecondary },
  progressBar: { height: 6, backgroundColor: COLORS.background, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.accent, borderRadius: 3 },
  newTransferButton: { flex: 1, backgroundColor: COLORS.primaryDark, paddingVertical: 10, paddingHorizontal: SPACING.md, borderRadius: 12, alignItems: 'center' },
  newTransferButtonFull: { flex: 1 },
  newTransferButtonText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  buttonDisabled: { opacity: 0.6 },
  spinning: { animation: 'spin 1s linear infinite' },
});

export default TransfersScreen;
