import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { COLORS } from '../../constants/theme';

const { width } = Dimensions.get('window');
const TOAST_WIDTH = width - 32;

const Toast = forwardRef((props, ref) => {
  const [state, setState] = useState({ visible: false, message: '', type: 'info', key: 0 });
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useImperativeHandle(ref, () => ({
    show(message, type = 'info') {
      fadeAnim.setValue(0);
      slideAnim.setValue(-50);
      setState((s) => ({
        visible: true,
        message: message ?? 'Error desconocido',
        type,
        key: s.key + 1, 
      }));
    },
  }));

  useEffect(() => {
    if (!state.visible) return;

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => hideToast(), 3000);
    return () => clearTimeout(timer);
  }, [state.key]); 
  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -50, duration: 300, useNativeDriver: true }),
    ]).start(() => setState((s) => ({ ...s, visible: false })));
  };

  if (!state.visible) return null;

  const getToastStyle = () => {
    switch (state.type) {
      case 'success': return styles.successToast;
      case 'error': return styles.errorToast;
      case 'warning': return styles.warningToast;
      default: return styles.infoToast;
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.toast, getToastStyle(), { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        <Text style={styles.message}>{state.message}</Text>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 9999,
    alignItems: 'center',
  },
  toast: {
    width: TOAST_WIDTH,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  message: { color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  successToast: { backgroundColor: COLORS.success, borderWidth: 2, borderColor: '#22c55e' },
  errorToast: { backgroundColor: COLORS.error, borderWidth: 2, borderColor: '#ef4444' },
  infoToast: { backgroundColor: COLORS.info, borderWidth: 2, borderColor: '#0ea5e9' },
  warningToast: { backgroundColor: COLORS.warning, borderWidth: 2, borderColor: '#f59e0b' },
});

let toastRef = null;
export const setToastRef = (ref) => { toastRef = ref; };
export const showToast = (message, type = 'info') => {
  if (toastRef) toastRef.show(message ?? 'Error desconocido', type);
};

export default Toast;