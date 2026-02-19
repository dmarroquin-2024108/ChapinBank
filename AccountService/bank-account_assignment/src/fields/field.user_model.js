import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    principal_account: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    }
});

export default model('User', UserSchema);
