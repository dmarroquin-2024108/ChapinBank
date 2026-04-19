import {Router} from 'express';
import {createAccount, getAccounts, getAccountId, updateAccount, getAccountInternal, updateAccountInternal} from './account.controller.js';
import {createAccountValidator} from '../../middlewares/account-validator.js';
import {validateJWT} from '../../middlewares/validate-JWT.js';

const router = Router()

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
 *     responses:
 *       201:
 *         description: Cuenta creada exitosamente
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
 *                   $ref: '#/components/schemas/Account'
 *       401:
 *         description: No autorizado (token inválido o no enviado)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error al crear la cuenta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 total:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Account'
 *       401:
 *         description: No autorizado (token inválido o no enviado)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error al obtener las cuentas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', getAccounts);

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
 *     responses:
 *       200:
 *         description: Cuenta obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Account'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error al obtener la cuenta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *     responses:
 *       200:
 *         description: Cuenta obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Account'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Cuenta actualizada correctamente
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
 *                   $ref: '#/components/schemas/Account'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error al actualizar la cuenta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *     responses:
 *       200:
 *         description: Cuenta actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Account'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/account-internal/:accountNumber', updateAccountInternal);

export default router;