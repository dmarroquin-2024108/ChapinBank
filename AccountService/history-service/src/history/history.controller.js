import { getAccountHistory } from "./history.service.js";

export const History = async(req,res)=>{
    try{
        const history = await getAccountHistory({
            accountId: req.params.accountId
        });

        res.status(200).json({
            success:true,
            message:'Historial obtenido',
            data: history
        });

    }catch(err){
        res.status(500).json({
            success:false,
            message:'Error al obtener historial',
            error: err.message
        });
    }
}
