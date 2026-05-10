import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { productSchemas } from '../src/Products/products.schema.js';
import { transactionSchemas } from '../src/Transactions/transaction.schema.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ChapinBank — Products Service',
      version: '1.0.0',
      description: 'Documentación del servicio de productos bancarios de ChapinBank',
    },
    servers: [
      {
        url: 'http://localhost:3015/chapinbank/v1',
        description: 'Servidor local',
      },
    ],
    components: {
      schemas: {
        ...productSchemas,
        ...transactionSchemas,
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      {
        name: 'Products',
        description: 'Gestión de productos bancarios (seguros, viajes y suscripciones)',
      },
      {
        name: 'Transactions',
        description: 'Compra de productos y consulta del historial de transacciones',
      },
    ],
  },
  apis: ['./src/Products/products.route.js', './src/Transactions/transaction.route.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerSpec, swaggerUi };
