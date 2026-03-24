import { Router } from 'express';
import { accountHistory, bankHistory, createHistoryInternal } from './history.controller.js';
import { validateAccountHistory } from '../../middlewares/history.validator.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { requireRole } from '../../../../products-service/middlewares/validate-role.js';

const router = Router();

router.get(
    '/bank/movements',
    validateJWT,
    requireRole('ADMIN_ROLE'),
    bankHistory
);

router.get(
    '/account/:accountNumber',
    validateJWT,
    validateAccountHistory,
    accountHistory
);

router.post(
    '/internal',
    validateJWT,
    createHistoryInternal
);
export default router;
