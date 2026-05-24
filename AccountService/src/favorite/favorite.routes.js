import { Router } from 'express';
import {
  addFavorite,
  getFavorites,
  getFavoriteById,
  updateFavorite,
  deleteFavorite,
} from './favorite.controller.js';
import {
  validateAddFavorite,
  validateUpdateFavorite,
  validateFavoriteId,
} from '../../middlewares/favorite-validator.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';

const router = Router();

router.use(validateJWT);

/**
 * @swagger
 * /chapinbank/v1/favorites:
 *   post:
 *     tags: [Favorites]
 *     summary: Agregar cuenta a favoritos
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
 *               - alias
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 example: "AH0000002"
 *               alias:
 *                 type: string
 *                 example: "María - Ahorro"
 *     responses:
 *       201:
 *         description: Cuenta agregada a favoritos
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Cuenta agregada a favoritos"
 *               data:
 *                 _id: "664f1a2b3c4d5e6f7a8b9c0d"
 *                 accountNumber: "AH0000002"
 *                 accountType: "AHORRO"
 *                 alias: "María - Ahorro"
 *       400:
 *         description: Datos inválidos o cuenta propia
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Cuenta no encontrada
 */
router.post('/', validateAddFavorite, addFavorite);

/**
 * @swagger
 * /chapinbank/v1/favorites:
 *   get:
 *     tags: [Favorites]
 *     summary: Obtener favoritos del usuario
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Favoritos obtenidos correctamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               total: 2
 *               data:
 *                 - _id: "664f1a2b3c4d5e6f7a8b9c0d"
 *                   accountNumber: "AH0000002"
 *                   accountType: "AHORRO"
 *                   alias: "María - Ahorro"
 *                 - _id: "664f1a2b3c4d5e6f7a8b9c0e"
 *                   accountNumber: "MO0000003"
 *                   accountType: "MONETARIA"
 *                   alias: "Carlos - Monetaria"
 *       401:
 *         description: No autorizado
 */
router.get('/', getFavorites);

/**
 * @swagger
 * /chapinbank/v1/favorites/{id}:
 *   get:
 *     tags: [Favorites]
 *     summary: Obtener un favorito por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "664f1a2b3c4d5e6f7a8b9c0d"
 *     responses:
 *       200:
 *         description: Favorito obtenido correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Favorito no encontrado
 */
router.get('/:id', validateFavoriteId, getFavoriteById);

/**
 * @swagger
 * /chapinbank/v1/favorites/{id}:
 *   patch:
 *     tags: [Favorites]
 *     summary: Actualizar alias de un favorito
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "664f1a2b3c4d5e6f7a8b9c0d"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - alias
 *             properties:
 *               alias:
 *                 type: string
 *                 example: "María trabajo"
 *     responses:
 *       200:
 *         description: Alias actualizado correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Favorito no encontrado
 */
router.patch('/:id', validateUpdateFavorite, updateFavorite);

/**
 * @swagger
 * /chapinbank/v1/favorites/{id}:
 *   delete:
 *     tags: [Favorites]
 *     summary: Eliminar un favorito
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "664f1a2b3c4d5e6f7a8b9c0d"
 *     responses:
 *       200:
 *         description: Favorito eliminado correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Favorito no encontrado
 */
router.delete('/:id', validateFavoriteId, deleteFavorite);

export default router;
