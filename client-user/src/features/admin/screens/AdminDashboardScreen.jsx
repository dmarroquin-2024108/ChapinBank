import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Users, CreditCard, Package, DollarSign } from 'lucide-react-native';
import { StatCard } from '../components/StatCard';
import { RecentMovementsList } from '../components/RecentMovementsList';
import { QuickAccess } from '../components/QuickAccess';
import { RecentClients } from '../components/RecentClients';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { formatBalance } from '../../../shared/utils/formatters';
import { COLORS, SPACING } from '../../../shared/constants/theme';
import Header from '../../../shared/components/common/Header';

const AdminDashboardScreen = () => {
  const { history, products, accounts, usersSummary, loading } = useDashboardStats();

  const stats = useMemo(
    () => [
      {
        title: 'Total usuarios',
        value: usersSummary?.total,
        subtitle: `${usersSummary?.active ?? 0} activos`,
        icon: Users,
        color: 'dark',
      },
      {
        title: 'Cuentas activas',
        value: accounts?.total,
        subtitle: `${accounts?.disabled ?? 0} inhabilitadas`,
        icon: CreditCard,
        color: 'orange',
      },
      {
        title: 'Productos en catálogo',
        value: products?.length,
        subtitle: 'Beneficios de Chapin Bank',
        icon: Package,
        color: 'gold',
      },
      {
        title: 'Activos administrado',
        value: formatBalance(accounts?.totalBalance),
        subtitle: 'Saldo total del banco',
        icon: DollarSign,
        color: 'dark',
      },
    ],
    [usersSummary, accounts, products]
  );

  return (
    <View style={styles.screenContainer}>
      <Header title="Panel de Administración" showMenu />
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <View key={stat.title} style={styles.statCard}>
              <StatCard {...stat} value={loading ? '—' : stat.value} />
            </View>
          ))}
        </View>

        <View style={styles.contentRow}>
          <View style={styles.mainContent}>
            <RecentMovementsList history={history} />
          </View>
          <View style={styles.sidebar}>
            <QuickAccess />
            <RecentClients users={usersSummary?.recentUsers ?? []} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, padding: SPACING.lg },
  scrollContent: { paddingBottom: SPACING.xxl },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statCard: { flex: 1, minWidth: '45%' },
  contentRow: { flexDirection: 'column', gap: SPACING.lg },
  mainContent: { flex: 1 },
  sidebar: { flexDirection: 'column', gap: SPACING.md },
});

export default AdminDashboardScreen;