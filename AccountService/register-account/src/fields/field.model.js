const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    lastname: { 
        type: String, 
        required: true 
    },
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true,
        select: false 
    },
    role: { 
        type: String, 
        enum: ['admin_system', 'admin_bank', 'client'], 
        default: 'client' 
    },
    cui:{
        type: Number,
        required: true,
        select: true
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('UserBank', UserSchema, 'users_bank');