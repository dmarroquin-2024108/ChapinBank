import { Schema, model } from "mongoose";


const movementSchema = new Schema({
    type: {
        type: String,
        required: [true, 'El tipo de movimiento es obligatorio'],
        enum: {
            values: ['DEPOSITO', 'TRANSFERENCIA', 'RETIRO', 'PAGO_SERVICIO'],
            message: 'Tipo de movimiento no permitido'
        }
    },
    amount: {
        type: Number,
        required: [true, 'El monto es obligatorio'],
        min: [0, 'El monto debe ser mayor o igual a 0']
    },
    description: {
        type: String,
        trim: true,
        maxLength: [200, 'La descripción no puede exceder 200 caracteres']
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false
});

const accountSchema = new Schema({
    accountNumber: {
        type: String,
        required: [true, 'El número de cuenta es obligatorio'],
        unique: [true, 'El número de cuenta ya existe'],
        trim: true
    },
    clientId: {
        type: Schema.Types.ObjectId,
        required: [true, 'El cliente es obligatorio']
    },
    balance: {
        type: Number,
        required: [true, 'El saldo es obligatorio'],
        min: [0, 'El saldo no puede ser negativo'],
        default: 0
    },
    movements: [movementSchema],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

// Índices para optimizar consultas
accountSchema.index({ clientId: 1 });
accountSchema.index({ isActive: 1 });

export default model('Account', accountSchema);
