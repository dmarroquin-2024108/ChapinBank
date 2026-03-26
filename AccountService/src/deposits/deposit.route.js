import {Router} from 'express';
import {createDeposit, revertDeposit} from './deposit.controller.js';
import {validateCreateDeposit, validateRevertDeposit} from '../../middlewares/deposit-validator.js';

const router = Router();
router.post(
    '/',
    validateCreateDeposit,
    createDeposit
);

router.patch(
    '/:id/revert',
    validateRevertDeposit,
    revertDeposit
);

export default router;