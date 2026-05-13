import { Schema, model } from 'mongoose';

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      maxLength: [100, 'Máximo 100 caracteres'],
    },

    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
      maxLength: [255, 'Máximo 255 caracteres'],
    },

    type: {
      type: String,
      required: true,
      enum: ['SEGURO', 'VIAJE', 'SUSCRIPCION'],
    },

    price: {
      type: Number,
      required: true,
      min: [0, 'El precio no puede ser negativo'],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    imageUrl: {
      type: String,
      default: null,
    },

    imagePublicId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model('Product', productSchema);
