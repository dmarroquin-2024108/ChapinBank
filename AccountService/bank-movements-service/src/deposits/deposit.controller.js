import { createDepositRecord } from "./deposit.service.js";

export const createDeposit = async(req, res)=>{
    try{
        const {deposit, balanceActual} = await createDepositRecord({
            depositData: req.body,
            accountNumber: req.body.accountNumber,
            userId: req.user.id,
            token: req.token
        });
        res.status(201).json({
            success: true,
            message: 'Depósito resgitrado exitosamente',
            data:{
                accountNumber: deposit.accountNumber,
                amount: deposit.amount.toFixed(2),
                currency: deposit.currency,
                depositMethod: deposit.depositMethod,
                description: deposit.description,
                balanceActual: balanceActual,
                createdAt: deposit.createdAt
            }
        });//res status
    }catch(err){
        res.status(500).json({
            success: false,
            message: 'Error al registrar el depósito',
            error: err.message
        })
    }//try-catch
}//createDeposti