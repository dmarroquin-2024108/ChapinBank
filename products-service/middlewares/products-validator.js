import { body, param } from 'express-validator';
import { checkValidators } from './check-validators.js';

export const validateCreateProduct = [

    body('name')
        .notEmpty().withMessage('Nombre requerido')
        .isLength({ max: 100 }),

    body('description')
        .notEmpty().withMessage('Descripción requerida')
        .isLength({ max: 255 }),

    body('type')
        .notEmpty()
        .isIn(['SEGURO', 'VIAJE', 'SUSCRIPCION'])
        .withMessage('Tipo inválido'),

    body('price')
        .notEmpty()
        .toFloat()
        .isFloat({ min: 0 }),

    checkValidators
];

export const validateUpdateProduct = [

    param('id').isMongoId(),
    body('name').optional().isLength({ max: 100 }),
    body('description').optional().isLength({ max: 255 }),
    body('type').optional().isIn(['SEGURO', 'VIAJE', 'SUSCRIPCION']),
    body('price').optional().toFloat().isFloat({ min: 0 }),

    checkValidators
];