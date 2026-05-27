import { Router } from 'express';
import {
  accountHistory,
  bankHistory,
  createHistoryInternal,
  accountsByMovements,
  userRecentMovements,
  accountHistoryByType,
} from './history.controller.js';
import { validateAccountHistory } from '../../middlewares/history.validator.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { requireRole } from '../../middlewares/validate-role.js';

const router = Router();

/**
 * @swagger
 * /chapin-bank/v1/history/bank/movements:
 *   get:
 *     tags: [History]
 *     summary: Obtener historial de movimientos del banco
 *     description: Devuelve los últimos 20 movimientos registrados en el banco. Solo accesible por administradores.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historial del banco obtenido exitosamente
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
 *                   example: "Historial del banco obtenido (últimos 20 movimientos)"
 *                 total:
 *                   type: integer
 *                   example: 20
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/History'
 *       401:
 *         description: Token JWT inválido o no proporcionado
 *       403:
 *         description: Sin permisos de ADMIN_ROLE o SUPERADMIN_ROLE
 *       500:
 *         description: Error al obtener historial bancario
 */
router.get(
  '/bank/movements',
  validateJWT,
  requireRole('ADMIN_ROLE', 'SUPERADMIN_ROLE'),
  bankHistory
);

/**
 * @swagger
 * /chapin-bank/v1/history/bank/accounts-by-movements:
 *   get:
 *     tags: [History]
 *     summary: Obtener cuentas ordenadas por cantidad de movimientos
 *     description: Devuelve las cuentas ordenadas por número de movimientos. Se puede ordenar ascendente o descendente. Solo accesible por administradores.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: order
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Orden de los resultados. Por defecto descendente (más movimientos primero).
 *         example: "desc"
 *     responses:
 *       200:
 *         description: Cuentas ordenadas por movimientos obtenidas exitosamente
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
 *                   example: "Cuentas ordenadas por movimientos"
 *                 total:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       accountNumber:
 *                         type: string
 *                         example: "MO3456788"
 *                       totalMovements:
 *                         type: integer
 *                         example: 45
 *       401:
 *         description: Token JWT inválido o no proporcionado
 *       403:
 *         description: Sin permisos de ADMIN_ROLE o SUPERADMIN_ROLE
 *       500:
 *         description: Error al obtener cuentas por movimientos
 */
router.get(
  '/bank/accounts-by-movements',
  validateJWT,
  requireRole('ADMIN_ROLE', 'SUPERADMIN_ROLE'),
  accountsByMovements
);

/**
 * @swagger
 * /chapin-bank/v1/history/account/{accountNumber}:
 *   get:
 *     tags: [History]
 *     summary: Obtener historial de una cuenta específica
 *     description: Devuelve todos los movimientos registrados para una cuenta bancaria. El usuario autenticado solo puede consultar sus propias cuentas.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: accountNumber
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Número de cuenta bancaria a consultar
 *         example: "MO3456788"
 *     responses:
 *       200:
 *         description: Historial de cuenta obtenido exitosamente
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
 *                   example: "Historial de cuenta obtenido"
 *                 total:
 *                   type: integer
 *                   example: 8
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/History'
 *       400:
 *         description: El número de cuenta es requerido o inválido
 *       401:
 *         description: Token JWT inválido o no proporcionado
 *       500:
 *         description: Error al obtener historial de cuenta
 */
router.get('/account/:accountNumber', validateJWT, validateAccountHistory, accountHistory);

