export const transactionSchemas = {
  Pricing: {
    type: 'object',

    required: ['basePrice', 'ivaRate', 'totalAmount'],

    properties: {
      basePrice: {
        type: 'number',
        format: 'float',
        example: 299.99,
      },

      ivaRate: {
        type: 'number',
        format: 'float',
        description: 'Tasa de IVA aplicada (ej. 0.12 equivale al 12%)',
        example: 0.12,
      },

      totalAmount: {
        type: 'number',
        format: 'float',
        example: 335.99,
      },
    },
  },

  Transaction: {
    type: 'object',

    required: [
      'userId',
      'productId',
      'amount',
      'status',
    ],

    properties: {
      _id: {
        type: 'string',
        example: '664a1f2e8b3c4d0012345678',
      },

      userId: {
        type: 'string',
        example: 'user_abc123',
      },

      productId: {
        type: 'string',
        description: 'ID del producto adquirido (ObjectId)',
        example: '664a1f2e8b3c4d0098765432',
      },

      amount: {
        type: 'number',
        format: 'float',
        example: 335.99,
      },

      status: {
        type: 'string',
        enum: ['PENDING', 'COMPLETED', 'FAILED'],
        example: 'COMPLETED',
      },

      reference: {
        type: 'string',
        nullable: true,
        example: 'Cuenta: 123456789 | IVA(12%)',
      },

      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-06-01T00:00:00.000Z',
      },

      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-06-01T00:00:00.000Z',
      },
    },
  },

  TransactionInput: {
    type: 'object',

    required: ['productId', 'accountNumber'],

    properties: {
      productId: {
        type: 'string',
        example: '664a1f2e8b3c4d0098765432',
      },

      accountNumber: {
        type: 'string',
        example: 'AH0000001',
      },
    },
  },

  TransactionWithPricing: {
    allOf: [
      {
        $ref: '#/components/schemas/Transaction',
      },
      {
        type: 'object',

        properties: {
          pricing: {
            $ref: '#/components/schemas/Pricing',
          },
        },
      },
    ],
  },

  TransactionPopulated: {
    allOf: [
      {
        $ref: '#/components/schemas/Transaction',
      },
      {
        type: 'object',

        properties: {
          productId: {
            $ref: '#/components/schemas/Product',
          },
        },
      },
    ],
  },

  TransactionResponse: {
    type: 'object',

    properties: {
      success: {
        type: 'boolean',
        example: true,
      },

      message: {
        type: 'string',
        example: 'Transacción realizada correctamente',
      },

      data: {
        $ref: '#/components/schemas/TransactionWithPricing',
      },
    },
  },

  TransactionListResponse: {
    type: 'object',

    properties: {
      success: {
        type: 'boolean',
        example: true,
      },

      total: {
        type: 'number',
        example: 5,
      },

      data: {
        type: 'array',

        items: {
          $ref: '#/components/schemas/TransactionPopulated',
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
              example: 'productId',
            },

            message: {
              type: 'string',
              example: 'El producto es obligatorio',
            },
          },
        },
      },
    },
  },
};