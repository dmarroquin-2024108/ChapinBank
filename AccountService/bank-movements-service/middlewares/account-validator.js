import {body, param} from 'express-validator';
import { checkValidators }  from '../middlewares/check-validators.js';

export const createAccountValidator = [
    body('accountType')
        .notEmpty()
        .withMessage('El tipo de cuenta es obligatorio')
        .toUpperCase()
        .isIn(['AHORRO', 'MONETARIA'])
        .withMessage('Solo se permite AHORRO o MONETARIA'),
        checkValidators,
];