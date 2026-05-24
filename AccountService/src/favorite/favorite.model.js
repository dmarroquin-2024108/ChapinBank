import { Schema, model } from 'mongoose';

const favoriteSchema = new Schema(
  {
    userId: {
      type: String,
      required: [true, 'El userId es obligatorio'],
      index: true,
    },

    accountNumber: {
      type: String,
      required: [true, 'El número de cuenta es obligatorio'],
      trim: true,
    },

    accountType: {
      type: String,
      required: [true, 'El tipo de cuenta es obligatorio'],
      enum: {
        values: ['AHORRO', 'MONETARIA'],
        message: 'Tipo de cuenta no válido. Use: AHORRO o MONETARIA',
      },
    },

    alias: {
      type: String,
      required: [true, 'El alias es obligatorio'],
      trim: true,
      maxlength: [50, 'El alias no puede exceder 50 caracteres'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

favoriteSchema.index({ userId: 1, accountNumber: 1 }, { unique: true });
favoriteSchema.index({ userId: 1, alias: 1 }, { unique: true });

export default model('Favorite', favoriteSchema);
