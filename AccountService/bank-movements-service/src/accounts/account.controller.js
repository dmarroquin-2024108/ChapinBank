import { createAccountRecord, getAccountsRecord, getAccountById, updateAccountRecord, getAccountByNumberAccount, updateAccountBalanceInternal } from "./account.service.js";

const formatBalance = (account) => ({
    ...account.toObject(),
    balance: account.balance.toFixed(2)
});

export const createAccount = async (req, res) => {
    try {
        const account = await createAccountRecord({
            accountType: req.body.accountType,
            userId: req.user.id
        })

        res.status(201).json({
            success: true,
            message: 'Cuenta resgitrada exitosamente',
            data: formatBalance(account)
        })
    } catch (e) {
        res.status(e.statusCode || 500).json({
            success: false,
            message: 'Error al crear la cuenta',
            error: e.message
        })
    }//try-catch
}//createAccount

export const getAccounts = async (req, res) => {
    try {
        const accounts = await getAccountsRecord(req.user.id);
        res.status(200).json({
            success: true,
            total: accounts.length,
            data: accounts.map(formatBalance)
        });
    } catch (e) {
        res.status(e.statusCode || 500).json({
            success: false,
            message: 'Error al obtener las cuentas',
            error: e.message
        })
    }//try-catcha
}//getAccounts

export const getAccountId = async (req, res) => {
    try {
        const account = await getAccountById({
            accountNumber: req.params.accountNumber,
            userId: req.user.id
        });
        res.status(200).json({
            success: true,
            data: formatBalance(account)
        });
    } catch (e) {
        res.status(e.statusCode || 500).json({
            success: false,
            message: 'Error al obtener las cuentas',
            error: e.message
        })
    }
}

export const getAccountInternal = async (req, res)=>{
    try{
        const account = await getAccountByNumberAccount(req.params.accountNumber);
        res.status(200).json({
            success: true,
            data: formatBalance(account)
        });
        
    }catch(e){
        res.status(e.statusCode || 500).json({
            success: false,
            message: 'Error al obtener la cuenta',
            error: e.message
        });
    }
};//getAccountInternal

export const updateAccount = async (req, res) => {
    try {
        const account = await updateAccountRecord({
            accountNumber: req.params.accountNumber,
            userId: req.user.id,
            data: req.body
        })
        res.status(200).json({
            success: true,
            message: 'Cuenta actualizada exitosamente',
            data: formatBalance(account)
        });
    } catch (e) {
        res.status(e.statusCode || 500).json({
            success: false,
            message: 'Error al actualizar campos',
            error: e.message
        })
    }
}

export const updateAccountInternal = async (req, res) => {
    try {
        const account = await updateAccountBalanceInternal(
            req.params.accountNumber,
            req.body.balance
        );
        res.status(200).json({
            success: true,
            data: formatBalance(account)
        });
    } catch (e) {
        res.status(e.statusCode || 500).json({
            success: false,
            message: 'Error al actualizar cuenta',
            error: e.message
        });
    }
};