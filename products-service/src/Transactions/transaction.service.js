import axios from 'axios';
import Transaction from './transaction.model.js';
import Product from '../Products/products.model.js';
import { calculateFinalAmount } from '../../helpers/pricing.helper.js';

export const createTransactionRecord = async ({
  userId,
  productId,
  accountType,
  accountNumber,
  token,
}) => {
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
      `${process.env.ACCOUNT_SERVICE_URL}/accounts/account-internal/${accountNumber}`,
      { headers: { 'x-token': token } }
    );
    account = accountResponse.data.data;
  } catch (e) {
    const error = new Error('No se pudo obtener la cuenta');
    error.statusCode = 502;
    throw error;
  }

  if (!account.status) {
    const error = new Error('La cuenta está deshabilitada. Solicite al banco su reactivación.');
    error.statusCode = 403;
    throw error;
  }

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

  let currentBalance;
  try {
    const recheckResponse = await axios.get(
      `${process.env.ACCOUNT_SERVICE_URL}/accounts/account-internal/${accountNumber}`,
      { headers: { 'x-token': token } }
    );
    currentBalance = parseFloat(recheckResponse.data.data.balance);
  } catch (e) {
    const error = new Error('No se pudo verificar el balance');
    error.statusCode = 502;
    throw error;
  }

  if (currentBalance !== originalBalance) {
    const error = new Error('La cuenta fue modificada recientemente. Intente de nuevo.');
    error.statusCode = 409;
    throw error;
  }

  newBalance = parseFloat((currentBalance - pricing.totalAmount).toFixed(2));

  try {
    await axios.patch(
      `${process.env.ACCOUNT_SERVICE_URL}/accounts/account-internal/${accountNumber}`,
      { balance: newBalance },
      { headers: { 'x-token': token } }
    );

    const transaction = new Transaction({
      userId,
      productId,
      amount: pricing.totalAmount,
      status: 'COMPLETED',
      reference: `Cuenta: ${accountNumber} | IVA(${(pricing.ivaRate * 100).toFixed(0)}%)`,
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
        description: `Compra de ${product.name}`,
      },
      { headers: { 'x-token': token } }
    );

    return {
      ...transaction.toObject(),
      pricing,
    };
  } catch (e){
    const error = new Error ('Error al procesar la transacción');
    error.statusCode = 502;
    throw error;
  }
}; //createTransactioRecord

export const getUserTransactions = async (userId) => {
  return await Transaction.find({ userId }).populate('productId');
};
