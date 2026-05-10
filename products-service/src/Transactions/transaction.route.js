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
 * /transactions/v1/transactions/buy/{productId}:
 *   post:
 *     summary: Comprar un producto
 *     description: |
 *       Permite que un usuario autenticado adquiera un producto descontando el monto de su cuenta bancaria.
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
router.post('/buy/:productId', validateJWT, buyProduct);

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
router.get('/my-transactions', validateJWT, listMyTransactions);

export default router;
