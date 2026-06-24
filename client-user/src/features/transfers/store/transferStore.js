import { create } from 'zustand';
import {
  createTransferRequest,
  confirmTransferRequest,
  getCurrencyRatesRequest,
  getDailyLimitRequest,
} from '../../../shared/api/transfers.requests';
import { errorMessage } from '../../../shared/utils/errorMessage';
import { showToast } from '../../../shared/components/common/Toast';

export const useTransferStore = create((set) => ({
  lastTransfer: null,
  currencyRates: null,
  dailyLimit: null,
  loading: false,
  loadingRates: false,
  loadingLimit: false,
  error: null,

  createTransfer: async (transferData) => {
    try {
      set({ loading: true, error: null });
      const { data } = await createTransferRequest(transferData);
      set({ lastTransfer: data.data, loading: false });
      showToast(data.message || 'Transferencia creada exitosamente', 'success');
      return { success: true, data: data.data };
    } catch (err) {
      const message = errorMessage(err, 'Error al crear la transferencia');
      set({ error: message, loading: false });
      showToast(message, 'error');
      return { success: false, error: message };
    }
  },

  confirmTransfer: async ({ transferToken, action }) => {
    try {
      set({ loading: true, error: null });
      const { data } = await confirmTransferRequest({ transferToken, action });
      set({ lastTransfer: null, loading: false });
      showToast(data.message || 'Transferencia procesada exitosamente', 'success');
      return { success: true, data: data.data };
    } catch (err) {
      const message = errorMessage(err, 'Error al procesar la transferencia');
      set({ error: message, loading: false });
      showToast(message, 'error');
      return { success: false, error: message };
    }
  },

  getCurrencyRates: async (base = 'GTQ') => {
    try {
      set({ loadingRates: true, error: null });
      const { data } = await getCurrencyRatesRequest(base);
      set({ currencyRates: data.data, loadingRates: false });
      return { success: true, data: data.data };
    } catch (err) {
      const message = errorMessage(err, 'Error al obtener las tasas de cambio');
      set({ error: message, loadingRates: false });
      return { success: false, error: message };
    }
  },

  getDailyLimit: async (accountNumber) => {
    try {
      set({ loadingLimit: true, error: null });
      const { data } = await getDailyLimitRequest(accountNumber);
      set({ dailyLimit: data.data, loadingLimit: false });
      return { success: true, data: data.data };
    } catch (err) {
      const message = errorMessage(err, 'Error al obtener el límite diario');
      set({ error: message, loadingLimit: false });
      return { success: false, error: message };
    }
  },

  clearLastTransfer: () => set({ lastTransfer: null, error: null }),
}));
