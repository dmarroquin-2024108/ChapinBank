import { getAccountHistory, getBankHistory } from "./history.service.js";
import History from './history.model.js'
export const accountHistory = async(req,res)=>{
    try{
        const history = await getAccountHistory({
            accountNumber: req.params.accountNumber
        });

        res.status(200).json({
            success:true,
            message:'Historial de cuenta obtenido',
            total: history.length,
            data: history
        });

    }catch(err){
        res.status(500).json({
            success:false,
            message:'Error al obtener historial de cuenta',
            error: err.message
        });
    }
}//Historial de cuenta

export const bankHistory = async(req, res)=>{
    try{
        const history = await getBankHistory();

        res.status(200).json({
            success:true,
            message:'Historial del banco obtenido (últimos 20 movimientos)',
            total: history.length,
            data: history
        });
    }catch(e){
        res.status(500).json({
            success:false,
            message:'Error al obtener historial bancario',
            error: e.message
        });
    }
}//historial del banco

export const createHistoryInternal = async (req, res) => {
    const movement = await History.create(req.body);
    res.status(201).json({
        success: true,
        data: movement
    });
};
