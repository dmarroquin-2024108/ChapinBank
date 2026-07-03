import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Edit, Trash2, ShoppingCart, CheckCircle, Package } from 'lucide-react-native';
import { formatAmount } from '../../../shared/utils/formatters';
import { COLORS, SPACING, SHADOWS } from '../../../shared/constants/theme';

const CATEGORY_CONFIG = {
  SEGURO: {
    label: 'Seguro',
    gradient: ['#FEF3C7', '#F59E0B'],
    badge: { bg: COLORS.yellow100, text: COLORS.yellow700 },
  },
  VIAJE: {
    label: 'Viaje',
    gradient: ['#F59E0B', '#EA580C'],
    badge: { bg: COLORS.orange100, text: COLORS.orange700 },
  },
  SUSCRIPCION: {
    label: 'Suscripción',
    gradient: ['#1D4ED8', '#312E81'],
    badge: { bg: COLORS.blue100, text: COLORS.blue700 },
  },
};

const DEFAULT_CONFIG = {
  label: 'Producto',
  gradient: ['#64748B', '#334155'],
  badge: { bg: COLORS.gray100, text: COLORS.gray700 },
};

const ProductCard = ({ product, canEdit = false, canDelete = false, canBuy = false, alreadyOwned = false, onEdit, onDelete, onBuy }) => {
  const config = CATEGORY_CONFIG[product.type] ?? DEFAULT_CONFIG;

  return (
    <View style={styles.productCard}>
      <LinearGradient colors={config.gradient} style={styles.cardHeader}>
        {product.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
        ) : (
          <View style={styles.placeholderPattern}>
            <Package size={32} color="rgba(255,255,255,0.3)" />
          </View>
        )}
        <View style={styles.typeBadgeContainer}>
          <View style={[styles.typeBadge, { backgroundColor: config.badge.bg }]}>
            <Text style={[styles.typeBadgeText, { color: config.badge.text }]}>{product.type}</Text>
          </View>
        </View>
        {alreadyOwned && (
          <View style={styles.ownedBadge}>
            <CheckCircle size={11} color={COLORS.success} />
            <Text style={styles.ownedBadgeText}>Contratado</Text>
          </View>
        )}
        <LinearGradient colors={['rgba(0,0,0,0.6)', 'transparent']} style={styles.titleOverlay}>
          <Text style={styles.productTitle} numberOfLines={2}>{product.name}</Text>
        </LinearGradient>
      </LinearGradient>

      <View style={styles.cardBody}>
        {product.description && (
          <Text style={styles.description} numberOfLines={2}>{product.description}</Text>
        )}
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Precio mensual</Text>
          <Text style={styles.price}>Q {formatAmount(product.price)}</Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        {canBuy && (
          <TouchableOpacity
            onPress={() => onBuy?.(product)}
            disabled={alreadyOwned}
            style={[styles.buyButton, alreadyOwned && styles.buyButtonDisabled]}
          >
            {alreadyOwned ? (
              <>
                <CheckCircle size={14} color={COLORS.textSecondary} />
                <Text style={[styles.buyButtonText, alreadyOwned && styles.buyButtonTextDisabled]}>Ya contratado</Text>
              </>
            ) : (
              <>
                <ShoppingCart size={14} color="#fff" />
                <Text style={styles.buyButtonText}>Contratar</Text>
              </>
            )}
          </TouchableOpacity>
        )}
        {canEdit && (
          <TouchableOpacity onPress={() => onEdit?.(product)} style={styles.iconButton}>
            <Edit size={16} color={COLORS.blue500} />
          </TouchableOpacity>
        )}
        {canDelete && (
          <TouchableOpacity onPress={() => onDelete?.(product)} style={styles.iconButton}>
            <Trash2 size={16} color={COLORS.error} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productCard: { backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.small, overflow: 'hidden' },
  cardHeader: { height: 176, position: 'relative', overflow: 'hidden' },
  productImage: { position: 'absolute', width: '100%', height: '100%', opacity: 0.6 },
  placeholderPattern: { position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', opacity: 0.1 },
  typeBadgeContainer: { position: 'absolute', top: 12, left: 12 },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  typeBadgeText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  ownedBadge: { position: 'absolute', top: 12, right: 12, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.9)', ...SHADOWS.small },
  ownedBadgeText: { fontSize: 10, fontWeight: 'bold', color: COLORS.success },
  titleOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingVertical: 16 },
  productTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  cardBody: { padding: 16, gap: 12 },
  description: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },
  priceContainer: { marginTop: 'auto' },
  priceLabel: { fontSize: 10, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1, fontWeight: '500' },
  price: { fontSize: 20, fontWeight: '800', color: COLORS.primaryDark },
  cardActions: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 16 },
  buyButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 12, backgroundColor: COLORS.accent, ...SHADOWS.small },
  buyButtonDisabled: { backgroundColor: COLORS.gray100 },
  buyButtonText: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
  buyButtonTextDisabled: { color: COLORS.textSecondary },
  iconButton: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border },
});

export default ProductCard;
