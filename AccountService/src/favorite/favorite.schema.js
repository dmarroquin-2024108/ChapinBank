export const favoriteSchemas = {
    Favorite: {
        type: 'object',
        required: ['userId', 'accountNumber', 'accountType', 'alias'],
        properties: {
            _id: {
                type: 'string',
                example: '664f1a2b3c4d5e6f7a8b9c0d',
            },

            userId: {
                type: 'string',
                example: 'usrabc123',
            },

            accountNumber: {
                type: 'string',
                example: 'AH0000002',
            },

            accountType: {
                type: 'string',
                enum: ['AHORRO', 'MONETARIA'],
                example: 'AHORRO',
            },

            alias: {
                type: 'string',
                maxLength: 50,
                example: 'María - Ahorro',
            },

            createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-06-01T10:00:00.000Z',
            },

            updatedAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-06-10T15:30:00.000Z',
            },
        },
    },

    CreateFavoriteRequest: {
        type: 'object',
        required: ['accountNumber', 'alias'],
        properties: {
            accountNumber: {
                type: 'string',
                example: 'AH0000002',
            },

            alias: {
                type: 'string',
                example: 'María - Ahorro',
            },
        },
    },

    UpdateFavoriteRequest: {
        type: 'object',
        required: ['alias'],
        properties: {
            alias: {
                type: 'string',
                maxLength: 50,
                example: 'María trabajo',
            },
        },
    },

    FavoriteResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },

            message: {
                type: 'string',
                example: 'Cuenta agregada a favoritos',
            },

            data: {
                $ref: '#/components/schemas/Favorite',
            },
        },
    },

    FavoritesListResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },

            total: {
                type: 'number',
                example: 2,
            },

            data: {
                type: 'array',
                items: {
                    $ref: '#/components/schemas/Favorite',
                },
            },
        },
    },

    DeleteFavoriteResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: true,
            },

            message: {
                type: 'string',
                example: 'Favorito eliminado correctamente',
            },
        },
    },

    ErrorResponse: {
        type: 'object',
        properties: {
            success: {
                type: 'boolean',
                example: false,
            },

            message: {
                type: 'string',
                example: 'Error en la solicitud',
            },

            errors: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        field: {
                            type: 'string',
                            example: 'alias',
                        },

                        message: {
                            type: 'string',
                            example: 'El alias es obligatorio',
                        },
                    },
                },
            },
        },
    },
};