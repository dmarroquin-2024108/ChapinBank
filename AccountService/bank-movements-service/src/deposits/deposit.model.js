import { Schema, model} from "mongoose";

const depositSchema = new Schema({
    amount:{
        type: Number,
        required: [true, 'El monto de depósito es obligatorio.'],
        min: [1, 'El depósito debe de ser igual o mayor a 1']
    },

    currency:{
        type: String,
        required: [true, 'Debe de ingresar el tipo de moneda.'],
        enum: {
            values: ['GTQ', 'USD'],
            message: 'Tipo de moneda no válido.'
        }
    },

    depositMethod: {
        type: String,
        required: [true, 'El método de deposito es obligatorio.'],
        enum:{
            values: ['EFECTIVO', 'TRANSFERENCIA', 'CHEQUE'],
            message : 'Método no válido'
        }
    },

    description:{
        type: String,
        trim: true,
        maxLength: [255, 'La descripcion no puede exceder de 255 caracteres.'],
    }
},
    {
        timestamps: true,
        versionKey: false,
    }
);//depositSchema

export default model('Deposit', depositSchema);