import { useEffect } from 'react';
import { Package, CalendarDays, TrendingDown, Tag, ReceiptText } from 'lucide-react';
import { useTransactionStore } from '../store/transactionStore.js';
import { formatDate, formatBalance } from '../../../shared/utils/formatters.js';
import { showError } from '../../../shared/utils/toast.js';
const TransactionCard = ({ transaction }) => {
  const product = transaction.productId;

  return (
    <article className='bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 p-4 hover:shadow-md transition-shadow'>
      {product?.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className='w-full sm:w-14 h-40 sm:h-14 rounded-xl object-cover shrink-0'
        />
      ) : (
        <div className='w-full sm:w-14 h-40 sm:h-14 rounded-xl bg-gray-100 flex items-center justify-center shrink-0'>
          <Package size={22} className='text-gray-400' />
        </div>
      )}
      <div className='flex-1 min-w-0'>
        <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-3'>
          <div>
            {product?.type && (
              <p className='text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5'>
                {product.type}
              </p>
            )}
            <h3 className='font-bold text-[#0d1f35] text-sm sm:text-base break-words'>
              {product?.name ?? 'Producto eliminado'}
            </h3>
            {transaction.reference && (
              <p className='text-[11px] text-gray-400 mt-0.5 truncate'>{transaction.reference}</p>
            )}
          </div>

          <div className='sm:text-right shrink-0'>
            <p className='font-extrabold text-orange-500 text-sm'>
              −{formatBalance(transaction.amount)}
            </p>
            {transaction.pricing?.discountApplied && (
              <span className='inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold'>
                <Tag size={9} />
                {(transaction.pricing.discountApplied * 100).toFixed(0)}% dto.
              </span>
            )}
          </div>
        </div>
        <div className='mt-2 flex items-center gap-1 text-xs text-gray-400'>
          <CalendarDays size={11} />
          {formatDate(transaction.createdAt)}
        </div>
      </div>
    </article>
  );
};

const EmptyTransactions = () => (
  <div className='py-24 flex flex-col items-center gap-3 text-gray-400'>
    <ReceiptText size={40} strokeWidth={1.5} />
    <p className='text-sm font-medium'>No tienes transacciones registradas.</p>
  </div>
);

export const UserTransactionsPage = () => {
  const { transactions, loading, error, getMyTransactions } = useTransactionStore();

  useEffect(() => {
    getMyTransactions();
  }, [getMyTransactions]);

  useEffect(() => {
    if (error) showError(error);
  }, [error]);
  const completed = transactions.filter((t) => t.status === 'COMPLETED');
  return (
    <div className='p-3 sm:p-4 lg:p-6'>
      <div className='mb-6'>
        <h1 className='text-xl sm:text-2xl font-bold text-[#0d1f35]'>Mis productos</h1>
        <p className='text-gray-500 text-xs sm:text-sm leading-relaxed'>
          Productos que has contratado con ChapinBank
          {!loading && completed.length > 0 && (
            <span className='ml-2 font-semibold text-[#0d1f35]'>
              · {completed.length} activo{completed.length !== 1 ? 's' : ''}
            </span>
          )}
        </p>
      </div>
      {loading ? (
        <div className='py-24 flex justify-center'>
          <div className='animate-spin rounded-full h-10 w-10 border-4 border-[#0d1f35] border-t-transparent' />
        </div>
      ) : completed.length === 0 ? (
        <EmptyTransactions />
      ) : (
        <div className='flex flex-col gap-3'>
          {completed.map((t) => (
            <TransactionCard key={t._id} transaction={t} />
          ))}
        </div>
      )}
    </div>
  );
};
