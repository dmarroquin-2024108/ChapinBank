export const notificationSchemas = {
  Notification: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        example: '664a1f2e8b3c4d0012345678',
      },
      userId: {
        type: 'string',
        example: 'usr123456',
      },
      accountNumber: {
        type: 'string',
        example: 'AH00012345',
        nullable: true,
      },
      title: {
        type: 'string',
        example: 'Depósito recibido',
      },
      message: {
        type: 'string',
        example: 'Se ha acreditado un depósito de Q500.00 a tu cuenta',
      },
      type: {
        type: 'string',
        enum: ['DEPÓSITO', 'TRANSFERENCIA_ENVIADA', 'TRANSFERENCIA_RECIBIDA', 'ALERTA'],
        example: 'DEPÓSITO',
      },
      severity: {
        type: 'string',
        enum: ['INFO', 'ADVERTENCIA', 'CRÍTICO'],
        example: 'INFO',
      },
      read: {
        type: 'boolean',
        example: false,
      },
      metadata: {
        type: 'object',
        additionalProperties: true,
        example: {
          amount: 500,
          currency: 'GTQ',
        },
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-06-01T00:00:00.000Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-06-10T00:00:00.000Z',
      },
    },
  },
};
