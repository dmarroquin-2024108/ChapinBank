import axios from 'axios';
import Transaction from './transaction.model.js';
import Product from '../Products/products.model.js';
import { calculateFinalAmount } from '../../helpers/pricing.helper.js';

export const createTransactionRecord = async ({ userId, productId, accountType, accountNumber, token }) => {


    const product = await Product.findOne({ _id: productId, isActive: true });

    if (!product) {
        const error = new Error('Producto no disponible');
        error.statusCode = 404;
        throw error;
    }

    const pricing = calculateFinalAmount(product.price, accountType.toUpperCase());

    let originalBalance;
    let newBalance;
    let account;

    try {
        const accountResponse = await axios.get(
            `${process.env.ACCOUNT_SERVICE_URL}/accounts/internal/${accountNumber}`,
            { headers: { 'x-token': token } }
        );
        account = accountResponse.data.data;

        if (account.userId !== userId) {
            const error = new Error('La cuenta no pertenece al usuario');
            error.statusCode = 403;
            throw error;
        }
        originalBalance = parseFloat(account.balance);

        if (originalBalance < pricing.totalAmount) {
            const error = new Error('Fondos insuficientes');
            error.statusCode = 400;
            throw error;
        }

        const recheckResponse = await axios.get(
            `${process.env.ACCOUNT_SERVICE_URL}/accounts/internal/${accountNumber}`,
            { headers: { 'x-token': token } }
        );

        const currentBalance = parseFloat(recheckResponse.data.data.balance);

        if (currentBalance !== originalBalance) {
            throw new Error('La cuenta fue modificada recientemente. Intente de nuevo.');
        }

        newBalance = parseFloat((currentBalance - pricing.totalAmount).toFixed(2));

        console.log('PATCH datos:', {
            url: `${process.env.ACCOUNT_SERVICE_URL}/accounts/internal/${accountNumber}`,
            newBalance,
            token: token?.substring(0, 20) + '...'
        });
        await axios.patch(
            `${process.env.ACCOUNT_SERVICE_URL}/accounts/internal/${accountNumber}`,
            { balance: newBalance },
            { headers: { 'x-token': token } }
        );

        const transaction = new Transaction({
            userId,
            productId,
            amount: pricing.totalAmount,
            status: 'COMPLETED',
            reference: `Cuenta: ${accountNumber} | IVA(${(pricing.ivaRate * 100).toFixed(0)}%)`
        });

        await transaction.save();

        await axios.post(
            `${process.env.ACCOUNT_SERVICE_URL}/history/internal`,
            {
                type: 'TRANSACTION',
                accountNumber,
                userId,
                amount: -pricing.totalAmount,
                productId,
                status: 'COMPLETED',
                description: `Compra de ${product.name}`
            },
            { headers: { 'x-token': token } }
        );

        return {
            ...transaction.toObject(),
            pricing
        };

    } catch (e) {
        console.error('Error PATCH balance:', e.response?.status, e.response?.data);
        throw e;
    }
};//createTransactioRecord

export const getUserTransactions = async (userId) => {
    return await Transaction
        .find({ userId })
        .populate('productId');
};