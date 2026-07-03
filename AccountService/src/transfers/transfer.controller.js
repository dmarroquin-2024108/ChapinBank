import {
  createTransferRecord,
  acceptTransferRecord,
  cancelTransferRecord,
  rejectTransferRecord,
  getDailyLimitStatus,
  quickTransferRecord
} from './transfer.service.js';
import { getAllRates } from '../../helpers/currency.helper.js';

export const createTransfer = async (req, res) => {
  try {
    const {
      transfer,
      nuevoBalanceOrigen,
      commision,
      amountInGTQ,
      exchangeRate,
      transferToken,
      cancelWindowMinutes,
    } = await createTransferRecord({
      transferData: req.body,
      userId: req.user.id,
      token: req.token,
    });
    res.status(201).json({
      success: true,
      message:
        'Transferencia creada. Se envió un token al correo del destinatario para que la acepte o rechace.',
      data: {
        noOperacion: transfer.noOperacion,
        numberAccountOrigin: transfer.numberAccountOrigin,
        numberAccountDestination: transfer.numberAccountDestination,
        amount: transfer.amount.toFixed(2),
        currency: transfer.currency,
        amountInGTQ,
        exchangeRate,
        commision,
        status: transfer.status,
        nuevoBalanceOrigen,
        transferToken,
        expiresIn: '1 hora',
        cancelWindowMinutes,
        createdAt: transfer.createdAt,
      },
    });
  } catch (e) {
    res.status(e.statusCode || 500).json({
      success: false,
      message: e.message,
    });
  } //try-catch
}; //CreateTransfer

export const confirmTransfer = async (req, res) => {
  try {
    const { transferToken, action } = req.body;
    const actionUpper = action?.toUpperCase();
    if (!['ACEPTAR', 'CANCELAR', 'RECHAZAR'].includes(actionUpper)) {
      return res.status(400).json({
        success: false,
        message: 'Acción inválida. Use ACEPTAR, RECHAZAR ó CANCELAR',
      });
    } //If de aceptar, cancelar ó rechazar la transferencia

    const serviceToken = req.headers.authorization?.replace('Bearer ', '');
    const userId = req.user.id;

    let result;
    let message;

    if (actionUpper === 'ACEPTAR') {
      result = await acceptTransferRecord({ transferToken, token: serviceToken, userId });
      message = 'Transferencia aceptada exitosamente';
    } else if (actionUpper === 'RECHAZAR') {
      result = await rejectTransferRecord({ transferToken, token: serviceToken, userId });
      message = 'Transferencia rechazada. El monto fue rembolsado al emisor.';
    } else {
      result = await cancelTransferRecord({ transferToken, token: serviceToken, userId });
      message = 'Transferencia cancelada. El monto fue rembolsado a tu cuenta.';
    } //If anidados para el caso de rechazar, aceptar o cancelar la transferencia-

    res.status(200).json({
      success: true,
      message:
        action.toUpperCase() === 'ACEPTAR' ? 'Transferencia aceptada' : 'Transferencia cancelada',
      data: result,
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      message: 'Error al aceptar/rechazar la transferencia',
      error: e.message,
    });
  } //try-cathc
}; //acceptTransfer

export const getDailyLimit = async (req, res) => {
  try {
    const { accountNumber } = req.query;
    if (!accountNumber) {
      return res.status(400).json({
        success: false,
        message: 'El parámetro accountNumber es obligatorio.',
      });
    }
    const status = await getDailyLimitStatus(accountNumber);
    res.status(200).json({
      success: true,
      data: status,
    });
  } catch (e) {
    res.status(e.statusCode || 500).json({
      success: false,
      message: e.message,
    });
  }
}; //Devulve lo que puede transferir la cuenta en el día

export const getCurrencyRates = async (req, res) => {
  try {
    const base = (req.query.base || 'GTQ').toUpperCase();
    const rates = await getAllRates(base);
    res.status(200).json({
      success: true,
      data: rates,
    });
  } catch (e) {
    res.status(e.statusCode || 500).json({
      success: false,
      message: e.message,
    });
  }
}; //Consultar la tasas de las divisas de la api

export const quickTransfer = async (req, res) => {
  try {
    const { favoriteId } = req.params;
    const { transfer, nuevoBalanceOrigen, commision, amountInGTQ, exchangeRate } =
      await quickTransferRecord({
        favoriteId,
        userId: req.user.id,
        token: req.token,
        transferData: req.body,
      });

    res.status(201).json({
      success: true,
      message:
        'Transferencia creada. Se envió un token al correo del destinatario para que la acepte o rechace.',
      data: {
        noOperacion: transfer.noOperacion,
        numberAccountOrigin: transfer.numberAccountOrigin,
        numberAccountDestination: transfer.numberAccountDestination,
        amount: transfer.amount.toFixed(2),
        currency: transfer.currency,
        amountInGTQ,
        exchangeRate,
        commision,
        status: transfer.status,
        nuevoBalanceOrigen,
        createdAt: transfer.createdAt,
      },
    });
  } catch (e) {
    res.status(e.statusCode || 500).json({ success: false, message: e.message });
  }
}; //quickTransfer
