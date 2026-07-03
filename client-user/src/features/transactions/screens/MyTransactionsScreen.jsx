import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Package, CalendarDays, Tag, ReceiptText } from 'lucide-react-native';
import { useTransactionStore } from '../store/transactionStore';
import { formatDate, formatBalance } from '../../../shared/utils/formatters';
import { COLORS, SPACING, SHADOWS } from '../../../shared/constants/theme';
import { showToast } from '../../../shared/components/common/Toast';

const TransactionCard = ({ transaction }) => {
  const product = transaction.productId;

  return (
    <View style={styles.transactionCard}>
      {product?.imageUrl ? (
        <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
      ) : (
        <View style={styles.productImagePlaceholder}>
          <Package size={22} color={COLORS.textSecondary} />
        </View>
      )}
      <View style={styles.transactionInfo}>
        <View style={styles.transactionHeader}>
          <View style={styles.headerLeft}>
            {product?.type && (
              <Text style={styles.productType}>{product.type}</Text>
            )}
            <Text style={styles.productName} numberOfLines={2}>
              {product?.name ?? 'Producto eliminado'}
            </Text>
            {transaction.reference && (
              <Text style={styles.reference} numberOfLines={1}>{transaction.reference}</Text>
            )}
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.amount}>−{formatBalance(transaction.amount)}</Text>
            {transaction.pricing?.discountApplied && (
              <View style={styles.discountBadge}>
                <Tag size={9} color={COLORS.blue600} />
                <Text style={styles.discountText}>{(transaction.pricing.discountApplied * 100).toFixed(0)}% dto.</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.transactionFooter}>
          <CalendarDays size={11} color={COLORS.textSecondary} />
          <Text style={styles.date}>{formatDate(transaction.createdAt)}</Text>
        </View>
      </View>
    </View>
  );
};

const EmptyTransactions = () => (
  <View style={styles.emptyContainer}>
    <ReceiptText size={40} strokeWidth={1.5} color={COLORS.textSecondary} />
    <Text style={styles.emptyText}>No tienes transacciones registradas.</Text>
  </View>
);

const MyTransactionsScreen = ({ rightAction }) => {
  const { transactions, loading, error, getMyTransactions } = useTransactionStore();

  useEffect(() => {
    getMyTransactions();
  }, [getMyTransactions]);

  useEffect(() => {
    if (error) showToast(error, 'error');
  }, [error]);

  const completed = transactions.filter((t) => t.status === 'COMPLETED');

  return (
    <View style={styles.screenContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mis productos</Text>
          <Text style={styles.headerSubtitle}>
            Productos que has contratado con ChapinBank
            {!loading && completed.length > 0 && (
              <Text style={styles.headerSubtitleBold}> · {completed.length} activo{completed.length !== 1 ? 's' : ''}</Text>
            )}
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primaryDark} />
          </View>
        ) : completed.length === 0 ? (
          <EmptyTransactions />
        ) : (
          <View style={styles.transactionsList}>
            {completed.map((t) => (
              <TransactionCard key={t._id} transaction={t} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, marginBottom: SPACING.lg },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.primaryDark },
  headerSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  headerSubtitleBold: { fontWeight: '600', color: COLORS.primaryDark },
  loadingContainer: { paddingVertical: 96, justifyContent: 'center' },
  emptyContainer: { paddingVertical: 96, alignItems: 'center', gap: 12 },
  emptyText: { fontSize: 14, fontWeight: '500', color: COLORS.textSecondary },
  transactionsList: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg, gap: 12 },
  transactionCard: { flexDirection: 'row', gap: 16, backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: 16, ...SHADOWS.small },
  productImage: { width: 56, height: 56, borderRadius: 12 },
  productImagePlaceholder: { width: 56, height: 56, borderRadius: 12, backgroundColor: COLORS.gray100, justifyContent: 'center', alignItems: 'center' },
  transactionInfo: { flex: 1, minWidth: 0 },
  transactionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  headerLeft: { flex: 1, minWidth: 0 },
  productType: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, color: COLORS.textSecondary, marginBottom: 2 },
  productName: { fontSize: 16, fontWeight: 'bold', color: COLORS.primaryDark },
  reference: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  headerRight: { alignItems: 'flex-end' },
  amount: { fontSize: 16, fontWeight: '800', color: COLORS.accent },
  discountBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, backgroundColor: COLORS.blue100 },
  discountText: { fontSize: 10, fontWeight: 'bold', color: COLORS.blue600 },
  transactionFooter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  date: { fontSize: 12, color: COLORS.textSecondary },
});

export default MyTransactionsScreen;
