import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { X, Trash2 } from 'lucide-react-native';
import { useFavoriteStore } from '../store/favoriteStore';
import { COLORS, SPACING, SHADOWS } from '../../../shared/constants/theme';
import { showToast } from '../../../shared/components/common/Toast';

const DeleteFavoriteModal = ({ isOpen, onClose, favorite }) => {
  const { deleteFavorite, loadings } = useFavoriteStore();

  const handleDelete = async () => {
    const result = await deleteFavorite(favorite._id);
    if (result.success) {
      showToast('Favorito eliminado', 'success');
      onClose();
    } else {
      showToast(result.error, 'error');
    }
  };

  if (!isOpen || !favorite) return null;

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.iconContainer}>
              <Trash2 size={18} color={COLORS.accent} />
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalTitle}>Eliminar favorito</Text>
          <Text style={styles.modalSubtitle}>
            ¿Estás seguro que deseas eliminar{' '}
            <Text style={styles.modalSubtitleBold}>{favorite.alias}</Text> de tus favoritos?
            Esta acción no se puede deshacer.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              disabled={loadings.action}
              style={[styles.confirmButton, loadings.action && styles.confirmButtonDisabled]}
            >
              {loadings.action ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.confirmButtonText}>Eliminar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: SPACING.lg },
  modalContent: { backgroundColor: COLORS.surface, borderRadius: 16, width: '100%', maxWidth: 350, padding: SPACING.xl, ...SHADOWS.large },
  modalHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: SPACING.md },
  iconContainer: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.orange100, justifyContent: 'center', alignItems: 'center' },
  closeButton: { padding: 4 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.primaryDark, marginBottom: SPACING.xs },
  modalSubtitle: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20, marginBottom: SPACING.lg },
  modalSubtitleBold: { fontWeight: '600', color: COLORS.primaryDark },
  buttonContainer: { flexDirection: 'row', gap: SPACING.sm },
  cancelButton: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  cancelButtonText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  confirmButton: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: COLORS.accent, alignItems: 'center', ...SHADOWS.small },
  confirmButtonDisabled: { opacity: 0.6 },
  confirmButtonText: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
});

export default DeleteFavoriteModal;
