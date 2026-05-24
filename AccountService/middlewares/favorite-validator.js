import { body, param } from 'express-validator';
import { checkValidators } from '../middlewares/check-validators.js';
import { validateJWT } from './validate-JWT.js';

export const validateAddFavorite = [
  validateJWT,
  body('accountNumber').notEmpty().withMessage('El número de cuenta es obligatorio').trim(),

  body('alias')
    .notEmpty()
    .withMessage('El alias es obligatorio')
    .trim()
    .isLength({ max: 50 })
    .withMessage('El alias no puede exceder 50 caracteres'),
  checkValidators,
];

export const validateUpdateFavorite = [
  validateJWT,
  param('id')
    .notEmpty()
    .withMessage('El id del favorito es obligatorio')
    .isMongoId()
    .withMessage('Id de favorito inválido'),

  body('alias')
    .notEmpty()
    .withMessage('El alias es obligatorio')
    .trim()
    .isLength({ max: 50 })
    .withMessage('El alias no puede exceder 50 caracteres'),
  checkValidators,
];

export const validateFavoriteId = [
  validateJWT,
  param('id')
    .notEmpty()
    .withMessage('El id del favorito es obligatorio')
    .isMongoId()
    .withMessage('Id de favorito inválido'),
  checkValidators,
];
