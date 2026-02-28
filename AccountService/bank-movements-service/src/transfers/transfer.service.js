import jwt from 'jsonwebtoken';
import Transfer from './transfer.model.js';
import Account from '../accounts/account.model.js';
import History from '../history/history.model.js'
import { accountServiceClient } from '../../configs/axios.configuration.js';
import { notifyTransferCompleted, notifyTransferCreated } from '../notifications/notification.service.js';



const COMISION = 3.00;

const getAccount = async (accountNumber, token) => {
    const { data } = await accountServiceClient.get(
        `/chapinbank/v1/accounts/internal/${accountNumber}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return data.data;
};//Obtener el numero de cuenta

const updateBalance = async (accountNumber, balance, token) => {
    await accountServiceClient.patch(
        `/chapinbank/v1/accounts/internal/${accountNumber}`,
        { balance },
        { headers: { Authorization: `Bearer ${token}` } }
    );
};//PATCH para actualizar el balance cuando haya una transferencia

export const createTransferRecord = async ({ transferData, userId, token }) => {
    const { numberAccountOrigin, numberAccountDestination } = transferData;

    if (numberAccountOrigin === numberAccountDestination) {
        const e = new Error(`La cuenta de origen y destino no pueden se las misma.`);
        console.error('Error al obtener cuenta:', e.response?.status, e.response?.data || e.message);
        e.statusCode = 400;
        throw e;
    }//Comparar que la cuenta Des/Origen no sean las mismas

    //Origen
    let accountOrigin;

    try {
        accountOrigin = await getAccount(numberAccountOrigin, token);
    } catch (err) {
        const e = new Error(err.response?.data?.error || 'Cuenta de origen no encontrada');
        e.statusCode = err.response?.status || 404;
        throw e;
    }//try-cath

    if (accountOrigin.userId !== userId) {
        const e = new Error('No tienes permiso para usar esta cuenta');
        e.statusCode = 403;
        throw e;
    }

    //DESTINI
    let accountDestination;
    try {
        accountDestination = await getAccount(numberAccountDestination, token);
    } catch (err) {
        const e = new Error(err.response?.data?.error || 'Cuenta de destino no encontrada');
        e.statusCode = err.response?.status || 404;
        throw e;
    }//try-catch

    //Si la cuenta es de ahorro una comision de 3 quetzales
    const commision = accountOrigin.accountType === 'AHORRO' ? COMISION : 0;
    const transferTotal = parseFloat((transferData.amount + commision).toFixed(2));

    const balanceOrigen = parseFloat(accountOrigin.balance);
    if (balanceOrigen < transferTotal) {
        const e = new Error('Saldo insuficiente. Por favor transfiera una menor cantidad. NOTA: Si es cuenta AHORRO  se decomizan 3 GTQ');
        e.statusCode = 404
        throw e;
    };

    //guardar la transferencia
    const transfer = new Transfer({
        ...transferData,
        userId,
        commision,
        noOperacion: Number(`${Date.now()}${Math.floor(Math.random() * 10000000)}`),
        status: 'PENDIENTE',
        amount: parseFloat(transferData.amount.toFixed(2))
    });
    await transfer.save();

    //generar el token
    const transferToken = jwt.sign(
        {
            transferId: transfer._id,
            type: 'TRANSFER_CONFIRMATION'
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    transfer.transferToken = transferToken;
    await transfer.save();

    //actualizar el saldo origen
    const nuevoBalanceOrigen = parseFloat((balanceOrigen - transferTotal).toFixed(2));
    await updateBalance(numberAccountOrigin, nuevoBalanceOrigen, token);

    await notifyTransferCreated({
        userId,
        numberAccountOrigin,
        numberAccountDestination,
        amount: transfer.amount,
        currency: transfer.currency,
        commision: transfer.commision,
        noOperacion: transfer.noOperacion
    });

    return {
        transfer,
        nuevoBalanceOrigen: nuevoBalanceOrigen.toFixed(2),
        commision: commision.toFixed(2),
        transferToken
    };
}//TRANSFERcreate

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
        accountDestination = await getAccount(transfer.numberAccountDestination, token);
    } catch (err) {
        const e = new Error('Cuenta de destino no encontrada');
        e.statusCode = 404;
        throw e;
    }//try-catch


    if (accountDestination.userId !== userId) {
        const error = new Error('No tienes permiso para aceptar esta transferencia');
        error.statusCode = 403;
        throw error;
    }//Si es el propetario de la cuenta

    //Actualizat el balance si se acepta la transferencia
    const nuevoBalanceDestino = parseFloat((parseFloat(accountDestination.balance) + transfer.amount).toFixed(2));
    await updateBalance(transfer.numberAccountDestination, nuevoBalanceDestino, token);

    transfer.status = 'COMPLETADO',
        transfer.transferToken = undefined;
    transfer.acceptedAt = new Date();
    await transfer.save();

    await History.create({
        type: 'TRANSFER',
        accountNumber: transfer.numberAccountDestination,
        userId: transfer.userId,
        amount: transfer.amount,
        numberAccountOrigin: transfer.numberAccountOrigin,
        numberAccountDestination: transfer.numberAccountDestination,
        commision: transfer.commision,
        status: 'COMPLETED',
        description: transfer.description
    });

    await notifyTransferCompleted({
        senderUserId: transfer.userId,
        receiverUserId: accountDestination.userId, 
        numberAccountOrigin: transfer.numberAccountOrigin,
        numberAccountDestination: transfer.numberAccountDestination,
        amount: transfer.amount,
        currency: transfer.currency,
        noOperacion: transfer.noOperacion
    });

    return {
        transfer,
        nuevoBalanceDestino: nuevoBalanceDestino.toFixed(2)
    }
}//Aceptar la transferencia

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

    // Verificar que sea el dueño de la cuenta origen o destino
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
    const reembolso = parseFloat((transfer.amount + transfer.commision).toFixed(2));
    const nuevoBalanceOrigen = parseFloat((balanceActual + reembolso).toFixed(2));

    await updateBalance(transfer.numberAccountOrigin, nuevoBalanceOrigen, token);

    transfer.status = 'CANCELADO';
    transfer.transferToken = undefined;
    transfer.canceledAt = new Date();
    await transfer.save();

    await History.create({
        type: 'TRANSFER',
        accountNumber: transfer.numberAccountOrigin,
        userId: transfer.userId,
        amount: transfer.amount,
        numberAccountOrigin: transfer.numberAccountOrigin,
        numberAccountDestination: transfer.numberAccountDestination,
        commision: transfer.commision,
        status: 'FAILED',
        description: 'Transferencia cancelada - reembolso aplicado'
    });

    await notifyTransferCreated({
        userId: transfer.userId,
        numberAccountOrigin: transfer.numberAccountOrigin,
        numberAccountDestination: transfer.numberAccountDestination,
        amount: transfer.amount,
        currency: transfer.currency,
        commision: 0,
        noOperacion: transfer.noOperacion
    });

    return {
        transfer,
        reembolso: reembolso.toFixed(2),
        nuevoBalanceOrigen: nuevoBalanceOrigen.toFixed(2)
    };
};//Cancelar la tranferencia