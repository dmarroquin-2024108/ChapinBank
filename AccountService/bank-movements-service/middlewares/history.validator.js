import { param } from 'express-validator';
import { checkValidators } from './check-validators.js';

export const validateAccountHistory = [
    param('accountNumber')
        .notEmpty().withMessage('El número de cuenta es requerido')
        .trim(),
    checkValidators
];
