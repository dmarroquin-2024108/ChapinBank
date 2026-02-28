import { Router } from 'express';
import { getMyNotifications, markNotificationAsRead } from './notification.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';

const router = Router();

// solo 2 endpoints — las notificaciones se crean automáticamente, no se hacen a mano 
router.get('/my', validateJWT, getMyNotifications);
router.patch('/:id/read', validateJWT, markNotificationAsRead);

export default router;