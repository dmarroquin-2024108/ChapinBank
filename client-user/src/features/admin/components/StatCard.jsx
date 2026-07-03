import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../../../shared/constants/theme';

const COLOR_MAP = {
  dark: { bg: COLORS.primaryDark, text: '#fff' },
  orange: { bg: COLORS.orange500, text: '#fff' },
  gold: { bg: COLORS.gold, text: '#fff' },
};

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'dark' }) => {
  const colors = COLOR_MAP[color] || COLOR_MAP.dark;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {Icon && (
          <View style={styles.iconContainer}>
            <Icon size={18} color="#fff" />
          </View>
        )}
      </View>
      <Text style={[styles.value, { color: colors.text }]}>{value ?? '—'}</Text>
      {subtitle && <Text style={[styles.subtitle, { color: colors.text }]}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: SPACING.md,
    minHeight: 120,
    gap: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  title: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    flex: 1,
    color: COLORS.backgroundAlt,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 10,
    opacity: 0.9,
  },
});
