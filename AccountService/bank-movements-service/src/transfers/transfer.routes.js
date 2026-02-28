import {Router} from 'express';
import {createTransfer, confirmTransfer} from './transfer.controller.js';
import {validateCreateTransfer, validateConfirmTransfer} from '../../middlewares/transfer-validator.js';

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

export default router;