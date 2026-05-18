import { useState, useEffect } from 'react';
import {
  History,
  Loader2,
  AlertCircle,
  BarChart3,
  ArrowUpDown,
  RefreshCw,
} from 'lucide-react';
import { useHistoryStore } from '../store/Historystore.js';
import { MovementCard } from '../components/Movementcard.jsx';

const LoadingState = () => (
  <div className="flex items-center justify-center py-12 gap-2 text-gray-400">
    <Loader2 size={18} className="animate-spin" />
    <span className="text-sm">Cargando…</span>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="flex items-center gap-2 text-red-500 bg-red-50 rounded-xl px-4 py-3 text-sm">
    <AlertCircle size={16} className="shrink-0" />
    <span>{message}</span>
  </div>
);

const EmptyState = ({ message = 'Sin datos registrados' }) => (
  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
    <History size={36} strokeWidth={1.5} className="mb-3 text-gray-300" />
    <p className="text-sm">{message}</p>
  </div>
);

const AccountMovementRow = ({ item, index }) => (
  <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
    {/* Ranking badge */}
    <div
      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
        index === 0
          ? 'bg-yellow-100 text-yellow-600'
          : index === 1
          ? 'bg-gray-200 text-gray-500'
          : index === 2
          ? 'bg-orange/15 text-orange'
          : 'bg-gray-100 text-gray-400'
      }`}
    >
      {index + 1}
    </div>

    <p className="flex-1 text-sm font-mono font-medium text-main-blue">
      {item.accountNumber}
    </p>

    <div className="text-right">
      <span className="text-sm font-bold text-main-blue">{item.totalMovements}</span>
      <span className="text-xs text-gray-400 ml-1">mov.</span>
    </div>
  </div>
);

export const BankHistoryPage = () => {
  const {
    bankHistory,
    accountsByMovements,
    loadings,
    errors,
    fetchBankHistory,
    fetchAccountsByMovements,
  } = useHistoryStore();

  const [rankOrder, setRankOrder] = useState('desc');

  useEffect(() => {
    fetchBankHistory();
    fetchAccountsByMovements(rankOrder);
  }, []);

  const handleToggleOrder = () => {
    const newOrder = rankOrder === 'desc' ? 'asc' : 'desc';
    setRankOrder(newOrder);
    fetchAccountsByMovements(newOrder);
  };

  const handleRefresh = () => {
    fetchBankHistory();
    fetchAccountsByMovements(rankOrder);
  };

  return (
    <div className="px-6 py-6 space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-main-blue/10 flex items-center justify-center shrink-0">
            <History size={22} className="text-main-blue" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-main-blue leading-tight">
              Historial del banco
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Últimos 20 movimientos registrados en el sistema
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loadings.bankHistory || loadings.accountsByMovements}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-main-blue border border-gray-200 rounded-xl px-3 py-2 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw
            size={14}
            className={loadings.bankHistory ? 'animate-spin' : ''}
          />
          Actualizar
        </button>
      </div>

      {/* Layout de dos columnas */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Columna principal: movimientos recientes */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-main-blue">Movimientos recientes</h2>
            {!loadings.bankHistory && bankHistory.length > 0 && (
              <p className="text-xs text-gray-400 mt-0.5">
                {bankHistory.length} movimiento{bankHistory.length !== 1 ? 's' : ''} encontrado{bankHistory.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {errors.bankHistory ? (
            <div className="p-4">
              <ErrorState message={errors.bankHistory} />
            </div>
          ) : loadings.bankHistory ? (
            <LoadingState />
          ) : bankHistory.length === 0 ? (
            <EmptyState message="Sin movimientos registrados en el banco" />
          ) : (
            <div>
              {bankHistory.map((mov) => (
                <MovementCard key={mov.id ?? mov._id} mov={mov} showAccount />
              ))}
            </div>
          )}
        </div>

        {/* Columna lateral: ranking de cuentas */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 size={15} className="text-orange" />
                <h2 className="text-sm font-bold text-main-blue">Cuentas más activas</h2>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Ordenado por número de movimientos
              </p>
            </div>

            <button
              onClick={handleToggleOrder}
              disabled={loadings.accountsByMovements}
              className="text-gray-400 hover:text-main-blue transition-colors disabled:opacity-50 p-1 cursor-pointer"
              title={rankOrder === 'desc' ? 'Ver ascendente' : 'Ver descendente'}
            >
              <ArrowUpDown size={15} />
            </button>
          </div>

          {errors.accountsByMovements ? (
            <div className="p-4">
              <ErrorState message={errors.accountsByMovements} />
            </div>
          ) : loadings.accountsByMovements ? (
            <LoadingState />
          ) : accountsByMovements.length === 0 ? (
            <EmptyState message="Sin datos disponibles" />
          ) : (
            <div>
              {accountsByMovements.map((item, index) => (
                <AccountMovementRow
                  key={item.accountNumber}
                  item={item}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};