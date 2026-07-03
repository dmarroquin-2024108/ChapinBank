import 'react-native-gesture-handler';
import React, { useRef, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import Toast, { setToastRef } from './src/shared/components/common/Toast';

export default function App() {
  const toastCallbackRef = useCallback((ref) => {
    if (ref) setToastRef(ref);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <AppNavigator />
        <Toast ref={toastCallbackRef} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}