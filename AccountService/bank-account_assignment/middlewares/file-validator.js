import { body } from 'express-validator';
import { checkValidators } from '../helpers/check-validators.js';

export const registerValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Nombre requerido")
    .isLength({ min: 2 }).withMessage("Nombre muy corto"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email requerido")
    .isEmail().withMessage("Email inválido")
    .normalizeEmail(),

  body("account_type")
    .trim()
    .notEmpty().withMessage("El tipo de cuenta es obligatorio")
    .isIn(['Savings', 'Monetary'])
    .withMessage("Tipo inválido. Debe ser 'Savings' o 'Monetary'"),

  body("saving_goal")
    .optional()
    .isNumeric().withMessage("La meta de ahorro debe ser un número"),

  checkValidators
];