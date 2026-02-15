import { createDepositRecord } from "./deposit.service.js";

export const createDeposit = async(req, res)=>{
    try{
        const deposit = await createDepositRecord({
            depositData: req.body
        })//deposit
        res.status(201).json({
            success: true,
            message: 'Depósito resgitrado exitosamente',
            data: deposit
        })//res status
    }catch(err){
        res.status(500).json({
            success: false,
            message: 'Error al registrar el depósito',
            error: err.message
        })
    }//try-catch
}//createDeposti