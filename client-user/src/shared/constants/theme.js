import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#032340',
  primary50: '#e8f0f5',
  primary100: '#d1e1eb',
  primary200: '#a3c2d7',
  primary300: '#75a3c3',
  primary400: '#4784af',
  primary500: '#19659b',
  primary600: '#0d4f7d',
  primaryDark: '#0d1f35',
  primary800: '#081826',
  primary900: '#041218',

  accent: '#F28C00',
  accent50: '#fff7ed',
  accent100: '#ffedd5',
  accent200: '#fed7aa',
  accent300: '#fdba74',
  accent400: '#fb923c',
  accent500: '#f97316',
  accent600: '#ea580c',
  accentPressed: '#c07018',
  accent800: '#9a3412',
  accent900: '#7c2d12',

  gold: '#FFBB00',
  gold50: '#fffbeb',
  gold100: '#fef3c7',
  gold200: '#fde68a',
  gold300: '#fcd34d',
  gold400: '#fbbf24',
  gold500: '#f59e0b',
  gold600: '#d97706',
  gold700: '#b45309',
  gold800: '#92400e',
  gold900: '#78350f',

  background: '#f5f3ef',
  backgroundAlt: '#ffffff',

  surface: '#ffffff',
  surfaceAlt: '#f9fafb',

  textPrimary: '#0d1f35',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
  textDisabled: '#d1d5db',

  border: '#e5e7eb',
  borderLight: '#f3f4f6',
  borderDark: '#d1d5db',

  success: '#16a34a',
  success50: '#f0fdf4',
  success100: '#dcfce7',
  success200: '#bbf7d0',
  success300: '#86efac',
  success400: '#4ade80',
  success500: '#22c55e',
  success600: '#16a34a',
  success700: '#15803d',
  success800: '#166534',
  success900: '#14532d',
  successBg: '#f0fdf4',

  error: '#ef4444',
  error50: '#fef2f2',
  error100: '#fee2e2',
  error200: '#fecaca',
  error300: '#fca5a5',
  error400: '#f87171',
  error500: '#ef4444',
  error600: '#dc2626',
  error700: '#b91c1c',
  error800: '#991b1b',
  error900: '#7f1d1d',
  errorBg: '#fef2f2',

  info: '#0ea5e9',
  info50: '#f0f9ff',
  info100: '#e0f2fe',
  info200: '#bae6fd',
  info300: '#7dd3fc',
  info400: '#38bdf8',
  info500: '#0ea5e9',
  info600: '#0284c7',
  info700: '#0369a1',
  info800: '#075985',
  info900: '#0c4a6e',

  warning: '#f59e0b',
  warning50: '#fffbeb',
  warning100: '#fef3c7',
  warning200: '#fde68a',
  warning300: '#fcd34d',
  warning400: '#fbbf24',
  warning500: '#f59e0b',
  warning600: '#d97706',
  warning700: '#b45309',
  warning800: '#92400e',
  warning900: '#78350f',

  // Badges naranja (tonos genéricos para roles/estados)
  orange50: '#fff7ed',
  orange100: '#ffedd5',
  orange400: '#fb923c',
  orange500: '#f97316',
  orange600: '#ea580c',

  // Blue variants
  blue50: '#eff6ff',
  blue100: '#dbeafe',
  blue200: '#bfdbfe',
  blue300: '#93c5fd',
  blue400: '#60a5fa',
  blue500: '#3b82f6',
  blue600: '#2563eb',
  blue700: '#1d4ed8',
  blue800: '#1e40af',
  blue900: '#1e3a8a',

  // Gray variants
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const theme = {
  colors: COLORS,
  spacing: SPACING,
  fontSize: FONT_SIZE,
  shadows: SHADOWS,
};

export const createStyles = (styleObject) => StyleSheet.create(styleObject);
