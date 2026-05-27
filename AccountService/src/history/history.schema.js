export const historySchemas = {
  History: {
    type: 'object',
    required: ['type', 'accountNumber', 'userId', 'amount'],
    properties: {
      _id: {
        type: 'string',
        example: '664f1a2b3c4d5e6f7a8b9c0d',
      },

      type: {
        type: 'string',
        enum: ['DEPOSIT', 'DEPOSIT_REVERT', 'TRANSFER', 'TRANSACTION'],
        example: 'DEPOSIT',
      },

      accountNumber: {
        type: 'string',
        example: 'AH050505',
      },

      userId: {
        type: 'string',
        example: 'user_abc123',
      },

      amount: {
        type: 'number',
        format: 'float',
        example: 500.0,
      },

      currency: {
        type: 'string',
        default: 'GTQ',
        example: 'GTQ',
      },

      depositMethod: {
        type: 'string',
        nullable: true,
        example: 'EFECTIVO',
      },

      noOperacion: {
        type: 'string',
        nullable: true,
        example: '000000001',
      },

      numberAccountOrigin: {
        type: 'string',
        nullable: true,
        example: 'AH050505',
      },

      originHolder: {
        type: 'string',
        nullable: true,
        example: 'Juan Pérez',
      },

      numberAccountDestination: {
        type: 'string',
        nullable: true,
        example: 'MO123455',
      },

      destinationHolder: {
        type: 'string',
        nullable: true,
        example: 'María López',
      },

      commision: {
        type: 'number',
        nullable: true,
        example: 5.0,
      },

      status: {
        type: 'string',
        enum: ['PENDING', 'COMPLETED', 'FAILED'],
        default: 'COMPLETED',
        example: 'COMPLETED',
      },

      productId: {
        type: 'string',
        nullable: true,
        example: '664f1a2b3c4d5e6f7a8b9c0d',
      },

      description: {
        type: 'string',
        nullable: true,
        example: 'Depósito en efectivo en agencia central',
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

  CreateHistoryRequest: {
    type: 'object',
    required: ['type', 'accountNumber', 'userId', 'amount'],
    properties: {
      type: {
        type: 'string',
        enum: ['DEPOSIT', 'DEPOSIT_REVERT', 'TRANSFER', 'TRANSACTION'],
        example: 'DEPOSIT',
      },

      accountNumber: {
        type: 'string',
        example: 'MO3456788',
      },

      userId: {
        type: 'string',
        example: 'user_abc123',
      },

      amount: {
        type: 'number',
        format: 'float',
        example: 500.0,
      },

      currency: {
        type: 'string',
        default: 'GTQ',
        example: 'GTQ',
      },

      depositMethod: {
        type: 'string',
        example: 'EFECTIVO',
      },

      noOperacion: {
        type: 'string',
        example: 'OP-2024-000456',
      },

      numberAccountOrigin: {
        type: 'string',
        example: 'AH007845',
      },

      originHolder: {
        type: 'string',
        example: 'Juan Pérez',
      },

      numberAccountDestination: {
        type: 'string',
        example: 'MO3456788',
      },

      destinationHolder: {
        type: 'string',
        example: 'María López',
      },

      commision: {
        type: 'number',
        format: 'float',
        example: 5.0,
      },

      status: {
        type: 'string',
        enum: ['PENDING', 'COMPLETED', 'FAILED'],
        default: 'COMPLETED',
        example: 'COMPLETED',
      },

      productId: {
        type: 'string',
        example: '664f1a2b3c4d5e6f7a8b9c0d',
      },

      description: {
        type: 'string',
        example: 'Depósito en efectivo en agencia central',
      },
    },
  },

  HistoryResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true,
      },

      message: {
        type: 'string',
        example: 'Historial obtenido correctamente',
      },

      data: {
        $ref: '#/components/schemas/History',
      },
    },
  },

  HistoryListResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true,
      },

      message: {
        type: 'string',
        example: 'Historial de cuenta obtenido',
      },

      total: {
        type: 'number',
        example: 8,
      },

      data: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/History',
        },
      },
    },
  },

  AccountsByMovementsResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true,
      },

      message: {
        type: 'string',
        example: 'Cuentas ordenadas por movimientos',
      },

      total: {
        type: 'number',
        example: 10,
      },

      data: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            accountNumber: {
              type: 'string',
              example: 'MO3456788',
            },

            totalMovements: {
              type: 'number',
              example: 45,
            },
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
              example: 'accountNumber',
            },

            message: {
              type: 'string',
              example: 'El número de cuenta es requerido',
            },
          },
        },
      },
    },
  },
};