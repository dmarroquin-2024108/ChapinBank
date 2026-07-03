import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { LayoutDashboard, Package, Users, CreditCard, History, LogOut } from 'lucide-react-native';
import { COLORS, SPACING } from '../shared/constants/theme';
import { useAuthStore } from '../shared/store/authStore';
import AdminUsersScreen from '../features/users/screens/AdminUsersScreen';
import AdminAccountsScreen from '../features/accounts/screens/AdminAccountsScreen';
import AdminProductsScreen from '../features/products/screens/AdminProductsScreen';
import AdminBankHistoryScreen from '../features/history/screens/AdminBankHistoryScreen';
import AdminDashboardScreen from '../features/admin/screens/AdminDashboardScreen';

const Drawer = createDrawerNavigator();

const DrawerContent = ({ navigation }) => {
  const { logout, user } = useAuthStore();

  const items = [
    { label: 'Resumen', icon: LayoutDashboard, screen: 'Resumen' },
    { label: 'Productos', icon: Package, screen: 'Productos' },
    { label: 'Usuarios', icon: Users, screen: 'Usuarios' },
    { label: 'Cuentas', icon: CreditCard, screen: 'Cuentas' },
    { label: 'Historial', icon: History, screen: 'Historial' },
  ];

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/ChapinLogo.png')} style={styles.logo} />
        </View>
        <Text style={styles.logoText}>Chapin<Text style={styles.logoAccent}>Bank</Text></Text>
      </View>

      <ScrollView style={styles.drawerNav}>
        {items.map(({ label, icon: Icon, screen }) => (
          <TouchableOpacity
            key={label}
            style={styles.drawerItem}
            onPress={() => navigation.navigate(screen)}
          >
            <Icon size={17} color={COLORS.textSecondary} />
            <Text style={styles.drawerItemText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.drawerLogout} onPress={logout}>
        <LogOut size={16} color={COLORS.textSecondary} />
        <Text style={styles.drawerLogoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const AdminStack = () => {
  const { width } = useWindowDimensions();
  const drawerWidth = Math.min(width * 0.75, 280);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: COLORS.primaryDark,
          width: drawerWidth,
        },
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: COLORS.textSecondary,
        drawerActiveBackgroundColor: COLORS.orange500,
        headerShown: false,
      }}
    >
      <Drawer.Screen name="Resumen" component={AdminDashboardScreen} />
      <Drawer.Screen name="Productos" component={AdminProductsScreen} />
      <Drawer.Screen name="Usuarios" component={AdminUsersScreen} />
      <Drawer.Screen name="Cuentas" component={AdminAccountsScreen} />
      <Drawer.Screen name="Historial" component={AdminBankHistoryScreen} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryDark,
  },
  drawerHeader: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  logoAccent: {
    color: COLORS.orange500,
  },
  drawerNav: {
    flex: 1,
    marginTop: SPACING.sm,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  drawerItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  drawerLogout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  drawerLogoutText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

export default AdminStack;