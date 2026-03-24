import History from './history.model.js';

export const getAccountHistory = async ({ accountNumber }) => {
    const history = await History.find({
        $or: [
            { accountNumber: accountNumber },
            { numberAccountOrigin: accountNumber },
            { numberAccountDestination: accountNumber }
        ]
    })
        .sort({ createdAt: -1 });
    return history.map(formatMovement);
}; //Busqueda en una cuenta en especifico

export const getBankHistory = async () => {
    const history = await History
        .find({})
        .sort({ createdAt: -1 })
        .limit(20);
    return history.map(formatMovement);
}; //Todo el banco

const formatMovement = (doc) => {
    switch (doc.type) {
        case 'DEPOSIT':
            return formatDeposit(doc);

        case 'TRANSFER':
            return formatTransfer(doc);

        case 'TRANSACTION':
            return formatTransaction(doc);

        default:
            return doc;
    }
}//Definir que tipo de movimiento se quiere en el historial

const formatDeposit = (doc) => ({
    accountNumber: doc.accountNumber,
    amount: doc.amount.toFixed(2),
    currency: doc.currency,
    depositMethod: doc.depositMethod,
    description: doc.description ?? 'Sin descripción',
    date: doc.createdAt
});

const formatTransfer = (doc) => ({
    noOperacion: doc.noOperacion,
    amount: doc.amount.toFixed(2),
    currency: doc.currency,
    numberAccountOrigin: doc.numberAccountOrigin,
    originHolder: doc.originHolder,
    numberAccountDestination: doc.numberAccountDestination,
    destinationHolder: doc.destinationHolder,
    commision: doc.commision,
    status: doc.status,
    description: doc.description ?? 'Sin descripción'
});

const formatTransaction = (doc) => ({
    productId: doc.productId,
    amount: doc.amount,
    status: doc.status
});