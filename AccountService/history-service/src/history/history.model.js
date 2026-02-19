import { Schema, model } from "mongoose";

const historySchema = new Schema({
    accountId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    amount: Number,
    currency: String,
    depositMethod: String,
    description: String
},{
    timestamps:true,
    versionKey:false
});

export default model('Deposit', historySchema);
