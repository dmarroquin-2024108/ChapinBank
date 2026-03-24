import Notification from './notification.model.js';

const ALTO_VALOR = 10000;

const saveNotification = async(data) =>{
    try {
        const notification = new Notification(data);
        await notification.save();
        return notification;
    } catch (err) {
        const error = new Error('Error al guardar');
        error.statusCode = 404
        throw error;
    }
};

//se dispara desde el depositSerive
export const notifyDeposit  = async({ userId, accountNumber, amount, currency, depositMethod, newBalance}) =>{
    await saveNotification({
        userId,
        accountNumber,
        title: 'Deposito recibido',
        message: `Se acreditaron ${currency} ${amount.toFixed(2)} a tu cuenta ${accountNumber} vía ${depositMethod}
        Saldo actual: ${currency} ${parseFloat(newBalance).toFixed(2)}`,
        type: 'DEPÓSITO',
        severity: 'INFO',
        metadata: { amount, currency, depositMethod, newBalance}
    });

    //solo si supera los 10mil se tira una alerta extra
    if(amount >= ALTO_VALOR){
        await saveNotification({
            userId,
            accountNumber,
            title: 'Alerta: depósito de alto valor',
            message: `Se acredito ${currency} ${amount.toFixed(2)} a tu cuenta ${accountNumber}. Monto superior a  Q${ALTO_VALOR.toLocaleString()}. Si no reconoces esta operacion contacta al banco`,
            type: 'ALERTA',
            severity: 'ADVERTENCIA',
            metadata: {amount, currency, depositMethod, umbral: ALTO_VALOR}
        });
    }
};

// se dispara la alerta de una transferencia
export const notifyTransferCreated = async ({ userId, numberAccountOrigin, numberAccountDestination, amount, currency, commision, noOperacion}) =>{
    await saveNotification({
        userId,
        accountNumber: numberAccountOrigin,
        title: 'Transferencia en proceso',
        message: `ransferencia #${noOperacion} de ${currency} ${amount.toFixed(2)} hacia cuenta ${numberAccountDestination} está pendiente de confirmación
        Comisión aplicada: ${currency} ${commision.toFixed(2)}`,
        type: 'TRANSFERENCIA_ENVIADA',
        severity: 'INFO',
        metadata: { amount, currency, numberAccountDestination, commision, noOperacion, status: 'PENDIENTE'}
    });

    if (amount >= ALTO_VALOR) {
        await saveNotification({
            userId,
            accountNumber: numberAccountOrigin,
            title: 'Alerta: transferencia de alto valor en proceso',
            message: `Se inició una transferencia de ${currency} ${amount.toFixed(2)} desde tu cuenta ${numberAccountOrigin} Si no reconoces esta operación, contacta al equipo debuggers del banco.`,
            type: 'ALERTA',
            severity: 'ADVERTENCIA',
            metadata: { amount, currency, numberAccountDestination, umbral: ALTO_VALOR }
        });
    }
};

//la alerta de transferencia al acpetar
export const notifyTransferCompleted = async({ senderUserId, receiverUserId, numberAccountOrigin, numberAccountDestination, amount, currency, noOperacion}) =>{
    //al que envio:su transferencia ya se completo
    await saveNotification({
        userId: senderUserId,
        accountNumber: numberAccountOrigin,
        title: 'Transferencia completada',
        message: `Tu transferencia #${noOperacion} de ${currency} ${amount.toFixed(2)} a la cuenta ${numberAccountDestination} fue completada exitosamente.`,
        type: 'TRANSFERENCIA_ENVIADA',
        severity: 'INFO',
        metadata: { amount, currency, numberAccountDestination, noOperacion, status: 'COMPLETADO' }
    });

    //al que recibio: le llego dinero
    await saveNotification({
        userId: receiverUserId,
        accountNumber: numberAccountDestination,
        title: 'Transferencia recibida',
        message: `Recibiste ${currency} ${amount.toFixed(2)} desde la cuenta ${numberAccountOrigin} No. operación: ${noOperacion}.`,
        type: 'TRANSFERENCIA_RECIBIDA',
        severity: 'INFO',
        metadata: { amount, currency, numberAccountOrigin, noOperacion }
    });

};

export const getNotificationByUser = async (userId) =>{
    return await Notification.find({ userId }).sort({ createdAt: -1});
}

export const markAsRead = async(notificationId ,userId) =>{
    const notification = await Notification.findOneAndUpdate(
        {_id: notificationId, userId},
        { read: true},
        { new: true}
    );
    if(!notification) throw new Error("Notificación no encontrada");
return notification;
};


