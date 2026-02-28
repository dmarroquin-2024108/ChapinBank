import { createTransferRecord, acceptTransferRecord, cancelTransferRecord } from "./transfer.service.js";

export const createTransfer = async (req, res) => {
    try {
        const { transfer, nuevoBalanceOrigen, commision, transferToken } = await createTransferRecord({
            transferData: req.body,
            userId: req.user.id,
            token: req.token
        });
        res.status(201).json({
            success: true,
            message: 'Transferencia creada, en espera a la aceptación del destinatario',
            data: {
                noOperacion: transfer.noOperacion,
                numberAccountOrigin: transfer.numberAccountOrigin,
                numberAccountDestination: transfer.numberAccountDestination,
                amount: transfer.amount.toFixed(2),
                status: transfer.status,
                nuevoBalanceOrigen,
                transferToken,
                completedAt: transfer.createdAt
            }
        })
    } catch (e) {
        res.status(e.statusCode || 500).json({
            success: false,
            message: e.message
        })
    }//try-catch
}//CreateTransfer

export const confirmTransfer= async (req, res) => {
    try {
        const { transferToken, action } = req.body;

        if (!['ACEPTAR', 'CANCELAR'].includes(action?.toUpperCase())) {
            return res.status(400).json({
                success: false,
                message: 'Acción inválida. Use ACEPTAR o CANCELAR'
            });
        }//If de aceptar o cancelar la transferencia

        const result = action.toUpperCase() === 'ACEPTAR'
            ? await acceptTransferRecord({ transferToken, token: req.headers.authorization?.replace('Bearer ', ''), userId: req.user.id })
            : await cancelTransferRecord({ transferToken, token: req.headers.authorization?.replace('Bearer ', ''), userId: req.user.id });

        res.status(200).json({
            success: true,
            message: action.toUpperCase() === 'ACEPTAR' ? 'Transferencia aceptada' : 'Transferencia cancelada',
            data: result
        });
    } catch (e) {
        res.status(400).json({
            success: false,
            message: 'Error al aceptar la transferencia',
            error: e.message
        })
    }//try-cathc
}//acceptTransfer