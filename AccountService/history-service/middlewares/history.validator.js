import { param } from "express-validator";
import { checkValidators } from "./check-validators.js";

export const validateHistory = [
    param('accountId')
        .isMongoId()
        .withMessage('ID de cuenta inválido'),
    checkValidators
];
