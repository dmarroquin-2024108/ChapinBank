import { Schema, model } from 'mongoose';

const transferSchema = new Schema({
    amount: {
        type: Number,
        required: [true, 'El monto de depósito es obligatorio.'],
        min: [1, 'El depósito debe de ser igual o mayor a 1'],
        set: (val) => parseFloat(val.toFixed(2))
    },

    currency: {
        type: String,
        required: [true, 'Debe de ingresar el tipo de moneda.'],
        enum: {
            values: ['GTQ'],
            message: 'Tipo de moneda no válido.'
        }
    },

    userId: {
        type: String,
        required: [true, 'El userId es obligatorio']
    },

    numberAccountOrigin: {
        type: String,
        required: [true, 'El número de cuenta de origen es obligatorio'],
        trim: true
    },

    originHolder: {
        type: String,
        required: [true, 'El titular de origen es obligatorio.'],
        trim: true
    },

    numberAccountDestination: {
        type: String,
        required: [true, 'El número de cuenta de destino es obligatorio'],
        trim: true
    },

    destinationHolder: {
        type: String,
        required: [true, 'El titular de origen es obligatorio.'],
        trim: true
    },

    description: {
        type: String,
        trim: true,
        maxLength: [255, 'La descripcion no puede exceder de 255 caracteres.']
    },

    commision: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        required: [true, 'El estado es obligatorio'],
        enum: {
            values: ['PENDIENTE', 'COMPLETADO', 'CANCELADO'],
            message: 'Estado no válido.',
        },
        default: 'PENDIENTE'
    },

    noOperacion: {
        type: Number,
        required: [true, 'El número de operación es obligatorio.'],
        min: [1, 'El número mínimo de operacion es 1.'],
        unique: [true, 'El número de operación es único.']
    },

    transferToken: {
        type: String
    },

    acceptedAt: {
        type: Date,
        default: null
    },

    canceledAt:{
        type:Date,
        default: null
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);//depositSchema

export default model('Transfer', transferSchema);