/**
 * @swagger
 * /chapin-bank/v1/history/internal:
 *   post:
 *     tags: [History]
 *     summary: Crear un registro de movimiento interno
 *     description: Crea un registro en el historial de forma interna. Usado por otros servicios del sistema para registrar movimientos como depósitos, transferencias y transacciones.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - accountNumber
 *               - userId
 *               - amount
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [DEPOSIT, DEPOSIT_UPDATE, DEPOSIT_REVERT, TRANSFER, TRANSACTION]
 *                 description: Tipo de movimiento
 *                 example: "DEPOSIT"
 *               accountNumber:
 *                 type: string
 *                 description: Número de cuenta asociado al movimiento
 *                 example: "MO3456788"
 *               userId:
 *                 type: string
 *                 description: ID del usuario que realizó el movimiento
 *                 example: "user_abc123"
 *               amount:
 *                 type: number
 *                 description: Monto del movimiento
 *                 example: 500.00
 *               currency:
 *                 type: string
 *                 description: Moneda del movimiento (por defecto GTQ)
 *                 default: "GTQ"
 *                 example: "GTQ"
 *               depositMethod:
 *                 type: string
 *                 description: Método de depósito (opcional, aplica para DEPOSIT)
 *                 example: "EFECTIVO"
 *               noOperacion:
 *                 type: string
 *                 description: Número único de operación
 *                 example: "OP-2024-000456"
 *               numberAccountOrigin:
 *                 type: string
 *                 description: Número de cuenta origen
 *                 example: "AH007845"
 *               originHolder:
 *                 type: string
 *                 description: Nombre del titular de la cuenta origen
 *                 example: "Juan Pérez"
 *               numberAccountDestination:
 *                 type: string
 *                 description: Número de cuenta destino
 *                 example: "MO3456788"
 *               destinationHolder:
 *                 type: string
 *                 description: Nombre del titular de la cuenta destino
 *                 example: "María López"
 *               commision:
 *                 type: number
 *                 description: Comisión cobrada por el movimiento (opcional)
 *                 example: 5.00
 *               status:
 *                 type: string
 *                 enum: [PENDING, COMPLETED, FAILED]
 *                 description: Estado del movimiento (por defecto COMPLETED)
 *                 default: "COMPLETED"
 *                 example: "COMPLETED"
 *               productId:
 *                 type: string
 *                 description: ID del producto relacionado al movimiento (opcional)
 *                 example: "664f1a2b3c4d5e6f7a8b9c0d"
 *               description:
 *                 type: string
 *                 description: Descripción adicional del movimiento (opcional)
 *                 example: "Depósito en efectivo en agencia central"
 *     responses:
 *       201:
 *         description: Registro de movimiento creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/History'
 *       401:
 *         description: Token JWT inválido o no proporcionado
 *       500:
 *         description: Error al crear el registro de movimiento
 */
router.post('/internal', validateJWT, createHistoryInternal);

/**
 * @swagger
 * /chapin-bank/v1/history/user/recent:
 *   get:
 *     tags: [History]
 *     summary: Obtener movimientos recientes del usuario
 *     description: Devuelve los movimientos recientes del usuario autenticado.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Movimientos recientes obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HistoryListResponse'
 *       401:
 *         description: Token JWT inválido o no proporcionado
 *       500:
 *         description: Error al obtener movimientos recientes
 */
router.get('/user/recent', validateJWT, userRecentMovements);

/**
 * @swagger
 * /chapin-bank/v1/history/bank/account-filter:
 *   get:
 *     tags: [History]
 *     summary: Filtrar historial por tipo de movimiento
 *     description: Permite obtener movimientos filtrados por tipo. Solo accesible para administradores.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: type
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           enum: [DEPOSIT, DEPOSIT_REVERT, TRANSFER, TRANSACTION]
 *         example: "TRANSFER"
 *     responses:
 *       200:
 *         description: Movimientos filtrados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HistoryListResponse'
 *       401:
 *         description: Token JWT inválido o no proporcionado
 *       403:
 *         description: Sin permisos de ADMIN_ROLE o SUPERADMIN_ROLE
 *       500:
 *         description: Error al filtrar movimientos
 */
router.get(
  '/bank/account-filter',
  validateJWT,
  requireRole('ADMIN_ROLE', 'SUPERADMIN_ROLE'),
  accountHistoryByType
);

export default router;
