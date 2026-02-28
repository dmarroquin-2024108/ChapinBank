'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsOptions } from './cors.configuration.js';
import { helmetOptions } from './helmet.configuration.js';
import { dbConnection } from './db.configuration.js';
import { requestLimit } from './rateLimit.configuration.js';
import { errorHandler } from '../middlewares/handle-errors.js';
import productRoutes from '../src/Products/products.route.js'
import transactionRoutes from '../src/Transactions/transaction.route.js';

const BASE_PATH = '/chapinbank/v1';

const routes = (app) => {
    app.use(`${BASE_PATH}/products`, productRoutes);
    app.use(`${BASE_PATH}/transactions`, transactionRoutes);

    app.get(`${BASE_PATH}/health`, (req, res) => {
        res.status(200).json({
            status: 'Healthy',
            timeStamp: new Date().toISOString(),
            service: 'Chapin Bank Products Service'
        });
    });

    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: 'Endpoint no encontrado'
        });
    });
};

const middlewares = (app) => {
    app.use(cors(corsOptions));
    app.use(helmet(helmetOptions));
    app.use(morgan('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(requestLimit);
};

export const initServer = async () => {
    const app = express();
    const PORT = process.env.PORT;
    app.set('trust proxy', 1);

    try {
        middlewares(app);
        await dbConnection();
        routes(app);
        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(`ChapinBank - Products Server running on port ${PORT}`);
            console.log(`Health: http://localhost:${PORT}${BASE_PATH}/health`);
        });

    } catch (err) {
        console.error(`Error al iniciar servidor: ${err.message}`);
        process.exit(1);
    }
};