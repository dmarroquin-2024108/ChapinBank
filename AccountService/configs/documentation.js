import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { accountSchemas } from '../src/accounts/account.schema.js';
import {notificationSchemas} from '../src/notifications/notification.schema.js';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Chapin Bank Documentation API',
            version: '1.0.0',
            description: 'Documentación de la API de banco ChapinBank'
        },
        components: {
            schemas:{
                ...accountSchemas,
                ...notificationSchemas
            },
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        servers: [
            {
                url: 'http://localhost:3010',
                description: 'Servidor local'
            }
        ]
    },
    apis: ['./src/**/*.routes.js',
        './src/**/*.route.js'
    ]
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerSpec, swaggerUi };