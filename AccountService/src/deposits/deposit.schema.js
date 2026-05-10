export const depositSchemas = {
  Deposit: {
    type: 'object',
    required: ['accountNumber', 'userId', 'amount', 'currency', 'amountInGTQ', 'depositMethod'],
    properties: {
      _id: {
        type: 'string',
        example: '664f1a2b3c4d5e6f7a8b9c0d',
      },
      accountNumber: {
        type: 'string',
        example: 'AH0000001',
      },
      userId: {
        type: 'string',
        example: 'usrabc123',
      },
      amount: {
        type: 'number',
        description: 'Monto del depósito en la moneda original, mínimo 1 y hasta 2 decimales',
        example: 20.0,
      },
      currency: {
        type: 'string',
        enum: ['GTQ', 'USD', 'EUR', 'MXN'],
        example: 'USD',
      },
      amountInGTQ: {
        type: 'number',
        description: 'Monto convertido a GTQ al momento del depósito',
        example: 155.0,
      },
      exchangeRate: {
        type: 'number',
        description: 'Tasa de cambio utilizada al momento del depósito',
        example: 7.75,
      },
      depositMethod: {
        type: 'string',
        enum: ['EFECTIVO', 'CHEQUE'],
        example: 'EFECTIVO',
      },
      description: {
        type: 'string',
        description: 'Descripción opcional del depósito, máximo 255 caracteres',
        example: 'Depósito en ventanilla central',
      },
      status: {
        type: 'string',
        enum: ['ACTIVE', 'REVERTED'],
        description: 'Estado actual del depósito',
        example: 'ACTIVE',
      },
      revertedAt: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        description: 'Fecha en que fue revertido el depósito, null si no ha sido revertido',
        example: null,
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-06-01T10:00:00.000Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2024-06-01T10:00:00.000Z',
      },
    },
  },
};
