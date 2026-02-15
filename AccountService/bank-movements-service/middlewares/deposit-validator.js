import {body, param} from 'express-validator';
import {validateJWT} from './validate-JWT.js';
import { checkValidators }  from './check-validators.js';

//validaciones para crear depositos

export const validateCreateDeposit = [
    validateJWT,
    body('amount')
        .notEmpty()
        .withMessage('El monto es requerido')
        .toFloat()
        .isFloat({min: 1})
        .withMessage('El monto debe de ser mayor o igual que 1.'),
    body('currency')
        .notEmpty()
        .withMessage('El tipo de moneda es obligatorio')
        .trim()
        .toUpperCase()
        .isIn(['GTQ', 'USD'])
        .withMessage('Tipo de moneda no válido.'),
    body('depositMethod')
        .notEmpty()
        .withMessage('El método de depósito es obligatorio')
        .trim()
        .toUpperCase()
        .isIn(['EFECTIVO', 'TRANSFERENCIA', 'CHEQUE'])
        .withMessage('Método no válido.'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 255 })
    .withMessage('La descripción no puede exceder 255 caracteres'),
        checkValidators,
];