import {Router} from 'express';
import {createAccount, getAccounts, getAccountId, updateAccount, getAccountInternal, updateAccountInternal} from './account.controller.js';
import {createAccountValidator} from '../../middlewares/account-validator.js';
import {validateJWT} from '../../middlewares/validate-JWT.js';

const router = Router()

router.use(validateJWT);

router.post(
    '/',
    createAccountValidator,
    createAccount
);

router.get(
    '/',
    getAccounts
);

router.get(
    '/internal/:accountNumber',
    getAccountInternal
)

router.get(
    '/:accountNumber',
    getAccountId
);

router.patch(
    '/:accountNumber',
    updateAccount
);

router.patch(
    '/internal/:accountNumber', 
    updateAccountInternal); 
export default router;