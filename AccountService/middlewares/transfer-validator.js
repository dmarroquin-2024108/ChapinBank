import { body } from 'express-validator';
import { validateJWT } from './validate-JWT.js';
import { checkValidators } from './check-validators.js';

export const validateCreateTransfer = [
    validateJWT,

    body('amount')
        .notEmpty().withMessage('El monto es obligatorio')
        .matches(/^\d+(\.\d{1,2})?$/)
        .withMessage('El monto solo admite hasta 2 decimales')
        .toFloat()
        .isFloat({ min: 1 })
        .withMessage('El monto debe ser mayor o igual a 1'),

    body('currency')
        .notEmpty()
        .withMessage('El tipo de moneda es obligatorio')
        .trim()
        .toUpperCase()
        .isIn(['GTQ'])
        .withMessage('Tipo de moneda no válido'),

    body('numberAccountOrigin')
        .notEmpty()
        .withMessage('La cuenta de origen es obligatoria')
        .trim(),

    body('originHolder')
        .notEmpty()
        .withMessage('El titular de origen es obligatorio')
        .trim(),

    body('numberAccountDestination')
        .notEmpty()
        .withMessage('La cuenta de destino es obligatoria')
        .trim()
        .custom((value, { req }) => {
        if (value === req.body.numberAccountOrigin) {
            throw new Error('La cuenta de origen y destino no pueden ser la misma');
        }
        return true;
    }),

    body('destinationHolder')
        .notEmpty()
        .withMessage('El titular de destino es obligatorio')
        .trim(),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 255 })
        .withMessage('La descripción no puede exceder 255 caracteres'),

    checkValidators,
];

export const validateConfirmTransfer = [
    validateJWT,

    body('transferToken')
        .notEmpty()
        .withMessage('El token de transferencia es obligatorio')
        .trim(),

    body('action')
        .notEmpty()
        .withMessage('La acción es obligatoria')
        .trim()
        .toUpperCase()
        .isIn(['ACEPTAR', 'CANCELAR'])
        .withMessage('Acción inválida. Use ACEPTAR o CANCELAR'),

    checkValidators,
];