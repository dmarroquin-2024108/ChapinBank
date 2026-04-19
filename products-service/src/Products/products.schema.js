export const productSchemas = {
    Product: {
        type: "object",
        properties: {
            _id: {
                type: "string",
                example: "664a1f2e8b3c4d0012345678"
            },
            name: {
                type: "string",
                example: "Seguro de vida premium"
            },
            description: {
                type: "string",
                example: "Cobertura completa para ti y tu familia"
            },
            type: {
                type: "string",
                enum: ["SEGURO", "VIAJE", "SUSCRIPCION"],
                example: "SEGURO"
            },
            price: {
                type: "number",
                example: 299.99
            },
            isActive: {
                type: "boolean",
                example: true
            },
            createdAt: {
                type: "string",
                format: "date-time",
                example: "2025-06-01T00:00:00.000Z"
            },
            updatedAt: {
                type: "string",
                format: "date-time",
                example: "2025-06-10T00:00:00.000Z"
            }
        }
    },

    ProductInput: {
        type: "object",
        required: ["name", "description", "type", "price"],
        properties: {
            name: {
                type: "string",
                maxLength: 100,
                example: "Seguro de vida premium"
            },
            description: {
                type: "string",
                maxLength: 255,
                example: "Cobertura completa para ti y tu familia"
            },
            type: {
                type: "string",
                enum: ["SEGURO", "VIAJE", "SUSCRIPCION"],
                example: "SEGURO"
            },
            price: {
                type: "number",
                minimum: 0,
                example: 299.99
            }
        }
    }
};