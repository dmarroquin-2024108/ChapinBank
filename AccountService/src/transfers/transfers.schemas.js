export const transferSchemas = {
  Transfer: {
    type: 'object',
    required: [
      'amount',
      'currency',
      'amountInGTQ',
      'userId',
      'numberAccountOrigin',
      'originHolder',
      'numberAccountDestination',
      'destinationHolder',
      'status',
      'noOperacion',
    ],
    properties: {
      _id: {
        type: 'string',
        example: '664f1a2b3c4d5e6f7a8b9c0d',
      },
      amount: {
        type: 'number',
        example: 150.0,
      },
      currency: {
        type: 'string',
        enum: ['GTQ', 'USD', 'EUR', 'MXN'],
        example: 'GTQ',
      },
      amountInGTQ: {
        type: 'number',
        example: 150.0,
      },
      exchangeRate: {
        type: 'number',
        example: 1,
      },
      userId: {
        type: 'string',
        example: 'user_abc123',
      },
      numberAccountOrigin: {
        type: 'string',
        example: 'MO0000001',
      },
      originHolder: {
        type: 'string',
        example: 'Juan Pérez',
      },
      numberAccountDestination: {
        type: 'string',
        example: 'AH0000002',
      },
      destinationHolder: {
        type: 'string',
        example: 'María García',
      },
      description: {
        type: 'string',
        nullable: true,
        example: 'Pago de servicios',
      },
      commision: {
        type: 'number',
        example: 3.0,
      },
      status: {
        type: 'string',
        enum: ['PENDIENTE', 'COMPLETADO', 'CANCELADO'],
        example: 'PENDIENTE',
      },
      noOperacion: {
        type: 'number',
        example: 123456789,
      },
      transferToken: {
        type: 'string',
        nullable: true,
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
      acceptedAt: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2024-06-01T10:00:00.000Z',
      },
      canceledAt: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2024-06-01T10:30:00.000Z',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-06-01T09:50:00.000Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-06-01T10:00:00.000Z',
      },
    },
  },
};
