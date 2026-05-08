import { create } from "zustand";
import {
    getHistoryBank as getHistoryBankRequest,
    getAllProducts as getAllProductsRequest,
    getAllAccounts as getAllAccountsRequest,
    getAllUsers as getAllUsersRequest
} from '../../../shared/apis';
import { errorMessage } from "../../../shared/utils/errorMessage.js";

export const useAdminStore = create((set, get) => ({
    history: [],
    products: [],
    users:null,
    accounts: null,
    loadings: {
        history: false,
        products: false,
        accounts: false,
        users: false,
    },
    error: null,

    getHistoryBank: async () => {
        try {
            set((s) => ({ loadings: { ...s.loadings, history: true }, error: null }));
            const response = await getHistoryBankRequest();
            set((s) => ({ 
                history: response.data, 
                loadings: { 
                    ...s.loadings, 
                    history: false } }));
        } catch (err) {
            const message = errorMessage(err, "Error al obtener el historial");
            set({ error: message, loading: false });
            return { success: false, error: message }
        }
    },

    getAllProducts: async()=>{
        try{
            set((s) => ({ loadings: { ...s.loadings, products: true }, error: null }));
            const response = await getAllProductsRequest();
            set((s) => ({ 
                products: response.data, 
                loadings: { 
                    ...s.loadings, 
                    history: false } }));
        }catch(err){
            const message = errorMessage(err, "Error al obtener los productos");
            set({ error: message, loading: false });
            return { success: false, error: message }
        }
    },

    getAllAccounts: async()=>{
        try{
            set((s) => ({ loadings: { ...s.loadings, accounts: true }, error: null }));
            const response = await getAllAccountsRequest();
            set((s) => ({ 
                accounts: response.data, 
                loadings: { 
                    ...s.loadings, 
                    accounts: false } }));
        }catch(err){
            const message = errorMessage(err, "Error al obtener las cuentas");
            set({ error: message, loading: false });
            return { success: false, error: message }
        }
    },

    getAllUsers: async()=>{
        try{
            set((s) => ({ loadings: { ...s.loadings, users: true }, error: null }));
            const response = await getAllUsersRequest();
            set((s) => ({ 
                users: response.data, 
                loadings: { ...s.loadings, 
                    users: false } }));
        }catch(err){
            const message = errorMessage(err, "Error al obtener los usuarios");
            set({ error: message, loading: false });
            return { success: false, error: message }
        }
    }
}))