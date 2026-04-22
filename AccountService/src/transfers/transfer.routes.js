import {Router} from 'express';
import {createTransfer, confirmTransfer, getCurrencyRates, getDailyLimit} from './transfer.controller.js';
import {validateCreateTransfer, validateConfirmTransfer} from '../../middlewares/transfer-validator.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';

const router = Router();

/**
 * @swagger
 * /chapinbank/v1/transfers:
 *   post:
 *     tags: [Transfers]
 *     summary: Crear transferencia
 *     description: Crea una transferencia y genera un token para confirmación.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numberAccountOrigin:
 *                 type: string
 *                 example: "MO0000001"
 *               originHolder:
 *                 type: string
 *                 example: "Juan Pérez"
 *               numberAccountDestination:
 *                 type: string
 *                 example: "AH0000002"
 *               destinationHolder:
 *                 type: string
 *                 example: "María García"
 *               amount:
 *                 type: number
 *                 example: 150.00
 *               currency:
 *                 type: string
 *                 example: "GTQ"
 *               description:
 *                 type: string
 *                 example: "Pago de servicios"
 *     responses:
 *       201:
 *         description: Transferencia creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     noOperacion:
 *                       type: number
 *                     numberAccountOrigin:
 *                       type: string
 *                     numberAccountDestination:
 *                       type: string
 *                     amount:
 *                       type: string
 *                     currency:
 *                       type: string
 *                     amountInGTQ:
 *                       type: string
 *                     exchangeRate:
 *                       type: number
 *                     commision:
 *                       type: string
 *                     status:
 *                       type: string
 *                     nuevoBalanceOrigen:
 *                       type: string
 *                     transferToken:
 *                       type: string
 *                     expiresIn:
 *                       type: string
 *                     cancelWindowMinutes:
 *                       type: number
 *                     createdAt:
 *                       type: string
 *       500:
 *         description: Error al crear la transferencia
 */
router.post(
    '/',
    validateCreateTransfer,
    createTransfer  
);

/**
 * @swagger
 * /chapinbank/v1/transfers/confirm:
 *   post:
 *     tags: [Transfers]
 *     summary: Confirmar transferencia
 *     description: Permite aceptar, rechazar o cancelar una transferencia.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transferToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               action:
 *                 type: string
 *                 example: "ACEPTAR"
 *     responses:
 *       200:
 *         description: Transferencia procesada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Error al aceptar/rechazar la transferencia
 */
router.post(
    '/confirm', 
    validateConfirmTransfer,
    confirmTransfer
);

/**
 * @swagger
 * /chapinbank/v1/transfers/currency:
 *   get:
 *     tags: [Transfers]
 *     summary: Obtener tasas de cambio
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: base
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         example: "USD"
 *     responses:
 *       200:
 *         description: Tasas obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       500:
 *         description: Error al obtener tasas
 */
router.get(
    '/currency',
    validateJWT,
    getCurrencyRates
);

/**
 * @swagger
 * /chapinbank/v1/transfers/daily-limit:
 *   get:
 *     tags: [Transfers]
 *     summary: Obtener límite diario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: accountNumber
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         example: "MO0000001"
 *     responses:
 *       200:
 *         description: Límite diario obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     used:
 *                       type: number
 *                     remaining:
 *                       type: number
 *                     limit:
 *                       type: number
 *                     currency:
 *                       type: string
 *       400:
 *         description: El parámetro accountNumber es obligatorio
 *       500:
 *         description: Error al obtener el límite diario
 */
router.get(
    '/daily-limit',
    validateJWT,
    getDailyLimit
);

export default router;