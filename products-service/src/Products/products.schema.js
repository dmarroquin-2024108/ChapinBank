export const productSchemas = {
  Product: {
    type: 'object',

    required: [
      'name',
      'description',
      'type',
      'price',
      'isActive',
    ],

    properties: {
      _id: {
        type: 'string',
        example: '664a1f2e8b3c4d0012345678',
      },

      name: {
        type: 'string',
        example: 'Seguro de vida premium',
      },

      description: {
        type: 'string',
        example: 'Cobertura completa para ti y tu familia',
      },

      type: {
        type: 'string',
        enum: ['SEGURO', 'VIAJE', 'SUSCRIPCION'],
        example: 'SEGURO',
      },

      price: {
        type: 'number',
        format: 'float',
        minimum: 0,
        example: 299.99,
      },

      image: {
        type: 'string',
        nullable: true,
        example: 'https://res.cloudinary.com/demo/image/upload/product.jpg',
      },

      isActive: {
        type: 'boolean',
        example: true,
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

  ProductInput: {
    type: 'object',

    required: ['name', 'description', 'type', 'price'],

    properties: {
      name: {
        type: 'string',
        maxLength: 100,
        example: 'Seguro de vida premium',
      },

      description: {
        type: 'string',
        maxLength: 255,
        example: 'Cobertura completa para ti ytu familia',
      },

      type: {
        type: 'string',
        enum: ['SEGURO', 'VIAJE', 'SUSCRIPCION'],
        example: 'SEGURO',
      },

      price: {
        type: 'number',
        format: 'float',
        minimum: 0,
        example: 299.99,
      },
    },
  },

  ProductResponse: {
    type: 'object',

    properties: {
      success: {
        type: 'boolean',
        example: true,
      },

      message: {
        type: 'string',
        example: 'Producto obtenido correctamente',
      },

      data: {
        $ref: '#/components/schemas/Product',
      },
    },
  },

  ProductListResponse: {
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
          $ref: '#/components/schemas/Product',
        },
      },
    },
  },

  UploadImageResponse: {
    type: 'object',

    properties: {
      success: {
        type: 'boolean',
        example: true,
      },

      message: {
        type: 'string',
        example: 'Imagen subida correctamente',
      },

      data: {
        $ref: '#/components/schemas/Product',
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
              example: 'name',
            },

            message: {
              type: 'string',
              example: 'El nombre es obligatorio',
            },
          },
        },
      },
    },
  },
};