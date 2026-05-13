import Product from './products.model.js';
import { cloudinary } from '../../configs/cloudinary.configuration.js';

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
  return await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
};

//Cloudinary
export const uploadProductImage = async (id, file) => {
  const product = await Product.findById(id);
  if (!product) return null;

  // Eliminar imagen anterior de Cloudinary si existe
  if (product.imagePublicId) {
    await cloudinary.uploader.destroy(product.imagePublicId);
  }

  return await Product.findByIdAndUpdate(
    id,
    {
      imageUrl: file.path,
      imagePublicId: file.filename,
    },
    { new: true }
  );
};
