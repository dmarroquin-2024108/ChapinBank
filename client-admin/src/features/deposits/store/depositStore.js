import { create } from 'zustand';
import {
  createDeposit as createDepositRequest,
  revertDeposit as revertDepositRequest,
} from '../../../shared/apis/deposits.js';
import { errorMessage } from '../../../shared/utils/errorMessage.js';

export const useDepositStore = create((set, get) => ({
  //Estado
  lastDeposit: null,
  loading: false,
  error: null,

  createDeposit: async ({ accountNumber, amount, currency, depositMethod, description }) => {
    try {
      set({ loading: true, error: null });

      const { data } = await createDepositRequest({
        accountNumber,
        amount: parseFloat(amount),
        currency,
        depositMethod,
        description: description?.trim() || undefined,
      });

      set({ lastDeposit: data.data, loading: false });
      return { success: true, data: data.data };
    } catch (err) {
      const message = errorMessage(err, 'Error al registrar el depósito');
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  revertDeposit: async (depositId) => {
    try {
      set({ loading: true, error: null });

      const { data } = await revertDepositRequest(depositId);

      set({ lastDeposit: null, loading: false });
      return { success: true, data: data.data };
    } catch (err) {
      const message = errorMessage(err, 'No se pudo revertir el depósito');
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },
  clearLastDeposit: () => set({ lastDeposit: null, error: null }),
}));
