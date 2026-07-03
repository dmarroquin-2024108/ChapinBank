import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useProductStore } from '../store/productStore';
import { COLORS, SPACING, SHADOWS } from '../../../shared/constants/theme';
import { showToast } from '../../../shared/components/common/Toast';
import CustomSelect from '../../../shared/components/common/CustomSelect';

const ProductFormModal = ({ isOpen, onClose, onSubmit, mode = 'add', initialData = {} }) => {
  const { loading } = useProductStore();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    type: 'SEGURO',
    description: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      if (mode === 'edit' && initialData) {
        setFormData({
          name: initialData.name || '',
          price: initialData.price?.toString() || '',
          type: initialData.type || 'SEGURO',
          description: initialData.description || '',
          image: null,
        });
        setImagePreview(initialData.imageUrl || null);
      } else {
        setFormData({
          name: '',
          price: '',
          type: 'SEGURO',
          description: '',
          image: null,
        });
        setImagePreview(null);
      }
    }
  }, [isOpen, mode, initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        const imageObject = {
          uri: asset.uri,
          name: asset.fileName ?? 'photo.jpg',
          type: asset.mimeType ?? 'image/jpeg',
        };
        handleChange('image', imageObject);
        setImagePreview(asset.uri);
      }
    } catch (error) {
      showToast('Error al seleccionar imagen', 'error');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.price) newErrors.price = 'El precio es obligatorio';
    else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) newErrors.price = 'Precio inválido';
    if (!formData.type) newErrors.type = 'El tipo es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    await onSubmit({
      ...formData,
      price: Number(formData.price),
    });
  };

  const typeOptions = [
    { value: 'SEGURO', label: 'Seguro' },
    { value: 'VIAJE', label: 'Viaje' },
    { value: 'SUSCRIPCION', label: 'Suscripción' },
  ];

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {mode === 'add' ? 'Crear nuevo producto' : 'Actualizar producto'}
              </Text>
              <Text style={styles.modalSubtitle}>
                Complete los campos para gestionar el catálogo del banco.
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Nombre del producto</Text>
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  value={formData.name}
                  onChangeText={(value) => handleChange('name', value)}
                  placeholder="Ej. Seguro Gold"
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Precio mensual (Q)</Text>
                <TextInput
                  style={[styles.input, errors.price && styles.inputError]}
                  value={formData.price}
                  onChangeText={(value) => handleChange('price', value)}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                />
                {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Tipo</Text>
                <CustomSelect
                  value={formData.type}
                  onChange={(value) => handleChange('type', value)}
                  options={typeOptions}
                />
                {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Breve descripción</Text>
                <TextInput
                  style={styles.input}
                  value={formData.description}
                  onChangeText={(value) => handleChange('description', value)}
                  placeholder="Detalles del producto"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Imagen del producto</Text>
                <TouchableOpacity onPress={handleImagePick} style={styles.imageUploadArea}>
                  {imagePreview ? (
                    <Image source={{ uri: imagePreview }} style={styles.imagePreview} />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Text style={styles.imagePlaceholderText}>Haz clic para seleccionar una imagen</Text>
                      <Text style={styles.imagePlaceholderSubtext}>JPG, PNG o WEBP · Máx. 5MB</Text>
                    </View>
                  )}
                  {imagePreview && (
                    <Text style={styles.changeImageText}>Haz clic para cambiar la imagen</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                style={[styles.confirmButton, loading && styles.confirmButtonDisabled]}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.confirmButtonText}>
                    {mode === 'add' ? 'Crear producto' : 'Actualizar producto'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: SPACING.lg },
  modalContent: { backgroundColor: COLORS.surface, borderRadius: 16, width: '100%', maxWidth: 500, maxHeight: '90%', ...SHADOWS.large, overflow: 'hidden' },
  modalHeader: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg, paddingBottom: SPACING.md },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.primaryDark },
  modalSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  formContainer: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xl, gap: SPACING.md },
  field: { gap: 6 },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, backgroundColor: COLORS.surface, paddingHorizontal: SPACING.sm, paddingVertical: 10, fontSize: 14, color: COLORS.textPrimary },
  inputError: { borderColor: COLORS.error },
  errorText: { fontSize: 12, color: COLORS.error, marginTop: 2 },
  selectContainer: { position: 'relative' },
  selectButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.sm, paddingVertical: 10, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, backgroundColor: COLORS.surface },
  selectButtonDisabled: { opacity: 0.6 },
  selectText: { fontSize: 14, color: COLORS.textPrimary },
  selectTextDisabled: { color: COLORS.textSecondary },
  selectArrow: { fontSize: 10, color: COLORS.textSecondary },
  selectDropdown: { backgroundColor: COLORS.surface, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.large, maxHeight: 200 },
  selectOption: { padding: SPACING.sm, paddingHorizontal: SPACING.md },
  selectOptionSelected: { backgroundColor: `${COLORS.accent}10` },
  selectOptionText: { fontSize: 14, color: COLORS.textPrimary },
  selectOptionTextSelected: { color: COLORS.accent, fontWeight: '600' },
  imageUploadArea: { borderWidth: 2, borderColor: COLORS.border, borderStyle: 'dashed', borderRadius: 8, padding: 16, alignItems: 'center', gap: 12 },
  imagePreview: { width: 128, height: 128, borderRadius: 12 },
  imagePlaceholder: { alignItems: 'center' },
  imagePlaceholderText: { fontSize: 14, fontWeight: '500', color: COLORS.textSecondary },
  imagePlaceholderSubtext: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  changeImageText: { fontSize: 12, color: COLORS.blue500 },
  buttonContainer: { flexDirection: 'row', gap: 12, paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xl },
  cancelButton: { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  cancelButtonText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  confirmButton: { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: COLORS.accent, alignItems: 'center', ...SHADOWS.small },
  confirmButtonDisabled: { opacity: 0.6 },
  confirmButtonText: { fontSize: 14, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
});

export default ProductFormModal;
