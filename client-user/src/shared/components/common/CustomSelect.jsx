import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { COLORS, SPACING, SHADOWS } from '../../constants/theme';

const CustomSelect = ({ value, onChange, options, disabled = false }) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View style={styles.selectContainer}>
      <TouchableOpacity
        disabled={disabled}
        onPress={() => setOpen((p) => !p)}
        style={[styles.selectButton, disabled && styles.selectButtonDisabled]}
      >
        <Text style={[styles.selectText, disabled && styles.selectTextDisabled]}>
          {selected?.label ?? 'Selecciona…'}
        </Text>
        <ChevronDown size={15} color={COLORS.textSecondary} style={[styles.selectIcon, open && styles.selectIconRotated]} />
      </TouchableOpacity>
      {open && (
        <Modal
          visible={open}
          transparent
          animationType="fade"
          onRequestClose={() => setOpen(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setOpen(false)}
          >
            <View style={styles.selectDropdown}>
              {options.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  style={[
                    styles.selectOption,
                    value === opt.value && styles.selectOptionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.selectOptionText,
                      value === opt.value && styles.selectOptionTextSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  selectContainer: { position: 'relative' },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.background,
  },
  selectButtonDisabled: { opacity: 0.6 },
  selectText: { fontSize: 12, color: COLORS.primaryDark },
  selectTextDisabled: { color: COLORS.textSecondary },
  selectIcon: { fontSize: 10, color: COLORS.textSecondary },
  selectIconRotated: { transform: [{ rotate: '180deg' }] },
  selectDropdown: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.large,
    maxHeight: 200,
  },
  selectOption: { padding: SPACING.sm, paddingHorizontal: SPACING.md },
  selectOptionSelected: { backgroundColor: COLORS.primaryDark10 },
  selectOptionText: { fontSize: 14, color: COLORS.textPrimary },
  selectOptionTextSelected: { color: COLORS.primaryDark, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: SPACING.lg },
});

export default CustomSelect;
