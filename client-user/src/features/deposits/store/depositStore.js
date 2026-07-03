import { create } from 'zustand';
import { useAccountStore } from '../../accounts/store/accountsStore';
import {
  createDepositRequest,
  revertDepositRequest,
} from '../../../shared/api/deposits.requests';
import { errorMessage } from '../../../shared/utils/errorMessage';
import { showToast } from '../../../shared/components/common/Toast';

export const useDepositStore = create((set, get) => ({
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
      useAccountStore.getState().updateAccountBalance(accountNumber, data.data.balanceActual);
      return { success: true, data: data.data };
    } catch (err) {
      const message = errorMessage(err, 'Error al registrar el depósito');
      set({ error: message, loading: false });
      showToast(message, 'error');
      return { success: false, error: message };
    }
  },

  revertDeposit: async (depositId) => {
    try {
      set({ loading: true, error: null });

      const lastDeposit = get().lastDeposit; 
      const { data } = await revertDepositRequest(depositId);

      set({ lastDeposit: null, loading: false });

      if (lastDeposit) {
        const amountInGTQ = parseFloat(lastDeposit.amountInGTQ ?? lastDeposit.amount);
        const previousBalance = parseFloat(lastDeposit.balanceActual) - amountInGTQ;
        useAccountStore.getState().updateAccountBalance(lastDeposit.accountNumber, previousBalance);
      }

      return { success: true, data: data.data };
    } catch (err) {
      const message = errorMessage(err, 'No se pudo revertir el depósito');
      set({ error: message, loading: false });
      showToast(message, 'error');
      return { success: false, error: message };
    }
  },
  clearLastDeposit: () => set({ lastDeposit: null, error: null }),
}));
