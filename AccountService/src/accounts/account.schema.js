export const accountSchemas = {
  Account: {
    type: 'object',
    required: ['userId', 'accountNumber', 'accountType', 'balance'],
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
        example: 'AH00012345',
      },
      accountType: {
        type: 'string',
        enum: ['AHORRO', 'MONETARIA'],
        example: 'AHORRO',
      },
      balance: {
        type: 'string',
        description: 'Saldo de la cuenta con dos decimales',
        example: '1500.50',
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
              example: 'userId',
            },
            message: {
              type: 'string',
              example: 'El ID del usuario es requerido',
            },
          },
        },
      },
    },
  },
};
