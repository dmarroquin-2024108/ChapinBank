import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { PackagePlus } from 'lucide-react-native';
import { useProductStore } from '../store/productStore';
import { useSaveProduct } from '../hooks/useSaveProduct';
import { COLORS, SPACING, SHADOWS } from '../../../shared/constants/theme';
import { showToast } from '../../../shared/components/common/Toast';
import Header from '../../../shared/components/common/Header';
import ProductFormModal from '../components/ProductFormModal';
import ConfirmModal from '../../../shared/components/common/ConfirmModal';
import ProductCard from '../components/ProductCard';

const AdminProductsScreen = ({ rightAction }) => {
  const { products, loading, error, getAllProducts, deleteProduct } = useProductStore();
  const { saveProduct } = useSaveProduct();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [confirmModal, setConfirmModal] = useState({ open: false, title: '', message: '', onConfirm: null });

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  useEffect(() => {
    if (error) showToast(error, 'error');
  }, [error]);

  const openAdd = () => {
    setModalMode('add');
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const openEdit = (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteClick = (product) => {
    setConfirmModal({
      open: true,
      title: '¿Eliminar producto?',
      message: `Estás a punto de eliminar "${product.name}". Esta acción no se puede deshacer.`,
      onConfirm: async () => {
        await deleteProduct(product._id);
        setConfirmModal({ open: false, title: '', message: '', onConfirm: null });
      },
    });
  };

  const handleSubmit = async (formData) => {
    await saveProduct(formData, modalMode === 'edit' ? selectedProduct?._id : null);
    closeModal();
  };

  return (
    <View style={styles.screenContainer}>
      <Header title="Gestión de Productos" rightAction={rightAction} showMenu/>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Gestión de Productos</Text>
            <Text style={styles.headerSubtitle}>
              Catálogo Administrativo de ChapinBank
              {!loading && (
                <Text style={styles.headerSubtitleBold}> · {products.length} producto{products.length !== 1 ? 's' : ''}</Text>
              )}
            </Text>
          </View>
          <TouchableOpacity onPress={openAdd} style={styles.addButton}>
            <PackagePlus size={16} color="#fff" />
            <Text style={styles.addButtonText}>Agregar Producto</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.accent} />
            <Text style={styles.loadingText}>Cargando productos…</Text>
          </View>
        ) : products.length === 0 ? (
          <View style={styles.emptyContainer}>
            <PackagePlus size={40} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No hay productos en el catálogo. ¡Agrega el primero!</Text>
          </View>
        ) : (
          <View style={styles.productsGrid}>
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                canEdit
                canDelete
                onEdit={openEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        mode={modalMode}
        initialData={selectedProduct ?? {}}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        visible={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="Sí, eliminar"
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ open: false, title: '', message: '', onConfirm: null })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, marginBottom: SPACING.lg },
  headerText: { flex: 1, marginRight: SPACING.md },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.primaryDark },
  headerSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4},
  headerSubtitleBold: { fontWeight: '600', color: COLORS.primaryDark },
  addButton: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.accent, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, ...SHADOWS.small },
  addButtonText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  loadingContainer: { alignItems: 'center', paddingVertical: SPACING.xl },
  loadingText: { fontSize: 14, color: COLORS.textSecondary, marginTop: SPACING.sm },
  emptyContainer: { alignItems: 'center', paddingVertical: SPACING.xl },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, marginTop: SPACING.sm },
  productsGrid: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg, gap: SPACING.md },
});

export default AdminProductsScreen;
