import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-JWT.js';

import { buyProduct, listMyTransactions } from './transaction.controller.js';

const router = Router();

router.post(
    '/buy/:productId',
    validateJWT,
    buyProduct
);

router.get(
    '/my-transactions',
    validateJWT,
    listMyTransactions
);

export default router;