import { Router } from 'express';
import { validateJWT } from '../../middlewares/validate-JWT.js';

import { buyProduct, listMyTransactions } from './transaction.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Compra de productos y consulta del historial de transacciones del usuario
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Pricing:
 *       type: object
 *       description: Desglose del monto final aplicado según el tipo de cuenta del usuario
 *       properties:
 *         basePrice:
 *           type: number
 *           example: 299.99
 *         ivaRate:
 *           type: number
 *           description: Tasa de IVA aplicada (ej. 0.12 equivale al 12%)
 *           example: 0.12
 *         totalAmount:
 *           type: number
 *           example: 335.99
 *     Transaction:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "664a1f2e8b3c4d0012345678"
 *         userId:
 *           type: string
 *           example: "user_abc123"
 *         productId:
 *           type: string
 *           description: ID del producto adquirido (ObjectId referencia a Product)
 *           example: "664a1f2e8b3c4d0098765432"
 *         amount:
 *           type: number
 *           description: Monto final cobrado (con IVA incluido)
 *           example: 335.99
 *         status:
 *           type: string
 *           enum: [PENDING, COMPLETED, FAILED]
 *           example: "COMPLETED"
 *         reference:
 *           type: string
 *           description: Referencia interna de la transacción con cuenta e IVA aplicado
 *           example: "Cuenta: 123456789 | IVA(12%)"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-06-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-06-01T00:00:00.000Z"
 *     TransactionWithPricing:
 *       allOf:
 *         - $ref: '#/components/schemas/Transaction'
 *         - type: object
 *           properties:
 *             pricing:
 *               $ref: '#/components/schemas/Pricing'
 *     TransactionPopulated:
 *       allOf:
 *         - $ref: '#/components/schemas/Transaction'
 *         - type: object
 *           properties:
 *             productId:
 *               $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /transactions/v1/transactions/buy/{productId}:
 *   post:
 *     summary: Comprar un producto
 *     description: |
 *       Permite que un usuario autenticado adquiera un producto descontando el monto de su cuenta bancaria.
 *       - El producto debe existir y estar activo (`isActive: true`).
 *       - El monto final se calcula en base al precio del producto y el tipo de cuenta del usuario (`accountType`).
 *       - Se valida que la cuenta pertenezca al usuario autenticado.
 *       - Se verifica que el saldo sea suficiente antes de procesar el cobro.
 *       - Se realiza una doble verificación del saldo para evitar condiciones de carrera.
 *       - Al completarse, se registra la transacción y se genera un movimiento en el historial de la cuenta.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a comprar (ObjectId)
 *         example: "664a1f2e8b3c4d0098765432"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountNumber
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 description: Número de cuenta bancaria desde la que se realizará el cobro
 *                 example: "123456789"
 *           example:
 *             accountNumber: "123456789"
 *     responses:
 *       201:
 *         description: Producto adquirido exitosamente
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
 *                   example: "Producto adquirido exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/TransactionWithPricing'
 *       400:
 *         description: Error de validación o fondos insuficientes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               fondosInsuficientes:
 *                 summary: Saldo insuficiente en la cuenta
 *                 value:
 *                   success: false
 *                   message: "Fondos insuficientes"
 *               cuentaModificada:
 *                 summary: La cuenta fue modificada durante el proceso
 *                 value:
 *                   success: false
 *                   message: "La cuenta fue modificada recientemente. Intente de nuevo."
 *       403:
 *         description: La cuenta no pertenece al usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "La cuenta no pertenece al usuario"
 *       404:
 *         description: Producto no encontrado o inactivo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Producto no disponible"
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
    '/buy/:productId',
    validateJWT,
    buyProduct
);

/**
 * @swagger
 * /transactions/v1/transactions/my-transactions:
 *   get:
 *     summary: Listar mis transacciones
 *     description: |
 *       Devuelve el historial completo de transacciones del usuario autenticado.
 *       El campo `productId` viene populado con los datos completos del producto adquirido.
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historial de transacciones del usuario
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
 *                     $ref: '#/components/schemas/TransactionPopulated'
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
    '/my-transactions',
    validateJWT,
    listMyTransactions
);

export default router;