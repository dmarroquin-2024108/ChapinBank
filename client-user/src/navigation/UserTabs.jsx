import React, { useState, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { COLORS, SPACING } from '../shared/constants/theme';
import { useAuthStore } from '../shared/store/authStore';
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

const SCROLL_AMOUNT = 120;

const UserNavbar = ({ activeTab, onTabChange, onLogout }) => {
  const navigation = useNavigation();
  const [notifOpen, setNotifOpen] = useState(false);
  const [scrollX, setScrollX] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const scrollRef = useRef(null);
  const insets = useSafeAreaInsets();

  const handlePress = (to) => {
    onTabChange(to);
    navigation.navigate(to);
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollTo({ x: Math.max(0, scrollX - SCROLL_AMOUNT), animated: true });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollTo({ x: scrollX + SCROLL_AMOUNT, animated: true });
  };

  const canScrollLeft = scrollX > 0;
  const canScrollRight = scrollX + containerWidth < contentWidth - 4;

  return (
    <View style={[styles.navbar, { paddingTop: insets.top }]}>
      <View style={styles.navbarTop}>
        <View style={styles.navbarLeft}>
          <View style={styles.logoContainer}>
            <Image source={require('../../assets/ChapinLogo.png')} style={styles.logo} />
          </View>
          <Text style={styles.logoText}>Chapin<Text style={styles.logoAccent}>Bank</Text></Text>
        </View>
        <View style={styles.navbarRight}>
          <TouchableOpacity onPress={() => setNotifOpen(true)} style={styles.bellButton}>
            <BellIcon onPress={() => setNotifOpen(true)} />
          </TouchableOpacity>
          <AvatarUser onLogout={onLogout} />
        </View>
      </View>

      <View style={styles.navbarScrollRow}>
        <TouchableOpacity
          onPress={scrollLeft}
          disabled={!canScrollLeft}
          style={[styles.scrollArrow, !canScrollLeft && styles.scrollArrowDisabled]}
        >
          <ChevronLeft size={16} color={canScrollLeft ? '#fff' : 'rgba(255,255,255,0.3)'} />
        </TouchableOpacity>

        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.navbarScroll}
          contentContainerStyle={styles.navbarScrollContent}
          onScroll={(e) => setScrollX(e.nativeEvent.contentOffset.x)}
          onContentSizeChange={(w) => setContentWidth(w)}
          onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
          scrollEventThrottle={16}
        >
          {NAV_ITEMS.map(({ label, to, exact }) => {
            const isActive = exact ? activeTab === to : activeTab === to || activeTab.startsWith(to + '/');
            return (
              <TouchableOpacity
                key={label}
                onPress={() => handlePress(to)}
                style={[styles.navItem, isActive ? styles.navItemActive : styles.navItemInactive]}
              >
                <Text style={[styles.navItemText, isActive ? styles.navItemTextActive : styles.navItemTextInactive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TouchableOpacity
          onPress={scrollRight}
          disabled={!canScrollRight}
          style={[styles.scrollArrow, !canScrollRight && styles.scrollArrowDisabled]}
        >
          <ChevronRight size={16} color={canScrollRight ? '#fff' : 'rgba(255,255,255,0.3)'} />
        </TouchableOpacity>
      </View>

      <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
    </View>
  );
};

const UserTabs = () => {
  const [activeTab, setActiveTab] = useState('Inicio');
  const { logout } = useAuthStore();

  return (
    <View style={styles.rootContainer}>
      <UserNavbar activeTab={activeTab} onTabChange={setActiveTab} onLogout={logout} />
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
        <Tab.Screen name="Inicio" component={AccountsScreen} listeners={{ focus: () => setActiveTab('Inicio') }} />
        <Tab.Screen name="Depósitos" component={DepositScreen} listeners={{ focus: () => setActiveTab('Depósitos') }} />
        <Tab.Screen name="Transferencias" component={TransfersScreen} listeners={{ focus: () => setActiveTab('Transferencias') }} />
        <Tab.Screen name="Historial" component={AccountHistoryScreen} listeners={{ focus: () => setActiveTab('Historial') }} />
        <Tab.Screen name="Productos" component={ProductsScreen} listeners={{ focus: () => setActiveTab('Productos') }} />
        <Tab.Screen name="MisProductos" component={MyTransactionsScreen} listeners={{ focus: () => setActiveTab('MisProductos') }} />
        <Tab.Screen name="Favoritos" component={FavoritesScreen} listeners={{ focus: () => setActiveTab('Favoritos') }} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: { flex: 1, backgroundColor: COLORS.background, flexDirection: 'column' },
  navbar: { backgroundColor: COLORS.primaryDark, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, paddingBottom: 8, zIndex: 10 },
  navbarTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  navbarLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoContainer: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 24, height: 24, resizeMode: 'contain' },
  logoText: { fontSize: 14, fontWeight: '800', color: '#fff' },
  logoAccent: { color: COLORS.accent },
  navbarRight: { flexDirection: 'row', alignItems: 'center', gap: 12, marginLeft: SPACING.md },
  bellButton: { padding: 6 },
  navbarScrollRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.sm },
  scrollArrow: { padding: 6, borderRadius: 8 },
  scrollArrowDisabled: { opacity: 0.4 },
  navbarScroll: { flex: 1 },
  navbarScrollContent: { alignItems: 'center', gap: 4, paddingHorizontal: SPACING.xs },
  navItem: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginRight: 4 },
  navItemActive: { backgroundColor: COLORS.accent },
  navItemInactive: { backgroundColor: 'transparent' },
  navItemText: { fontSize: 12, fontWeight: '500' },
  navItemTextActive: { color: '#fff' },
  navItemTextInactive: { color: COLORS.textSecondary },
});

export default UserTabs;