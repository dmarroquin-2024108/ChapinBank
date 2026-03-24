import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
    {
        userId: {
            type: String,
            required: [true, 'El id de usuario es obligatorio'],
            index: true
        },

        accountNumber: {
            type: String,
            default: null
        },

        title: {
            type: String,
            required: [true, 'El título es obligatorio'],
            trim: true,
            maxLength: [100, 'El título no puede exceder 100 caracteres']
        },

        message: {
            type: String,
            required: [true, 'El mensaje es obligatorio'],
            trim: true,
            maxLength: [300, 'El mensaje no puede exceder 300 caracteres']
        },

        type: {
            type: String,
            required: true,
            enum: {
                values: ['DEPÓSITO', 'TRANSFERENCIA_ENVIADA', 'TRANSFERENCIA_RECIBIDA', 'ALERTA'],
                message: 'Tipo de notificación no válido'
            }
        },

        severity: {
            type: String,
            required: true,
            enum: {
                values: ['INFO', 'ADVERTENCIA', 'CRÍTICO'],
                message: 'Severidad no válida'
            },
            default: 'INFO'
        },

        // ai el usuario ya la vio
        read: {
            type: Boolean,
            default: false
        },

        // datos extra del evento
        metadata: {
            type: Schema.Types.Mixed,
            default: {}
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('Notification', notificationSchema);