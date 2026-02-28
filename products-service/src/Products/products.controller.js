import { createProductRecord, getProducts, getProductById, updateProductRecord, softDeleteProduct } from './products.service.js';

export const createProduct = async (req, res) => {
    try {
        const product = await createProductRecord({ productData: req.body });

        res.status(201).json({
            success: true,
            message: 'Producto creado',
            data: product
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al crear producto',
            error: err.message
        });
    }
};

export const listProducts = async (req, res) => {
    try {
        const products = await getProducts();

        res.json({
            success: true,
            data: products
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener productos'
        });
    }
};

export const getOneProduct = async (req, res) => {
    try {
        const product = await getProductById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        res.json({
            success: true,
            data: product
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al buscar producto'
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await updateProductRecord(req.params.id, req.body);

        res.json({
            success: true,
            message: 'Producto actualizado',
            data: product
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar producto'
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await softDeleteProduct(req.params.id);

        res.json({
            success: true,
            message: 'Producto eliminado',
            data: product
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar producto'
        });
    }
};