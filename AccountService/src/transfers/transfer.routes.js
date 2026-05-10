import { Router } from 'express';
import {
  createTransfer,
  confirmTransfer,
  getCurrencyRates,
  getDailyLimit,
} from './transfer.controller.js';
import {
  validateCreateTransfer,
  validateConfirmTransfer,
} from '../../middlewares/transfer-validator.js';
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
 *             example:
 *               success: true
 *               message: "Transferencia creada. Se envió un token al correo del destinatario para que la acepte o rechace."
 *               data:
 *                 noOperacion: 123456789
 *                 numberAccountOrigin: "MO0000001"
 *                 numberAccountDestination: "AH0000002"
 *                 amount: "150.00"
 *                 currency: "GTQ"
 *                 amountInGTQ: "150.00"
 *                 exchangeRate: 1
 *                 commision: "3.00"
 *                 status: "PENDIENTE"
 *                 nuevoBalanceOrigen: "850.00"
 *                 transferToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 expiresIn: "1 hora"
 *                 cancelWindowMinutes: 30
 *                 createdAt: "2024-06-01T10:00:00.000Z"
 *       500:
 *         description: Error al crear la transferencia
 */
router.post('/', validateCreateTransfer, createTransfer);

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
 *             example:
 *               success: true
 *               message: "Transferencia aceptada"
 *               data:
 *                 transfer:
 *                   _id: "664f1a2b3c4d5e6f7a8b9c0d"
 *                   numberAccountOrigin: "MO0000001"
 *                   numberAccountDestination: "AH0000002"
 *                   amount: 150
 *                   currency: "GTQ"
 *                   status: "COMPLETADO"
 *                   noOperacion: 123456789
 *                 nuevoBalanceDestino: "1150.00"
 *       400:
 *         description: Error al aceptar/rechazar la transferencia
 */
router.post('/confirm', validateConfirmTransfer, confirmTransfer);

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
 *             example:
 *               success: true
 *               data:
 *                 base: "USD"
 *                 rates:
 *                   GTQ: 7.80
 *                   EUR: 0.92
 *                   MXN: 17.00
 *       500:
 *         description: Error al obtener tasas
 */
router.get('/currency', validateJWT, getCurrencyRates);

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
 *             example:
 *               success: true
 *               data:
 *                 used: 2000.00
 *                 remaining: 8000.00
 *                 limit: 10000.00
 *                 currency: "GTQ"
 *       400:
 *         description: El parámetro accountNumber es obligatorio
 *       500:
 *         description: Error al obtener el límite diario
 */
router.get('/daily-limit', validateJWT, getDailyLimit);

export default router;
