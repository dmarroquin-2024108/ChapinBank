import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Plus, UserPlus, CreditCard, History } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING } from '../../../shared/constants/theme';

const QUICK_ACTIONS = [
  {
    label: 'Agregar producto',
    icon: Plus,
    screen: 'Productos',
    color: { bg: COLORS.blue100, text: COLORS.blue600, hover: COLORS.blue200 },
  },
  {
    label: 'Registrar usuario',
    icon: UserPlus,
    screen: 'Usuarios',
    color: { bg: COLORS.orange100, text: COLORS.orange500, hover: COLORS.orange200 },
  },
  {
    label: 'Gestionar cuentas',
    icon: CreditCard,
    screen: 'Cuentas',
    color: { bg: COLORS.gold100, text: COLORS.gold700, hover: COLORS.gold200 },
  },
  {
    label: 'Ver historial',
    icon: History,
    screen: 'Historial',
    color: { bg: COLORS.blue100, text: COLORS.blue600, hover: COLORS.blue200 },
  },
];

export const QuickAccess = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accesos rápidos</Text>
      <View style={styles.grid}>
        {QUICK_ACTIONS.map(({ label, icon: Icon, screen, color }) => (
          <TouchableOpacity
            key={label}
            onPress={() => navigation.navigate(screen)}
            style={[styles.actionButton, { backgroundColor: color.bg }]}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrapper}>
              <Icon size={18} color={color.text} />
            </View>
            <Text style={[styles.actionLabel, { color: color.text }]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    padding: SPACING.md,
    minHeight: 110,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
});
