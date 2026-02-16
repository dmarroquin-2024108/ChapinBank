import { accountStatement } from "../history.service.js";

export const getAccountStatement = async (req, res) => {
    try {
        const { accountId } = req.params;
        const { startDate, endDate } = req.query;

        const statement = await accountStatement({
            accountId,
            startDate,
            endDate
        });

        res.status(200).json({
            success: true,
            message: 'Estado de cuenta obtenido exitosamente.',
            data: statement
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el estado de cuenta',
            error: e.message
        });
    }//try-catch
};//getAccountStatement