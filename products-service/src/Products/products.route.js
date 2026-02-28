import { Router } from 'express';
import { createProduct, listProducts, getOneProduct, updateProduct, deleteProduct } from './products.controller.js';

import { validateCreateProduct, validateUpdateProduct } from '../../middlewares/products-validator.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { requireRole } from '../../middlewares/validate-role.js';

const router = Router();

router.get('/', listProducts);
router.get('/:id', getOneProduct);

router.post(
    '/',
    validateJWT,
    requireRole('ADMIN_ROLE'),
    validateCreateProduct,
    createProduct
);

router.put(
    '/:id',
    validateJWT,
    requireRole('ADMIN_ROLE'),
    validateUpdateProduct,
    updateProduct
);

router.delete(
    '/:id',
    validateJWT,
    requireRole('ADMIN_ROLE'),
    deleteProduct
);

export default router;