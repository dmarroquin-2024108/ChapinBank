import { Schema, model } from "mongoose";

const historySchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: ['DEPOSIT', 'TRANSFER', 'TRANSACTION']
    },

    accountNumber: {
        type: String,
        required: true
    },

    userId: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    currency: {
        type: String,
        default: 'GTQ'
    },

    depositMethod: String,


    noOperacion: {
        type: String,
        unique: true
    },

    numberAccountOrigin: String,
    originHolder: String,
    numberAccountDestination: String,
    destinationHolder: String,
    commision: Number,

    status: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'FAILED'],
        default: 'COMPLETED'
    },

    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }, 
    
    description: String
}, {
    timestamps: true,
    versionKey: false
});

export default model('History', historySchema);
