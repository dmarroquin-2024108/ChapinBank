import jwt from 'jsonwebtoken';
import Transfer from './transfer.model.js';
import History from '../history/history.model.js';
import { authServiceClient } from '../../configs/axios.configuration.js';
import {
  getAccountByNumberAccount,
  updateAccountBalanceInternal,
} from '../accounts/account.service.js';
import {
  notifyTransferCompleted,
  notifyTransferCreated,
} from '../notifications/notification.service.js';
import { convertToGTQ } from '../../helpers/currency.helper.js';
import { getFavoriteByIdRecord } from '../favorite/favorite.service.js';
import {
  sendTransferRequestEmail,
  sendTransferCancelledEmail,
  sendTransferRejectedEmail,
  sendTransferAcceptedEmail,
  sendTransferAcceptEmail,
} from './../../helpers/Email.helper.js';
import { validateActiveAccount } from '../../helpers/activeAccount.helper.js';

const COMISION = 3.0; //Comisión para cuenta de ahorro
const LIMITE_MOVIMIENTO = 2000.0; //Establecer límite de dinero que se puede transferir
const LIMITE_DIARIO = 10000.0; // Limite dirario por cuenta
const CANCEL_WINDOW_MINUTES = parseInt(process.env.TRANSFER_CANCEL_WINDOW_MINUTES || '30'); //Cancelar transferencia por emisor durante un tiempo de 30 minutos

const getUserEmail = async (userId, token) => {
  try {
    const { data } = await authServiceClient.post(
      '/api/v1/auth/profile/by-id',
      { userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { email: data.data.email, username: data.data.username };
  } catch (e) {
    console.error('Error al obtener email del usuario:', e.response?.data || e.message);
    return null;
  }
};

const getAccount = async (accountNumber) => {
  return await getAccountByNumberAccount(accountNumber);
}; //Obtener el numero de cuenta

const updateBalance = async (accountNumber, balance) => {
  await updateAccountBalanceInternal(accountNumber, balance);
}; //PATCH para actualizar el balance cuando haya una transferencia

const getDailyTransferAmount = async (numberAccountOrigin) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const result = await Transfer.aggregate([
    {
      $match: {
        numberAccountOrigin,
        status: { $in: ['PENDIENTE', 'COMPLETADO'] },
        createdAt: { $gte: startOfDay },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: `$amountInGTQ` }, //Ya lo suma convertido
      },
    },
  ]);
  return result.length > 0 ? result[0].total : 0;
}; //getDaillyTransfer

