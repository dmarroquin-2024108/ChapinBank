export const accountSchemas = {
  Account: {
    type: 'object',
    required: [
      'userId',
      'accountNumber',
      'accountType',
      'balance',
      'isActive',
    ],
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
        type: 'number',
        format: 'float',
        description: 'Saldo actual de la cuenta',
        example: 1500.5,
      },

      isActive: {
        type: 'boolean',
        example: true,
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

  AccountSummary: {
    type: 'object',
    properties: {
      total: {
        type: 'number',
        example: 7,
      },

      active: {
        type: 'number',
        example: 5,
      },

      disabled: {
        type: 'number',
        example: 2,
      },

      totalBalance: {
        type: 'number',
        format: 'float',
        example: 295082.6,
      },
    },
  },

  ToggleAccountStatusResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true,
      },

      message: {
        type: 'string',
        example: 'Estado de la cuenta actualizado correctamente',
      },

      data: {
        type: 'object',
        properties: {
          accountNumber: {
            type: 'string',
            example: 'AH0000001',
          },

          isActive: {
            type: 'boolean',
            example: false,
          },
        },
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