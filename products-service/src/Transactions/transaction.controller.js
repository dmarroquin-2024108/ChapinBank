import { createTransactionRecord, getUserTransactions } from './transaction.service.js';

export const buyProduct = async (req, res, next) => {
    try {
        const transaction = await createTransactionRecord({
            userId: req.user.id,
            productId: req.params.productId,
            accountType: req.user.accountType,
            accountNumber: req.body.accountNumber,
            token: req.headers['x-token'] || req.headers.authorization?.replace('Bearer ', '')
        });

        res.status(201).json({
            success: true,
            message: 'Producto adquirido exitosamente',
            data: transaction
        });
    } catch (err) {
        next(err);
    }
};

export const listMyTransactions = async (req, res, next) => {
    try {
        const transactions = await getUserTransactions(req.user.id);
        res.json({
            success: true,
            data: transactions
        });
    } catch (err) {
        next(err);
    }
};