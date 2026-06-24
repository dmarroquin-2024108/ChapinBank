import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { COLORS, SPACING } from '../shared/constants/theme';
import { useAuthStore } from '../shared/store/authStore';
import Header from '../shared/components/common/Header';
import AccountsScreen from '../features/accounts/screens/AccountsScreen';
import DepositScreen from '../features/deposits/screens/DepositScreen';
import TransfersScreen from '../features/transfers/screens/TransfersScreen';
import FavoritesScreen from '../features/favorites/screens/FavoritesScreen';
import ProductsScreen from '../features/products/screens/ProductsScreen';
import MyTransactionsScreen from '../features/transactions/screens/MyTransactionsScreen';
import AccountHistoryScreen from '../features/history/screens/AccountHistoryScreen';
import { BellIcon } from '../features/notifications/components/BellIcon';
import { NotificationPanel } from '../features/notifications/components/NotificationPanel';
import AvatarUser from '../shared/components/common/AvatarUser';

const Tab = createBottomTabNavigator();

const NAV_ITEMS = [
  { label: 'Inicio', to: 'Inicio', exact: true },
  { label: 'Depósitos', to: 'Depósitos', exact: true },
  { label: 'Transferencias', to: 'Transferencias' },
  { label: 'Historial', to: 'Historial', exact: true },
  { label: 'Productos', to: 'Productos' },
  { label: 'Mis productos', to: 'MisProductos' },
  { label: 'Favoritos', to: 'Favoritos' },
];

const UserNavbar = ({ activeTab, onTabChange, onLogout }) => {
  const { user } = useAuthStore();
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <View style={styles.navbar}>
      <View style={styles.navbarContent}>
        <View style={styles.navbarLeft}>
          <View style={styles.logoContainer}>
            <Image source={require('../../assets/ChapinLogo.png')} style={styles.logo} />
          </View>
          <Text style={styles.logoText}>Chapin<Text style={styles.logoAccent}>Bank</Text></Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.navbarScroll}>
          {NAV_ITEMS.map(({ label, to, exact }) => {
            const isActive = exact ? activeTab === to : activeTab === to || activeTab.startsWith(to + '/');
            return (
              <TouchableOpacity
                key={label}
                onPress={() => onTabChange(to)}
                style={[styles.navItem, isActive ? styles.navItemActive : styles.navItemInactive]}
              >
                <Text style={[styles.navItemText, isActive ? styles.navItemTextActive : styles.navItemTextInactive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.navbarRight}>
          <TouchableOpacity onPress={() => setNotifOpen(true)} style={styles.bellButton}>
            <BellIcon onPress={() => setNotifOpen(true)} />
          </TouchableOpacity>
          <AvatarUser onLogout={onLogout} />
        </View>
      </View>
      <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
    </View>
  );
};

const PlaceholderScreen = ({ title }) => (
  <View style={styles.screenContainer}>
    <Header title={title} />
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
    </View>
  </View>
);

const UserTabs = () => {
  const [activeTab, setActiveTab] = useState('Inicio');
  const { logout } = useAuthStore();

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const NotificationHeader = () => (
    <>
      <BellIcon onPress={() => {}} />
    </>
  );

  return (
    <View style={styles.container}>
      <UserNavbar activeTab={activeTab} onTabChange={handleTabChange} onLogout={logout} />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.accent,
          tabBarInactiveTintColor: COLORS.textSecondary,
          tabBarStyle: {
            backgroundColor: COLORS.primary,
            borderTopWidth: 0,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
        }}
      >
        <Tab.Screen 
          name="Inicio" 
          children={() => <AccountsScreen rightAction={<NotificationHeader />} />}
          options={{ title: 'Inicio' }}
          listeners={({ navigation }) => ({
            focus: () => handleTabChange('Inicio'),
          })}
        />
        <Tab.Screen 
          name="Depósitos" 
          children={() => <DepositScreen rightAction={<NotificationHeader />} />}
          options={{ title: 'Depósitos' }}
          listeners={({ navigation }) => ({
            focus: () => handleTabChange('Depósitos'),
          })}
        />
        <Tab.Screen 
          name="Transferencias" 
          children={() => <TransfersScreen rightAction={<NotificationHeader />} />}
          options={{ title: 'Transferencias' }}
          listeners={({ navigation }) => ({
            focus: () => handleTabChange('Transferencias'),
          })}
        />
        <Tab.Screen 
          name="Historial" 
          children={() => <AccountHistoryScreen rightAction={<NotificationHeader />} />}
          options={{ title: 'Historial' }}
          listeners={({ navigation }) => ({
            focus: () => handleTabChange('Historial'),
          })}
        />
        <Tab.Screen 
          name="Productos" 
          children={() => <ProductsScreen rightAction={<NotificationHeader />} />}
          options={{ title: 'Productos' }}
          listeners={({ navigation }) => ({
            focus: () => handleTabChange('Productos'),
          })}
        />
        <Tab.Screen 
          name="MisProductos" 
          children={() => <MyTransactionsScreen rightAction={<NotificationHeader />} />}
          options={{ title: 'Mis Productos' }}
          listeners={({ navigation }) => ({
            focus: () => handleTabChange('MisProductos'),
          })}
        />
        <Tab.Screen 
          name="Favoritos" 
          children={() => <FavoritesScreen rightAction={<NotificationHeader />} />}
          options={{ title: 'Favoritos' }}
          listeners={({ navigation }) => ({
            focus: () => handleTabChange('Favoritos'),
          })}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  navbar: {
    backgroundColor: COLORS.primaryDark,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navbarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    height: 56,
  },
  navbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: SPACING.md,
  },
  logoContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  logoText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
  },
  logoAccent: {
    color: COLORS.accent,
  },
  navbarScroll: {
    flex: 1,
  },
  navItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 4,
  },
  navItemActive: {
    backgroundColor: COLORS.accent,
  },
  navItemInactive: {
    backgroundColor: 'transparent',
  },
  navItemText: {
    fontSize: 12,
    fontWeight: '500',
  },
  navItemTextActive: {
    color: '#fff',
  },
  navItemTextInactive: {
    color: COLORS.textSecondary,
  },
  navbarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginLeft: SPACING.md,
  },
  bellButton: {
    padding: 6,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  text: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
});

export default UserTabs;
