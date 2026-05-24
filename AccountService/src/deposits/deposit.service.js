import Deposit from './deposit.model.js';
import History from '../history/history.model.js';
import {
  getAccountByNumberAccount,
  updateAccountBalanceInternal,
} from '../accounts/account.service.js';
import { notifyDeposit } from '../notifications/notification.service.js';
import { convertToGTQ } from '../../helpers/currency.helper.js';
import { validateActiveAccount } from '../../helpers/activeAccount.helper.js';

const REVERT_LIMIT_MS = parseInt(process.env.DEPOSIT_REVERT_LIMIT_MS || '60000'); //1 minuto para revertir el depósito

export const createDepositRecord = async ({ depositData, accountNumber, userId, token }) => {
  const { amountInGTQ, exchangeRate } = await convertToGTQ(
    depositData.amount,
    depositData.currency || 'GTQ'
  );

  const account = await getAccountByNumberAccount(accountNumber);
  validateActiveAccount(account);
  const balanceActual = parseFloat(account.balance);
  const nuevoBalance = parseFloat((balanceActual + amountInGTQ).toFixed(2));

  const deposit = new Deposit({
    ...depositData,
    accountNumber,
    userId,
    amount: parseFloat(depositData.amount.toFixed(2)),
    amountInGTQ,
    exchangeRate,
  });
  await deposit.save();
  await updateAccountBalanceInternal(accountNumber, nuevoBalance);

  await History.create({
    type: 'DEPOSIT',
    accountNumber,
    userId,
    amount: amountInGTQ,
    currency: depositData.currency,
    depositMethod: depositData.depositMethod,
    description: depositData.description,
    noOperacion: Number(`${Date.now()}${Math.floor(Math.random() * 10000000)}`),
  });

  await notifyDeposit({
    userId,
    accountNumber,
    amount: deposit.amount,
    currency: deposit.currency,
    depositMethod: deposit.depositMethod,
    newBalance: nuevoBalance,
  });

  return {
    deposit,
    balanceActual: nuevoBalance.toFixed(2),
  };
}; //Crear deposito

export const revertDepositRecord = async ({ depositId, userId, token }) => {
  const deposit = await Deposit.findById(depositId);
  if (!deposit) {
    const error = new Error('Depósito no encontrado');
    error.statusCode = 404;
    throw error;
  }

  if (deposit.userId !== userId) {
    const error = new Error('No tienes permiso para revertir este depósito');
    error.statusCode = 403;
    throw error;
  }

  if (deposit.status === 'REVERTED') {
    const error = new Error('Este depósito ya fue revertido');
    error.statusCode = 400;
    throw error;
  }

  const tiempoTranscurrido = Date.now() - new Date(deposit.createdAt).getTime();
  if (tiempoTranscurrido > REVERT_LIMIT_MS) {
    const error = new Error(
      'No se puede revertir el depósito, ha pasado más de 1 minuto desde su creación'
    );
    error.statusCode = 400;
    throw error;
  }

  const account = await getAccountByNumberAccount(deposit.accountNumber);
  const balanceActual = parseFloat(account.balance);
  const nuevoBalance = parseFloat((balanceActual - deposit.amountInGTQ).toFixed(2));

  deposit.status = 'REVERTED';
  deposit.revertedAt = new Date();

  await deposit.save();
  await updateAccountBalanceInternal(deposit.accountNumber, nuevoBalance);

  await History.create({
    type: 'DEPOSIT_REVERT',
    accountNumber: deposit.accountNumber,
    userId,
    amount: deposit.amountInGTQ,
    currency: deposit.currency,
    depositMethod: deposit.depositMethod,
    description: `Depósito revertido. Monto descontado: ${deposit.amountInGTQ.toFixed(2)}`,
    noOperacion: Number(`${Date.now()}${Math.floor(Math.random() * 10000000)}`),
  });

  return {
    deposit,
    balanceActual: nuevoBalance.toFixed(2),
  };
}; //revertDepositRecord
