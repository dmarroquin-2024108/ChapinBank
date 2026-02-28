import { Schema, model } from "mongoose";

const transactionSchema = new Schema({

    userId: {
        type: String,
        required: [true, 'El ID del usuario es obligatorio'],
        trim: true
    },

    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'El ID del producto es obligatorio']
    },

    amount: {
        type: Number,
        required: [true, 'El monto es obligatorio'],
        min: [0, 'El monto no puede ser negativo']
    },

    status: {
        type: String,
        enum: {
            values: ['PENDING', 'COMPLETED', 'FAILED'],
            message: 'Estado inválido'
        },
        default: 'COMPLETED'
    },

    reference: {
        type: String,
        trim: true
    }

},
{
    timestamps: true,
    versionKey: false
});

export default model('Transaction', transactionSchema);