import { create } from 'zustand';
import {
  buyProductRequest,
  getMyTransactionsRequest,
} from '../../../shared/api/transactions.requests';
import { errorMessage } from '../../../shared/utils/errorMessage';
import { showToast } from '../../../shared/components/common/Toast';

export const useTransactionStore = create((set, get) => ({
  transactions: [],
  ownedProductIds: new Set(),
  loading: false,
  buying: false,
  error: null,

  getMyTransactions: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await getMyTransactionsRequest();
      const transactions = response.data.data;
      const ownedProductIds = new Set(
        transactions
          .filter((t) => t.status === 'COMPLETED' && t.productId?._id)
          .map((t) => t.productId._id)
      );

      set({
        transactions,
        ownedProductIds,
        loading: false,
      });
    } catch (err) {
      const message = errorMessage(err, 'No se puede obtener el historial de las transacciones.');
      set({
        error: message,
        loading: false,
      });
      showToast(message, 'error');
    }
  },

  buyProduct: async ({ productId, accountNumber }) => {
    try {
      set({
        buying: true,
        error: null,
      });

      const response = await buyProductRequest(productId, { accountNumber });
      const newTransaction = response.data.data;

      const ownedProductIds = new Set(get().ownedProductIds);
      ownedProductIds.add(productId);

      set((state) => ({
        transactions: [newTransaction, ...state.transactions],
        ownedProductIds,
        buying: false,
      }));

      return {
        success: true,
        data: newTransaction,
      };
    } catch (err) {
      const message = errorMessage(err, 'No se pudo adquirir el producto');
      set({
        error: message,
        buying: false,
      });

      showToast(message, 'error');
      
      return {
        success: false,
        error: message,
      };
    }
  },
}));
