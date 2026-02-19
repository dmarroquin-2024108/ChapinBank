import {Router} from 'express';
import { UserRegister } from './field.controller.js';

const router = Router();
router.post('/', UserRegister);

export default router;