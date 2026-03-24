import {Router} from 'express';
import {createDeposit} from './deposit.controller.js';
import {validateCreateDeposit} from '../../middlewares/deposit-validator.js';

const router = Router();
router.post(
    '/',
    validateCreateDeposit,
    createDeposit
);
export default router;