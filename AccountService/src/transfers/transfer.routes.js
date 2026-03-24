import {Router} from 'express';
import {createTransfer, confirmTransfer, getCurrencyRates, getDailyLimit} from './transfer.controller.js';
import {validateCreateTransfer, validateConfirmTransfer} from '../../middlewares/transfer-validator.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';

const router = Router();
router.post(
    '/',
    validateCreateTransfer,
    createTransfer  
);

router.post(
    '/confirm', 
    validateConfirmTransfer,
    confirmTransfer
);

router.get(
    '/currency',
    validateJWT,
    getCurrencyRates
)

router.get(
    '/daily-limit',
    validateJWT,
    getDailyLimit
)

export default router;