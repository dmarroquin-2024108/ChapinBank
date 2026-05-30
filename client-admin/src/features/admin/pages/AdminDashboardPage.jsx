import { useMemo } from 'react';
import { Users, CreditCard, Package, DollarSign } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { RecentMovements } from '../components/RecentMovements';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { formatBalance } from '../../../shared/utils/formatters.js';

export const AdminDashboardPage = () => {
  const { history, products, accounts, users, loadings } = useDashboardStats();

  const stats = useMemo(
    () => [
      {
        title: 'Total usuarios',
        value: users?.total,
        subtitle: `${users?.active ?? 0} activos`,
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
    [users, accounts, products]
  );

  return (
    <div className='flex flex-col gap-6'>
      <div className='grid grid-cols-2 xl:grid-cols-4 gap-4'>
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} value={loadings ? stat.value : '—'} />
        ))}
      </div>

      <div className='flex flex-col xl:flex-row gap-6'>
        <div className='flex-1 min-w-0'>
          <RecentMovements history={history} />
        </div>
        <DashboardSidebar users={users?.recentUsers ?? []} />
      </div>
    </div>
  );
};
