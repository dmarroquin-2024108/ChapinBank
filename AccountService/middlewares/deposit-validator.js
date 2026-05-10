import { body, param } from 'express-validator';
import { validateJWT } from './validate-JWT.js';
import { checkValidators } from './check-validators.js';

//validaciones para crear depositos

export const validateRevertDeposit = [
  validateJWT,
  param('id')
    .notEmpty()
    .withMessage('El ID del depósito es requerido')
    .isMongoId()
    .withMessage('El ID del depósito no es válido'),
  checkValidators,
]; //validateRevertDeposit

export const validateCreateDeposit = [
  validateJWT,
  body('accountNumber').notEmpty().withMessage('El número de cuenta es requerido'),
  body('amount')
    .notEmpty()
    .withMessage('El monto es requerido')
    .toFloat()
    .isFloat({ min: 1 })
    .withMessage('El monto debe de ser mayor o igual que 1.')
    .custom((val) => {
      if (!/^\d+(\.\d{1,2})?$/.test(val.toString())) {
        withMessage('El monto solo admite hasta 2 decimales');
      }
      return true;
    }),
  body('currency')
    .notEmpty()
    .withMessage('El tipo de moneda es obligatorio')
    .trim()
    .toUpperCase()
    .isIn(['GTQ', 'USD', 'EUR', 'MXN'])
    .withMessage('Tipo de moneda no válido. Use: GTQ, USD, EUR o MXN'),
  body('depositMethod')
    .notEmpty()
    .withMessage('El método de depósito es obligatorio')
    .trim()
    .toUpperCase()
    .isIn(['EFECTIVO', 'CHEQUE'])
    .withMessage('Método no válido.'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('La descripción no puede exceder 255 caracteres'),
  checkValidators,
];
