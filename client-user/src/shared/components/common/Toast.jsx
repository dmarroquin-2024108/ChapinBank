import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { COLORS } from '../../constants/theme';

const { width } = Dimensions.get('window');
const TOAST_WIDTH = width - 32;

const Toast = ({ visible, message, type = 'info', onHide }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        hideToast();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  if (!visible) return null;

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return styles.successToast;
      case 'error':
        return styles.errorToast;
      case 'warning':
        return styles.warningToast;
      default:
        return styles.infoToast;
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.toast,
          getToastStyle(),
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.message}>{message}</Text>
      </Animated.View>
    </View>
  );
};

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
  message: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  successToast: {
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: '#22c55e',
  },
  errorToast: {
    backgroundColor: COLORS.error,
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  infoToast: {
    backgroundColor: COLORS.info,
    borderWidth: 2,
    borderColor: '#0ea5e9',
  },
  warningToast: {
    backgroundColor: COLORS.warning,
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
});

let toastRef = null;

export const showToast = (message, type = 'info') => {
  if (toastRef) {
    toastRef.show(message, type);
  }
};

export default Toast;
