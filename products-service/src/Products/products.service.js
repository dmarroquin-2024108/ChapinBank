import Product from './products.model.js';



export const createProductRecord = async ({ productData }) => {
    const product = new Product(productData);
    await product.save();
    return product;
};

export const getProducts = async () => {
    return await Product.find({ isActive: true });
};

export const getProductById = async (id) => {
    return await Product.findOne({ _id: id, isActive: true });
};

export const updateProductRecord = async (id, data) => {
    return await Product.findByIdAndUpdate(id, data, { new: true });
};

export const softDeleteProduct = async (id) => {
    return await Product.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
    );
};