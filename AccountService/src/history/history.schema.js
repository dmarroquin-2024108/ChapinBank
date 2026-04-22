export const historySchemas = {
    History: {
        type: "object",
        required: [
            "type",
            "accountNumber",
            "userId",
            "amount"
        ],
        properties: {
            _id: {
                type: "string",
                example: "664f1a2b3c4d5e6f7a8b9c0d"
            },
            type: {
                type: "string",
                enum: ["DEPOSIT", "DEPOSIT_UPDATE", "DEPOSIT_REVERT", "TRANSFER", "TRANSACTION"],
                example: "DEPOSIT"
            },
            accountNumber: {
                type: "string",
                example: "AH050505"
            },
            userId: {
                type: "string",
                example: "user_abc123"
            },
            amount: {
                type: "number",
                example: 500.00
            },
            currency: {
                type: "string",
                default: "GTQ",
                example: "GTQ"
            },
            depositMethod: {
                type: "string",
                nullable: true,
                example: "EFECTIVO"
            },
            noOperacion: {
                type: "string",
                nullable: true,
                example: "000000001"
            },
            numberAccountOrigin: {
                type: "string",
                nullable: true,
                example: "AH050505"
            },
            originHolder: {
                type: "string",
                nullable: true,
                example: "Juan Pérez"
            },
            numberAccountDestination: {
                type: "string",
                nullable: true,
                example: "MO123455"
            },
            destinationHolder: {
                type: "string",
                nullable: true,
                example: "María López"
            },
            commision: {
                type: "number",
                nullable: true,
                example: 5.00
            },
            status: {
                type: "string",
                enum: ["PENDING", "COMPLETED", "FAILED"],
                default: "COMPLETED",
                example: "COMPLETED"
            },
            productId: {
                type: "string",
                nullable: true,
                example: "664f1a2b3c4d5e6f7a8b9c0d"
            },
            description: {
                type: "string",
                nullable: true,
                example: "Depósito en efectivo en agencia central"
            },
            createdAt: {
                type: "string",
                format: "date-time",
                example: "2024-06-01T10:00:00.000Z"
            },
            updatedAt: {
                type: "string",
                format: "date-time",
                example: "2024-06-10T15:30:00.000Z"
            }
        }
    },

    ErrorResponse: {
        type: "object",
        properties: {
            success: {
                type: "boolean",
                example: false
            },
            message: {
                type: "string",
                example: "Error en la solicitud"
            },
            errors: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        field: {
                            type: "string",
                            example: "accountNumber"
                        },
                        message: {
                            type: "string",
                            example: "El número de cuenta es requerido"
                        }
                    }
                }
            }
        }
    }
};