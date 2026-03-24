import { Schema, model} from "mongoose";

//Saldo fijo al iniciar una cuenta
const DEFAULT_BALANCES = {
    AHORRO: 20.00,
    MONETARIA: 30.00
}

//Dependiendo la cuenta que escoja se asigna un prefijo de identificación
export const ACCOUNT_PREFIJOS = {
    AHORRO: 'AH',
    MONETARIA: 'MO'
}

export{DEFAULT_BALANCES};

const accountSchema = new Schema({
    userId:{
        type: String,
        required: [true, 'El userId es requerido.'],
        index: true,
    },

    accountNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    accountType:{
        type: String,
        required:[true,'El tipo de cuenta es requerido.'],
        enum:{
            values: ['AHORRO', 'MONETARIA'],
            message : 'Tipo de cuenta no válido debe ser : AHORRO O MONETARIA',
        },
    },

    balance:{
        type: Number,
        required: true,
        min: [0, 'El saldo no puede ser negativo'],
        toJSON: { virtuals: true },
        default: 0,
        set: (val) => parseFloat(val.toFixed(2))
    }
},
{
    timestamps: true,
    versionKey: false,
}
);

accountSchema.index({userId:1, accountType: 1}, {unique: true});
export default model('Account', accountSchema);