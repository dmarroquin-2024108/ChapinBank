import { Router } from 'express';
import {
  createAccount,
  getAccounts,
  getAccountId,
  updateAccount,
  getAccountInternal,
  updateAccountInternal,
  getAccountsSummaryAdmin,
  getAllAccountsAdmin,
  toggleAccountStatusAdmin,
} from './account.controller.js';
import { createAccountValidator } from '../../middlewares/account-validator.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { requireRole } from '../../middlewares/validate-role.js';

const router = Router();

router.use(validateJWT);

/**
 * @swagger
 * /chapinbank/v1/accounts:
 *   post:
 *     tags: [Accounts]
 *     summary: Crear cuenta bancaria
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountType
 *             properties:
 *               accountType:
 *                 type: string
 *                 enum: [AHORRO, MONETARIA]
 *                 example: "AHORRO"
 *     responses:
 *       201:
 *         description: Cuenta creada exitosamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Cuenta creada exitosamente"
 *               data:
 *                 accountNumber: "AH0000001"
 *                 accountType: "AHORRO"
 *                 balance: 0
 *       401:
 *         description: No autorizado (token inválido o no enviado)
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "No autorizado"
 *       500:
 *         description: Error al crear la cuenta
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Error al crear la cuenta"
 */
router.post('/', createAccountValidator, createAccount);

/**
 * @swagger
 * /chapinbank/v1/accounts:
 *   get:
 *     tags: [Accounts]
 *     summary: Obtener cuentas del usuario
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cuentas obtenidas correctamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               total: 2
 *               data:
 *                 - accountNumber: "AH0000001"
 *                   accountType: "AHORRO"
 *                   balance: 500.00
 *                 - accountNumber: "MO0000002"
 *                   accountType: "MONETARIA"
 *                   balance: 1200.00
 *       401:
 *         description: No autorizado (token inválido o no enviado)
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "No autorizado"
 *       500:
 *         description: Error al obtener las cuentas
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Error al obtener las cuentas"
 */
router.get('/', getAccounts);

/**
 * @swagger
 * /chapinbank/v1/accounts/admin/summary:
 *   get:
 *     tags: [Accounts]
 *     summary: Resumen de cuentas (Admin)
 *     description: Devuelve el total de cuentas, activas, inhabilitadas y saldo total del banco. Solo accesible por administradores.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumen obtenido correctamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Resumen de cuentas obtenido"
 *               data:
 *                 total: 7
 *                 active: 5
 *                 disabled: 2
 *                 totalBalance: 295082.60
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Se requiere rol ADMIN_ROLE o SUPERADMIN_ROLE
 *       500:
 *         description: Error al obtener resumen
 */
router.get('/admin/summary', requireRole('ADMIN_ROLE', 'SUPERADMIN_ROLE'), getAccountsSummaryAdmin);

/**
 * @swagger
 * /chapinbank/v1/accounts/admin/all:
 *   get:
 *     tags: [Accounts]
 *     summary: Obtener todas las cuentas (Admin)
 *     description: Devuelve todas las cuentas registradas en el sistema. Solo accesible para administradores.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cuentas obtenidas correctamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               total: 3
 *               data:
 *                 - accountNumber: "AH0000001"
 *                   accountType: "AHORRO"
 *                   balance: 1500.00
 *                   isActive: true
 *                 - accountNumber: "MO0000002"
 *                   accountType: "MONETARIA"
 *                   balance: 3200.50
 *                   isActive: false
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "No autorizado"
 *       403:
 *         description: Se requiere rol ADMIN_ROLE o SUPERADMIN_ROLE
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Acceso denegado"
 *       500:
 *         description: Error al obtener las cuentas
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Error al obtener las cuentas"
 */
router.get('/admin/all', requireRole('ADMIN_ROLE', 'SUPERADMIN_ROLE'), getAllAccountsAdmin);

/**
 * @swagger
 * /chapinbank/v1/accounts/admin/{accountNumber}/status:
 *   patch:
 *     tags: [Accounts]
 *     summary: Activar o desactivar cuenta (Admin)
 *     description: Permite cambiar el estado de una cuenta bancaria. Solo accesible para administradores.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: accountNumber
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "AH0000001"
 *     responses:
 *       200:
 *         description: Estado de la cuenta actualizado correctamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Estado de la cuenta actualizado correctamente"
 *               data:
 *                 accountNumber: "AH0000001"
 *                 isActive: false
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "No autorizado"
 *       403:
 *         description: Se requiere rol ADMIN_ROLE o SUPERADMIN_ROLE
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Acceso denegado"
 *       404:
 *         description: Cuenta no encontrada
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Cuenta no encontrada"
 *       500:
 *         description: Error al actualizar el estado de la cuenta
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Error al actualizar el estado de la cuenta"
 */
router.patch(
  '/admin/:accountNumber/status',
  requireRole('ADMIN_ROLE', 'SUPERADMIN_ROLE'),
  toggleAccountStatusAdmin
);

/**
 * @swagger
 * /chapinbank/v1/accounts/{accountNumber}:
 *   get:
 *     tags: [Accounts]
 *     summary: Obtener cuenta por número
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: accountNumber
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "MO0000001"
 *     responses:
 *       200:
 *         description: Cuenta obtenida correctamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 accountNumber: "MO0000001"
 *                 accountType: "MONETARIA"
 *                 balance: 1000.00
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "No autorizado"
 *       500:
 *         description: Error al obtener la cuenta
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Error al obtener la cuenta"
 */
router.get('/:accountNumber', getAccountId);

/**
 * @swagger
 * /chapinbank/v1/accounts/account-internal/{accountNumber}:
 *   get:
 *     tags: [Accounts]
 *     summary: Obtener cuenta (Función exclusivamente del sistema)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: accountNumber
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "AH0000001"
 *     responses:
 *       200:
 *         description: Cuenta obtenida correctamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 accountNumber: "AH0000001"
 *                 accountType: "AHORRO"
 *                 balance: 500.00
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "No autorizado"
 */
router.get('/account-internal/:accountNumber', getAccountInternal);

/**
 * @swagger
 * /chapinbank/v1/accounts/{accountNumber}:
 *   patch:
 *     tags: [Accounts]
 *     summary: Actualizar cuenta
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: accountNumber
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "MO0000001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             accountType: "MONETARIA"
 *     responses:
 *       200:
 *         description: Cuenta actualizada correctamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Cuenta actualizada correctamente"
 *               data:
 *                 accountNumber: "MO0000001"
 *                 accountType: "MONETARIA"
 *                 balance: 1000.00
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "No autorizado"
 *       500:
 *         description: Error al actualizar la cuenta
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Error al actualizar la cuenta"
 */
router.patch('/:accountNumber', updateAccount);

/**
 * @swagger
 * /chapinbank/v1/accounts/account-internal/{accountNumber}:
 *   patch:
 *     tags: [Accounts]
 *     summary: Actualizar cuenta (Para el balance)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: accountNumber
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "AH0000001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - balance
 *             properties:
 *               balance:
 *                 type: number
 *                 example: 750.00
 *     responses:
 *       200:
 *         description: Cuenta actualizada correctamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 accountNumber: "AH0000001"
 *                 balance: 750.00
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "No autorizado"
 */
router.patch('/account-internal/:accountNumber', updateAccountInternal);

export default router;
