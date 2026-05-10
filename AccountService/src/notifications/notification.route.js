import { Router } from 'express';
import { getMyNotifications, markNotificationAsRead } from './notification.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Gestión de notificaciones del usuario
 */

/**
 * @swagger
 * /chapinbank/v1/notifications/my:
 *   get:
 *     summary: Obtener las notificaciones del usuario autenticado
 *     description: Devuelve todas las notificaciones asociadas al usuario autenticado. Requiere JWT.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notificaciones del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error al obtener notificaciones
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Error al obtener notificaciones"
 */
router.get('/my', validateJWT, getMyNotifications);

/**
 * @swagger
 * /chapinbank/v1/notifications/{id}/read:
 *   patch:
 *     summary: Marcar una notificación como leída
 *     description: "Marca una notificación específica como leída (`read: true`). Requiere JWT."
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la notificación (ObjectId)
 *         example: "664a1f2e8b3c4d0012345678"
 *     responses:
 *       200:
 *         description: Notificación marcada como leída
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Notificación marcada como leída"
 *                 data:
 *                   $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Notificación no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Notificación no encontrada"
 *       500:
 *         description: Error al actualizar la notificación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Error al marcar notificación como leída"
 */
router.patch('/:id/read', validateJWT, markNotificationAsRead);

export default router;
