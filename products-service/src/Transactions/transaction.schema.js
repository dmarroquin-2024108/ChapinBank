export const transactionSchemas = {
    Pricing: {
        type: "object",
        properties: {
            basePrice: {
                type: "number",
                example: 299.99
            },
            ivaRate: {
                type: "number",
                description: "Tasa de IVA aplicada (ej. 0.12 equivale al 12%)",
                example: 0.12
            },
            totalAmount: {
                type: "number",
                example: 335.99
            }
        }
    },

    Transaction: {
        type: "object",
        properties: {
            _id: {
                type: "string",
                example: "664a1f2e8b3c4d0012345678"
            },
            userId: {
                type: "string",
                example: "user_abc123"
            },
            productId: {
                type: "string",
                description: "ID del producto adquirido (ObjectId)",
                example: "664a1f2e8b3c4d0098765432"
            },
            amount: {
                type: "number",
                example: 335.99
            },
            status: {
                type: "string",
                enum: ["PENDING", "COMPLETED", "FAILED"],
                example: "COMPLETED"
            },
            reference: {
                type: "string",
                example: "Cuenta: 123456789 | IVA(12%)"
            },
            createdAt: {
                type: "string",
                format: "date-time",
                example: "2025-06-01T00:00:00.000Z"
            },
            updatedAt: {
                type: "string",
                format: "date-time",
                example: "2025-06-01T00:00:00.000Z"
            }
        }
    },

    TransactionWithPricing: {
        allOf: [
            { $ref: '#/components/schemas/Transaction' },
            {
                type: "object",
                properties: {
                    pricing: {
                        $ref: '#/components/schemas/Pricing'
                    }
                }
            }
        ]
    },

    TransactionPopulated: {
        allOf: [
            { $ref: '#/components/schemas/Transaction' },
            {
                type: "object",
                properties: {
                    productId: {
                        $ref: '#/components/schemas/Product'
                    }
                }
            }
        ]
    }
};