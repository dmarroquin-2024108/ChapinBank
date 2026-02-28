import Account, { DEFAULT_BALANCES, ACCOUNT_PREFIJOS } from './account.model.js';

const generateAccountNumber = async (accountType) => {
    const prefijo = ACCOUNT_PREFIJOS[accountType];
    let accountNumber;
    let attempts = 0;

    do {
        accountNumber = `${prefijo}${Math.floor(10000000 + Math.random() * 90000000)}`;
        attempts++;
        if (attempts > 10) throw new Error('No se pudo generar número de cuenta');
    } while (await Account.exists({ accountNumber }));
    return accountNumber;
};// si se supera el número de intentos

export const createAccountRecord = async ({ accountType, userId }) => {
    const accountNumber = await generateAccountNumber(accountType);
    const balance = DEFAULT_BALANCES[accountType];

    const account = new Account({ userId, accountType, accountNumber, balance });
    await account.save();

    return account;
};//Crear una Cuenta

export const getAccountsRecord = async (userId) => {
    return Account.find({ userId });
}//Obtener todas las cuentas

export const getAccountById = async ({ accountNumber, userId }) => {
    const account = await Account.findOne({ accountNumber, userId });

    if (!account) {
        const error = new Error('Cuenta no encontrada');
        error.statusCode = 404;
        throw error;
    }
    return account;
};//Obtener una cuenta en especifico


export const getAccountByNumberAccount = async(accountNumber)=>{
    const account = await Account.findOne({accountNumber});
    if(!account){
        const error = new Error('Cuenta no encontrada');
        error.statusCode = 404;
        throw error;
    }
    return account;
}//Buscar una cuenta pero solo con el numero de cuenta

export const updateAccountRecord = async ({ accountNumber, userId, data }) => {
    const { accountType, accountNumber: an, ...safeData } = data;

    const account = await Account.findOneAndUpdate({
        accountNumber, userId
    },
        safeData,
        { new: true, runValidators: true });

    if (!account) {
        const e = new Error('Cuenta no encontrada');
        e.statusCode = 404;
        throw e;
    }

    return account;
};//PACTh

export const updateAccountBalanceInternal = async (accountNumber, balance) => {
    const account = await Account.findOneAndUpdate(
        { accountNumber },
        { balance },
        { new: true, runValidators: true }
    );
    if (!account) {
        const e = new Error('Cuenta no encontrada');
        e.statusCode = 404;
        throw e;
    }
    return account;
};