export const createTransferRecord = async ({ transferData, userId, token }) => {
  const { numberAccountOrigin, numberAccountDestination, currency = 'GTQ' } = transferData;

  if (numberAccountOrigin === numberAccountDestination) {
    const e = new Error(`La cuenta de origen y destino no pueden se las misma.`);
    console.error('Error al obtener cuenta:', e.response?.status, e.response?.data || e.message);
    e.statusCode = 400;
    throw e;
  } //Comparar que la cuenta Des/Origen no sean las mismas

  //Origen
  let accountOrigin;

  try {
    accountOrigin = await getAccount(numberAccountOrigin, token);
  } catch (err) {
    const e = new Error(err.response?.data?.error || 'Cuenta de origen no encontrada');
    e.statusCode = err.response?.status || 404;
    throw e;
  } //try-cath
  validateActiveAccount(accountOrigin, 'cuenta origen');

  if (accountOrigin.userId !== userId) {
    const e = new Error('No tienes permiso para usar esta cuenta');
    e.statusCode = 403;
    throw e;
  } //Verificar propiedad de la cuenta origen

  //DESTINI
  let accountDestination;
  try {
    accountDestination = await getAccount(numberAccountDestination, token);
  } catch (err) {
    const e = new Error(err.response?.data?.error || 'Cuenta de destino no encontrada');
    e.statusCode = err.response?.status || 404;
    throw e;
  } //try-catch
  validateActiveAccount(accountDestination, 'cuenta destino');
  const { amountInGTQ, exchangeRate } = await convertToGTQ(transferData.amount, currency); //Conversión

  //Si la cuenta es de ahorro una comision de 3 quetzales
  const commision = accountOrigin.accountType === 'AHORRO' ? COMISION : 0;

  //Limite por transferencia (2000.00)
  if (amountInGTQ > LIMITE_MOVIMIENTO) {
    const e = new Error(
      `No se puede transferir más de Q. ${LIMITE_MOVIMIENTO} en un solo movimiento.` +
        (currency !== 'GTQ' ? `(Tu monto equivale a Q. ${amountInGTQ.toFixed(2)})` : '')
    );
    e.statusCode = 400;
    throw e;
  }

  const balanceOrigen = parseFloat(accountOrigin.balance);
  const newBalance = parseFloat((amountInGTQ + commision).toFixed(2));

  if (balanceOrigen < newBalance) {
    const e = new Error(
      `Saldo insuficiente. Necesita Q.${newBalance.toFixed(2)}` +
        `(monto: Q.${amountInGTQ.toFixed(2)} + comisión: Q.${commision.toFixed(2)})` +
        `pero su saldo es de: Q.${balanceOrigen.toFixed(2)}`
    );
    e.statusCode = 400;
    throw e;
  } //Validar que el balance de la cuenta sea mayor al total de la transferencia

  const totalDiario = await getDailyTransferAmount(numberAccountOrigin);
  const proyectadoDiario = parseFloat((totalDiario + amountInGTQ).toFixed(2));

  if (proyectadoDiario > LIMITE_DIARIO) {
    const restante = parseFloat((LIMITE_DIARIO - totalDiario).toFixed(2));
    const e = new Error(
      `Límite diario de Q.${LIMITE_DIARIO.toFixed(2)} alcanzado. ` +
        `Ya transferió Q.${totalDiario.toFixed(2)} hoy.` +
        `Puede transferir como máximo: Q.${Math.max(0, restante).toFixed(2)} más.`
    );
    e.statusCode = 400;
    throw e;
  } // El máximo diario de transferencia

  //guardar la transferencia
  const transfer = new Transfer({
    ...transferData,
    userId,
    currency,
    amount: parseFloat(transferData.amount.toFixed(2)),
    amountInGTQ,
    exchangeRate,
    commision,
    noOperacion: Number(`${Date.now()}${Math.floor(Math.random() * 10000000)}`),
    status: 'PENDIENTE',
  });
  await transfer.save();

  //generar el token
  const transferToken = jwt.sign(
    {
      transferId: transfer._id,
      type: 'TRANSFER_CONFIRMATION',
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  transfer.transferToken = transferToken;
  await transfer.save();

  //actualizar el saldo origen
  const nuevoBalanceOrigen = parseFloat((balanceOrigen - newBalance).toFixed(2));
  await updateBalance(numberAccountOrigin, nuevoBalanceOrigen, token);

  await notifyTransferCreated({
    userId,
    numberAccountOrigin,
    numberAccountDestination,
    amount: transfer.amount,
    currency: transfer.currency,
    commision: transfer.commision,
    noOperacion: transfer.noOperacion,
  });

  const destinationUserInfo = await getUserEmail(accountDestination.userId, token);
  const originUserInfo = await getUserEmail(userId, token);

  if (destinationUserInfo) {
    sendTransferRequestEmail({
      toEmail: destinationUserInfo.email,
      toName: destinationUserInfo.email,
      fromName: originUserInfo?.username || transfer.originHolder,
      amount: transfer.amount,
      currency: transfer.currency,
      noOperacion: transfer.noOperacion,
      transferToken,
      cancelWindowMinutes: CANCEL_WINDOW_MINUTES,
    }).catch((emailE) =>
      console.error('Error al enviar el email al destinatario:', emailE.message)
    );
  }

  return {
    transfer,
    nuevoBalanceOrigen: nuevoBalanceOrigen.toFixed(2),
    commision: commision.toFixed(2),
    amountInGTQ: amountInGTQ.toFixed(2),
    exchangeRate,
    transferToken,
  };
}; //TRANSFERcreate

export const acceptTransferRecord = async ({ transferToken, token, userId }) => {
  let codigo;

  try {
    codigo = jwt.verify(transferToken, process.env.JWT_SECRET);
  } catch (e) {
    e.message = 'Token inválido o expirado. Por favor ingrese uno nuevo.';
    e.statusCode = 400;
    throw e;
  }

  if (codigo.type !== 'TRANSFER_CONFIRMATION') {
    const err = new Error('Token no válido para esta operación.');
    err.statusCode = 400;
    throw err;
  }
  const transfer = await Transfer.findById(codigo.transferId);

  if (!transfer) {
    const error = new Error('Transferencia no encontrada');
    error.statusCode = 404;
    throw error;
  }

  if (transfer.status !== 'PENDIENTE') {
    const error = new Error('Esta transferencia ya fue procesada');
    error.statusCode = 400;
    throw error;
  }

  let accountDestination;
  try {
    accountDestination = await getAccount(transfer.numberAccountDestination);
  } catch (err) {
    const e = new Error('Cuenta de destino no encontrada');
    e.statusCode = 404;
    throw e;
  } //try-catch
  validateActiveAccount(accountDestination, 'cuenta destino');

  if (accountDestination.userId !== userId) {
    const error = new Error('No tienes permiso para aceptar esta transferencia');
    error.statusCode = 403;
    throw error;
  } //Si es el propetario de la cuenta

  //Actualizat el balance si se acepta la transferencia
  const nuevoBalanceDestino = parseFloat(
    (parseFloat(accountDestination.balance) + transfer.amountInGTQ).toFixed(2)
  );
  await updateBalance(transfer.numberAccountDestination, nuevoBalanceDestino);

  ((transfer.status = 'COMPLETADO'), (transfer.transferToken = undefined));
  transfer.acceptedAt = new Date();
  await transfer.save();

  await History.create({
    type: 'TRANSFER',
    noOperacion: transfer.noOperacion,
    accountNumber: transfer.numberAccountDestination,
    userId: transfer.userId,
    currency: transfer.currency,
    amount: transfer.amountInGTQ,
    numberAccountOrigin: transfer.numberAccountOrigin,
    numberAccountDestination: transfer.numberAccountDestination,
    commision: transfer.commision,
    status: 'COMPLETED',
    description: transfer.description || 'Transferencia aceptada por el destinatario',
  });

  await notifyTransferCompleted({
    senderUserId: transfer.userId,
    receiverUserId: accountDestination.userId,
    numberAccountOrigin: transfer.numberAccountOrigin,
    numberAccountDestination: transfer.numberAccountDestination,
    amount: transfer.amount,
    currency: transfer.currency,
    noOperacion: transfer.noOperacion,
  });

  //F&F
  getUserEmail(transfer.userId, token).then((originUserInfo) => {
    if (originUserInfo) {
      sendTransferAcceptedEmail({
        toEmail: originUserInfo.email,
        toName: originUserInfo.username,
        amount: transfer.amount,
        currency: transfer.currency,
        noOperacion: transfer.noOperacion,
      }).catch((e) => console.error('Error al enviar email al emisor:', e.message));
    }
  });

  getUserEmail(accountDestination.userId, token).then((destinationUserInfo) => {
    if (destinationUserInfo) {
      sendTransferAcceptEmail({
        toEmail: destinationUserInfo.email,
        toName: destinationUserInfo.username,
        amount: transfer.amount,
        currency: transfer.currency,
        noOperacion: transfer.noOperacion,
      }).catch((e) => console.error('Error al enviar email al destinatario:', e.message));
    }
  });

  return {
    transfer,
    nuevoBalanceDestino: nuevoBalanceDestino.toFixed(2),
  };
}; //Aceptar la transferencia

export const rejectTransferRecord = async ({ transferToken, token, userId }) => {
  let codigo;

  try {
    codigo = jwt.verify(transferToken, process.env.JWT_SECRET);
  } catch (e) {
    e.message = 'Token inválido o expirado.';
    e.statusCode = 400;
    throw e;
  }

  if (codigo.type !== 'TRANSFER_CONFIRMATION') {
    const err = new Error('Token no válido para esta operación.');
    err.statusCode = 400;
    throw err;
  }

  const transfer = await Transfer.findById(codigo.transferId);

  if (!transfer) {
    const error = new Error('Transferencia no encontrada');
    error.statusCode = 404;
    throw error;
  }

  if (transfer.status !== 'PENDIENTE') {
    const error = new Error('Esta transferencia ya fue procesada');
    error.statusCode = 400;
    throw error;
  }

  //Verificar que sea el dueño de la cuenta destino (solo el destinatario puede rechazar)
  let accountDestination;
  try {
    accountDestination = await getAccount(transfer.numberAccountDestination);
  } catch (err) {
    const e = new Error('Cuenta de destino no encontrada');
    e.statusCode = 404;
    throw e;
  }

  if (accountDestination.userId !== userId) {
    const error = new Error('No tienes permiso para rechazar esta transferencia');
    error.statusCode = 403;
    throw error;
  }

  let accountOrigin;
  try {
    accountOrigin = await getAccount(transfer.numberAccountOrigin); //rembolso al que mando la transfer
  } catch (err) {
    const e = new Error('Cuenta de origen no encontrada');
    e.statusCode = 404;
    throw e;
  }

  const balanceActual = parseFloat(accountOrigin.balance);
  const reembolso = parseFloat((transfer.amountInGTQ + transfer.commision).toFixed(2));
  const nuevoBalanceOrigen = parseFloat((balanceActual + reembolso).toFixed(2));

  await updateBalance(transfer.numberAccountOrigin, nuevoBalanceOrigen);

  transfer.status = 'CANCELADO';
  transfer.transferToken = undefined;
  transfer.canceledAt = new Date();
  await transfer.save();

  await History.create({
    type: 'TRANSFER',
    noOperacion: transfer.noOperacion,
    accountNumber: transfer.numberAccountOrigin,
    userId: transfer.userId,
    currency: transfer.currency,
    amount: transfer.amountInGTQ,
    numberAccountOrigin: transfer.numberAccountOrigin,
    numberAccountDestination: transfer.numberAccountDestination,
    commision: transfer.commision,
    status: 'FAILED',
    description: 'Transferencia rechazada por el destinatario - reembolso aplicado',
  });

  //F&F
  getUserEmail(transfer.userId, token).then((originUserInfo) => {
    if (originUserInfo) {
      sendTransferRejectedEmail({
        toEmail: originUserInfo.email,
        toName: originUserInfo.username,
        amount: transfer.amount,
        currency: transfer.currency,
        noOperacion: transfer.noOperacion,
      }).catch((e) => console.error('Error al enviar email de rechazo:', e.message));
    }
  });

  return {
    transfer,
    reembolso: reembolso.toFixed(2),
    nuevoBalanceOrigen: nuevoBalanceOrigen.toFixed(2),
  };
}; //rejectTransferRecord

export const cancelTransferRecord = async ({ transferToken, token, userId }) => {
  let codigo;

  try {
    codigo = jwt.verify(transferToken, process.env.JWT_SECRET);
  } catch (e) {
    e.message = 'Token inválido o expirado.';
    e.statusCode = 400;
    throw e;
  }

  if (codigo.type !== 'TRANSFER_CONFIRMATION') {
    const err = new Error('Token no válido para esta operación.');
    err.statusCode = 400;
    throw err;
  }

  const transfer = await Transfer.findById(codigo.transferId);

  if (!transfer) {
    const error = new Error('Transferencia no encontrada');
    error.statusCode = 404;
    throw error;
  }

  if (transfer.status !== 'PENDIENTE') {
    const error = new Error('Esta transferencia ya fue procesada');
    error.statusCode = 400;
    throw error;
  }

  const minutosTranscurridos = (Date.now() - new Date(transfer.createdAt).getTime()) / 1000 / 60;
  if (minutosTranscurridos > CANCEL_WINDOW_MINUTES) {
    const error = new Error(
      `El tiempo para cancelar ha expirado. Solo puedes cancelar dentro de los primeros ${CANCEL_WINDOW_MINUTES} minutos. ` +
        `Han pasado ${Math.floor(minutosTranscurridos)} minutos.`
    );
    error.statusCode = 400;
    throw error;
  } //verificar que todavía está a tiempo de cancelar

  // Verificar que sea el dueño de la cuenta origen
  let accountOrigin;
  try {
    accountOrigin = await getAccount(transfer.numberAccountOrigin, token);
  } catch (err) {
    const e = new Error('Cuenta de origen no encontrada');
    e.statusCode = 404;
    throw e;
  }

  if (accountOrigin.userId !== userId) {
    const error = new Error('No tienes permiso para cancelar esta transferencia');
    error.statusCode = 403;
    throw error;
  }

  // Devolver el dinero a la cuenta origen
  const balanceActual = parseFloat(accountOrigin.balance);
  const reembolso = parseFloat((transfer.amountInGTQ + transfer.commision).toFixed(2));
  const nuevoBalanceOrigen = parseFloat((balanceActual + reembolso).toFixed(2));

  await updateBalance(transfer.numberAccountOrigin, nuevoBalanceOrigen, token);

  transfer.status = 'CANCELADO';
  transfer.transferToken = undefined;
  transfer.canceledAt = new Date();
  await transfer.save();

  await History.create({
    type: 'TRANSFER',
    noOperacion: transfer.noOperacion,
    accountNumber: transfer.numberAccountDestination,
    userId: transfer.userId,
    currency: transfer.currency,
    amount: transfer.amountInGTQ,
    numberAccountOrigin: transfer.numberAccountOrigin,
    numberAccountDestination: transfer.numberAccountDestination,
    commision: transfer.commision,
    status: 'FAILED',
    description: 'Transferencia cancelada - reembolso aplicado',
  });

  await notifyTransferCreated({
    userId: transfer.userId,
    numberAccountOrigin: transfer.numberAccountOrigin,
    numberAccountDestination: transfer.numberAccountDestination,
    amount: transfer.amount,
    currency: transfer.currency,
    commision: 0,
    noOperacion: transfer.noOperacion,
  });

  //F&F
  getAccount(transfer.numberAccountDestination)
    .catch(() => null)
    .then((destinationAccount) => {
      if (destinationAccount) {
        getUserEmail(destinationAccount.userId, token).then((destinationUserInfo) => {
          if (destinationUserInfo) {
            sendTransferCancelledEmail({
              toEmail: destinationUserInfo.email,
              toName: destinationUserInfo.username,
              amount: transfer.amount,
              currency: transfer.currency,
              noOperacion: transfer.noOperacion,
            }).catch((e) => console.error('Error al enviar email de cancelación:', e.message));
          }
        });
      }
    });

  return {
    transfer,
    reembolso: reembolso.toFixed(2),
    nuevoBalanceOrigen: nuevoBalanceOrigen.toFixed(2),
  };
}; //Cancelar la tranferencia

//Consultar el saldo diario disponible
export const getDailyLimitStatus = async (numberAccountOrigin) => {
  const used = await getDailyTransferAmount(numberAccountOrigin);
  const remaining = Math.max(0, parseFloat((LIMITE_DIARIO - used).toFixed(2)));
  return {
    used: parseFloat(used.toFixed(2)),
    remaining,
    limit: LIMITE_DIARIO,
    currency: 'GTQ',
  };
};

export const quickTransferRecord = async({ favoriteId, userId, token, transferData}) => {
  const favorite = await getFavoriteByIdRecord({ favoriteId, userId });

  return createTransferRecord({
    transferData: {
      ...transferData,
      numberAccountDestination: favorite.accountNumber,
      destinationHolder: transferData.destinationHolder ?? favorite.alias,
    },
    userId,
    token,
  });
};// Transferencias rapidas