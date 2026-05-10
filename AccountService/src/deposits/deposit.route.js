import { Router } from 'express';
import { createDeposit, revertDeposit, currency } from './deposit.controller.js';
import {
  validateCreateDeposit,
  validateRevertDeposit,
} from '../../middlewares/deposit-validator.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Deposits
 *   description: Gestión de depósitos bancarios
 */

/**
 * @swagger
 * /chapinbank/v1/deposits/currency:
 *   get:
 *     tags: [Deposits]
 *     summary: Obtener tasa de cambio
 *     description: Devuelve la tasa de cambio de una moneda extranjera a Quetzales (GTQ).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: currency
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           enum: [USD, EUR, MXN]
 *         description: Moneda a convertir
 *         example: "USD"
 *     responses:
 *       200:
 *         description: Tasa de cambio obtenida exitosamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 currency: "USD"
 *                 exchangeRate: 7.85
 *       400:
 *         description: Moneda no válida o no proporcionada
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Moneda no válida. Use: USD, EUR o MXN"
 *       401:
 *         description: No autorizado (token inválido o no enviado)
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "No se proporcionó un token"
 *       500:
 *         description: Error al obtener la tasa de cambio
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Error al obtener la tasa de cambio"
 */
router.get('/currency', validateJWT, currency);

/**
 * @swagger
 * /chapinbank/v1/deposits:
 *   post:
 *     tags: [Deposits]
 *     summary: Registrar un depósito
 *     description: Registra un depósito en la cuenta indicada y actualiza el balance.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountNumber
 *               - amount
 *               - currency
 *               - depositMethod
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 example: "AH0000001"
 *               amount:
 *                 type: number
 *                 minimum: 1
 *                 example: 500.00
 *               currency:
 *                 type: string
 *                 enum: [GTQ]
 *                 example: "GTQ"
 *               depositMethod:
 *                 type: string
 *                 enum: [EFECTIVO, CHEQUE]
 *                 example: "EFECTIVO"
 *               description:
 *                 type: string
 *                 maxLength: 255
 *                 example: "Depósito en ventanilla central"
 *     responses:
 *       201:
 *         description: Depósito registrado exitosamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Depósito registrado exitosamente"
 *               data:
 *                 depositId: "664f1a2b3c4d5e6f7a8b9c0d"
 *                 accountNumber: "AH0000001"
 *                 amount: "500.00"
 *                 currency: "GTQ"
 *                 depositMethod: "EFECTIVO"
 *                 description: "Depósito en ventanilla central"
 *                 balanceActual: "1500.00"
 *                 createdAt: "2024-06-01T10:00:00.000Z"
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Datos inválidos"
 *               errors:
 *                 - field: "amount"
 *                   message: "El monto debe de ser mayor o igual que 1."
 *       401:
 *         description: No autorizado (token inválido o no enviado)
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "No se proporcionó un token"
 *       500:
 *         description: Error al registrar el depósito
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Error al registrar el depósito"
 */
router.post('/', validateCreateDeposit, createDeposit);

/**
 * @swagger
 * /chapinbank/v1/deposits/{id}/revert:
 *   patch:
 *     tags: [Deposits]
 *     summary: Revertir un depósito
 *     description: Revierte un depósito activo siempre que no haya pasado más de 1 minuto desde su creación. Descuenta el monto del balance y registra el movimiento en el historial.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del depósito a revertir (ObjectId)
 *         example: "664f1a2b3c4d5e6f7a8b9c0d"
 *     responses:
 *       200:
 *         description: Depósito revertido exitosamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Depósito revertido exitosamente"
 *               data:
 *                 depositId: "664f1a2b3c4d5e6f7a8b9c0d"
 *                 accountNumber: "AH0000001"
 *                 amount: "500.00"
 *                 currency: "GTQ"
 *                 depositMethod: "EFECTIVO"
 *                 status: "REVERTED"
 *                 balanceActual: "1000.00"
 *                 revertedAt: "2024-06-01T10:00:45.000Z"
 *       400:
 *         description: El depósito ya fue revertido o ha pasado más de 1 minuto
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "No se puede revertir el depósito, ha pasado más de 1 minuto desde su creación"
 *       401:
 *         description: No autorizado (token inválido o no enviado)
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "No se proporcionó un token"
 *       403:
 *         description: El depósito no pertenece al usuario autenticado
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "No tienes permiso para revertir este depósito"
 *       404:
 *         description: Depósito no encontrado
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Depósito no encontrado"
 *       500:
 *         description: Error al revertir el depósito
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Error al revertir el depósito"
 */
router.patch('/:id/revert', validateRevertDeposit, revertDeposit);

export default router;
