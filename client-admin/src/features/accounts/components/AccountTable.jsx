import { Search, SlidersHorizontal } from 'lucide-react';
import { AccountRow } from './AccountRow.jsx';
import { Spinner } from '../../auth/components/Spinner.jsx';

const TYPE_OPTIONS = [
  { value: '', label: 'Todos los tipos' },
  { value: 'MONETARIA', label: 'Monetaria' },
  { value: 'AHORRO', label: 'Ahorro' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'active', label: 'Activas' },
  { value: 'inactive', label: 'Inhabilitadas' },
];

const SELECT_BASE =
  'text-sm border border-gray-200 rounded-xl bg-white px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange/40 cursor-pointer';
export const AccountTable = ({
  accounts = [],
  loading = false,
  filters,
  onFiltersChange,
  onToggle,
  onDetail,
}) => {
  const handleFilter = (key, value) => onFiltersChange({ ...filters, [key]: value });

  if (loading) return <Spinner />;

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-wrap items-center gap-3'>
        <div className='relative flex-1 min-w-[200px] max-w-sm'>
          <Search size={15} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
          <input
            type='text'
            value={filters.search}
            onChange={(e) => handleFilter('search', e.target.value)}
            placeholder='Buscar por cliente o N.° de cuenta...'
            className='w-full pl-9 pr-4 py-2 bg-white text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange/40'
          />
        </div>

        <div className='flex items-center gap-2'>
          <SlidersHorizontal size={14} className='text-gray-400 shrink-0' />
          <select
            value={filters.type}
            onChange={(e) => handleFilter('type', e.target.value)}
            className={SELECT_BASE}
          >
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <select
          value={filters.status}
          onChange={(e) => handleFilter('status', e.target.value)}
          className={SELECT_BASE}
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span className='ml-auto text-xs text-gray-400 shrink-0'>
          {accounts.length} resultado{accounts.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className='overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm'>
        {accounts.length === 0 ? (
          <div className='flex items-center justify-center py-16 px-4 text-center'>
            <p className='text-gray-400 text-sm'>
              {filters.search || filters.type || filters.status
                ? 'Sin resultados para los filtros aplicados.'
                : 'No hay cuentas registradas.'}
            </p>
          </div>
        ) : (
          <table className='min-w-full leading-normal text-sm'>
            <thead>
              <tr className='bg-gray-50/60 border-b border-gray-100'>
                {['N.° Cuenta', 'Cliente', 'Tipo', 'Saldo', 'Registro', 'Estado', ''].map((h) => (
                  <th
                    key={h}
                    className='py-5 px-6 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap'
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='text-gray-700'>
              {accounts.map((acc) => (
                <AccountRow
                  key={acc.accountNumber}
                  account={acc}
                  onToggle={onToggle}
                  onDetail={onDetail}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
