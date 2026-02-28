import { Schema, model} from "mongoose";

const depositSchema = new Schema({
    accountNumber:{
        type: String,
        required: [true, 'El número de cuenta es obligatorio'],
    },

    userId:{
        type: String,
        required: [true, 'El userId es obligatorio']
    },

    amount:{
        type: Number,
        required: [true, 'El monto de depósito es obligatorio.'],
        min: [1, 'El depósito debe de ser igual o mayor a 1'],
        set: (val) => parseFloat(val.toFixed(2))
    },

    currency:{
        type: String,
        required: [true, 'Debe de ingresar el tipo de moneda.'],
        enum: {
            values: ['GTQ'],
            message: 'Tipo de moneda no válido.'
        }
    },

    depositMethod: {
        type: String,
        required: [true, 'El método de deposito es obligatorio.'],
        enum:{
            values: ['EFECTIVO','CHEQUE'],
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