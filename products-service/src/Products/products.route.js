import { Router } from 'express';
import {
  createProduct,
  listProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} from './products.controller.js';
import {
  validateCreateProduct,
  validateUpdateProduct,
} from '../../middlewares/products-validator.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { requireRole } from '../../middlewares/validate-role.js';
import { upload } from '../../configs/cloudinary.configuration.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestión de productos (seguros, viajes y suscripciones)
 */

/**
 * @swagger
 * /products/v1/products:
 *   get:
 *     summary: Listar todos los productos activos
 *     description: "Devuelve todos los productos con `isActive: true`. No requiere autenticación."
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos activos
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
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Error al obtener productos"
 */
router.get('/', listProducts);

/**
 * @swagger
 * /products/v1/products/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     description: Devuelve el detalle de un producto activo. No requiere autenticación.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto (ObjectId)
 *         example: "664a1f2e8b3c4d0012345678"
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Producto no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Error al buscar producto"
 */
router.get('/:id', getOneProduct);

/**
 * @swagger
 * /products/v1/products:
 *   post:
 *     summary: Crear un nuevo producto
 *     description: Crea un producto de tipo SEGURO, VIAJE o SUSCRIPCION. Requiere JWT y rol ADMIN_ROLE.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *           example:
 *             name: "Seguro de vida premium"
 *             description: "Cobertura completa para ti y tu familia"
 *             type: "SEGURO"
 *             price: 299.99
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
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
 *                   example: "Producto creado"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: El usuario no tiene el rol ADMIN_ROLE
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error al crear el producto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Error al crear producto"
 */
router.post(
  '/',
  validateJWT,
  requireRole('ADMIN_ROLE', 'SUPERADMIN_ROLE'),
  validateCreateProduct,
  createProduct
);

/**
 * @swagger
 * /products/v1/products/{id}:
 *   put:
 *     summary: Actualizar un producto
 *     description: Actualiza completamente los campos de un producto existente. Requiere JWT y rol ADMIN_ROLE.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a actualizar (ObjectId)
 *         example: "664a1f2e8b3c4d0012345678"
 *     requestBody:
 *       required: true
 *       description: Campos a actualizar
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *           example:
 *             name: "Seguro de vida premium actualizado"
 *             description: "Nueva descripción del producto"
 *             type: "SEGURO"
 *             price: 349.99
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
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
 *                   example: "Producto actualizado"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: El usuario no tiene el rol requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error al actualizar el producto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Error al actualizar producto"
 */
router.put(
  '/:id',
  validateJWT,
  requireRole('ADMIN_ROLE', 'SUPERADMIN_ROLE'),
  validateUpdateProduct,
  updateProduct
);

/**
 * @swagger
 * /products/v1/products/{id}:
 *   delete:
 *     summary: Eliminar un producto (soft delete)
 *     description: |
 *       Marca el producto como inactivo (`isActive: false`) sin eliminarlo de la base de datos.
 *       Requiere JWT y rol ADMIN_ROLE.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a eliminar (ObjectId)
 *         example: "664a1f2e8b3c4d0012345678"
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
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
 *                   example: "Producto eliminado"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         description: Token JWT no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: El usuario no tiene el rol requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error al eliminar el producto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Error al eliminar producto"
 */
router.delete('/:id', validateJWT, requireRole('ADMIN_ROLE', 'SUPERADMIN_ROLE'), deleteProduct);

/**
 * @swagger
 * /products/v1/products/{id}/image:
 *   post:
 *     summary: Subir o reemplazar la imagen de un producto
 *     description: Sube una imagen a Cloudinary y la asocia al producto. Requiere JWT y rol ADMIN_ROLE.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto (ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Imagen subida correctamente
 *       400:
 *         description: No se proporcionó imagen o formato inválido
 *       404:
 *         description: Producto no encontrado
 */
router.post(
  '/:id/image',
  validateJWT,
  requireRole('ADMIN_ROLE', 'SUPERADMIN_ROLE'),
  upload.single('image'),
  uploadImage
);

export default router;
