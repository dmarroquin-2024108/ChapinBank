import { createFieldRecord } from './field.service.js';
 
export const createField = async(req, res) =>{
    try {
        const field = await createFieldRecord({
            fieldData: req.body,
            file: req.file
        })
        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: field
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al registrar el usuario',
            error: err.message
        });
    }
}