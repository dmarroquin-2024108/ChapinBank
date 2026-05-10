import { createDepositRecord, revertDepositRecord } from './deposit.service.js';
import { convertToGTQ } from '../../helpers/currency.helper.js';

export const createDeposit = async (req, res) => {
  try {
    const { deposit, balanceActual } = await createDepositRecord({
      depositData: req.body,
      accountNumber: req.body.accountNumber,
      userId: req.user.id,
    });
    res.status(201).json({
      success: true,
      message: 'Depósito resgitrado exitosamente',
      data: {
        depositId: deposit._id,
        accountNumber: deposit.accountNumber,
        amount: deposit.amount.toFixed(2),
        currency: deposit.currency,
        amountInGTQ: deposit.amountInGTQ.toFixed(2),
        exchangeRate: deposit.exchangeRate,
        depositMethod: deposit.depositMethod,
        description: deposit.description,
        balanceActual: balanceActual,
        createdAt: deposit.createdAt,
      },
    }); //res status
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error al registrar el depósito',
      error: err.message,
    });
  } //try-catch
}; //createDeposti

export const revertDeposit = async (req, res) => {
  try {
    const { deposit, balanceActual } = await revertDepositRecord({
      depositId: req.params.id,
      userId: req.user.id,
      token: req.token,
    });
    res.status(200).json({
      success: true,
      message: 'Depósito revertido exitosamente',
      data: {
        depositId: deposit._id,
        accountNumber: deposit.accountNumber,
        amount: deposit.amount.toFixed(2),
        currency: deposit.currency,
        amountInGTQ: deposit.amountInGTQ.toFixed(2),
        exchangeRate: deposit.exchangeRate,
        depositMethod: deposit.depositMethod,
        status: deposit.status,
        balanceActual,
        revertedAt: deposit.revertedAt,
      },
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Error al revertir el depósito',
      error: err.message,
    });
  } //try-catch
}; //revertDeposit

export const currency = async (req, res) => {
  try {
    const base = (req.query.currency || 'GTQ').toUpperCase();
    const { exchangeRate } = await convertToGTQ(1, base);
    res.status(200).json({
      success: true,
      data: {
        currency: base,
        exchangeRate,
      },
    });
  } catch (e) {
    res.status(e.statusCode || 500).json({
      success: false,
      message: e.message || 'Error al obtener la tasa de cambio',
    });
  }
}; //Devuelve la tasa de cambio
