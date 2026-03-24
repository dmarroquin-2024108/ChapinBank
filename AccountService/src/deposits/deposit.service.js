import Deposit from './deposit.model.js';
import History from '../history/history.model.js'
import { accountServiceClient } from '../../configs/axios.configuration.js';
import { notifyDeposit } from '../notifications/notification.service.js';

export const createDepositRecord = async ({ depositData, accountNumber, userId, token }) => {
    let account;
    try {
        const { data } = await accountServiceClient.get(
            `/chapinbank/v1/accounts/internal/${accountNumber}`, 
            { headers: { Authorization: `Bearer ${token}` } }
        );
        account = data.data;
    } catch (e) {
        const error = new Error('Cuenta no encontrada');
        error.statusCode = 404
        throw error;
    }

    const balanceActual = parseFloat(account.balance);
    const nuevoBalance = parseFloat((balanceActual + depositData.amount).toFixed(2));

    const deposit = new Deposit({
        ...depositData,
        accountNumber,
        userId,
        amount: parseFloat(depositData.amount.toFixed(2))
    });
    await deposit.save();

    await accountServiceClient.patch(
        `/chapinbank/v1/accounts/internal/${accountNumber}`,
        { balance: nuevoBalance },
        { headers: { Authorization: `Bearer ${token}` } }
    );

    await History.create({
        type: 'DEPOSIT',
        accountNumber,
        userId,
        amount: parseFloat(depositData.amount.toFixed(2)),
        currency: depositData.currency,
        depositMethod: depositData.depositMethod,
        description: depositData.description
    });

    await notifyDeposit({
        userId,
        accountNumber,
        amount: deposit.amount,
        currency: deposit.currency,
        depositMethod: deposit.depositMethod,
        newBalance: nuevoBalance
    })
    
    return {
        deposit,
        balanceActual: nuevoBalance.toFixed(2)
    };
};