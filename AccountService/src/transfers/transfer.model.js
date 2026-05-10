import { Schema, model } from 'mongoose';

const transferSchema = new Schema(
  {
    amount: {
      type: Number,
      required: [true, 'El monto de la transferencia es obligatorio.'],
      min: [10, 'El monto de la transferencia debe de ser igual o mayor a Q.10.00'],
      max: [2000, 'El monto no puede exceder Q2,000.00 por transferencia.'],
      set: (val) => parseFloat(val.toFixed(2)),
    },

    currency: {
      type: String,
      required: [true, 'Debe de ingresar el tipo de moneda.'],
      enum: {
        values: ['GTQ', 'USD', 'EUR', 'MXN'],
        message: 'Tipo de moneda no válido. Use: GTQ, USD, EUR ó MXN',
      },
      default: 'GTQ',
    },

    amountInGTQ: {
      type: Number,
      required: true,
      set: (val) => parseFloat(val.toFixed(2)),
    },

    exchangeRate: {
      type: Number,
      default: 1,
    },

    userId: {
      type: String,
      required: [true, 'El userId es obligatorio'],
    },

    numberAccountOrigin: {
      type: String,
      required: [true, 'El número de cuenta de origen es obligatorio'],
      trim: true,
    },

    originHolder: {
      type: String,
      required: [true, 'El titular de origen es obligatorio.'],
      trim: true,
    },

    numberAccountDestination: {
      type: String,
      required: [true, 'El número de cuenta de destino es obligatorio'],
      trim: true,
    },

    destinationHolder: {
      type: String,
      required: [true, 'El titular de origen es obligatorio.'],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxLength: [255, 'La descripcion no puede exceder de 255 caracteres.'],
    },

    commision: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      required: [true, 'El estado es obligatorio'],
      enum: {
        values: ['PENDIENTE', 'COMPLETADO', 'CANCELADO'],
        message: 'Estado no válido.',
      },
      default: 'PENDIENTE',
    },

    noOperacion: {
      type: Number,
      required: [true, 'El número de operación es obligatorio.'],
      min: [1, 'El número mínimo de operacion es 1.'],
      unique: [true, 'El número de operación es único.'],
    },

    transferToken: {
      type: String,
    },

    acceptedAt: {
      type: Date,
      default: null,
    },

    canceledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
); //depositSchema

export default model('Transfer', transferSchema);
