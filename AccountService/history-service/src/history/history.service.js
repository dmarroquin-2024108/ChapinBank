//Existirá un modelo que defina la estructura
//Equivalencia a la capa de aplicacion en .NET
import Account from '../history.model.js';

export const accountStatement = async ({ accountId, startDate, endDate }) => {

    //Encontrar cuenta por su ID
    const account = await Account.findById(accountId);

    //Cuenta no encontrada por id
    if (!account) {
        const error = new Error('Cuenta no encontrada');
        error.statusCode = 404;
        error.code = 'ACCOUNT_NOT_FOUND';
        throw error;
    }

    let movements = account.movements;

    //Filtro para fechas
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        movements = movements.filter(movement =>
            movement.date >= start && movement.date <= end
        );
    }

    return {
        accountNumber: account.accountNumber, //Retorna el número de cuenta
        balance: account.balance, //Retorna el saldo
        movements
    };
};
