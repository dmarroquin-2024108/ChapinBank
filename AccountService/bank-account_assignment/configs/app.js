'use strict';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import { dbConnection } from './db.configuration.js';
import * as userController from '../src/fields/field.controller.js';
import { registerValidation } from '../middlewares/file-validator.js';
import { errorHandler } from '../middlewares/handle-error.js';


dotenv.config();

const BASE_PATH = '/bank/v1';

const routes = (app) => {
    app.post(
        `${BASE_PATH}/register`,
        registerValidation,
        userController.UserRegister
    );

    app.get(`${BASE_PATH}/users`, userController.getUsers);
    app.get(`${BASE_PATH}/users/:id`, userController.getUserById);
    app.put(`${BASE_PATH}/users/:id`, userController.updateUser);
    app.delete(`${BASE_PATH}/users/:id`, userController.deleteUser);

    app.get(`${BASE_PATH}/health`, (req, res) => {
        res.status(200).json({
            status: 'Healthy',
            timeStamp: new Date().toISOString(),
            service: 'Bank API - Inheritance System'
        });
    });

    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: 'Endpoint not found'
        });
    });
};

const corsMiddleware = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
};

const securityHeaders = (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
};

const requestCounts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 100;

const rateLimitMiddleware = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - WINDOW_MS;
    if (!requestCounts.has(ip)) requestCounts.set(ip, []);
    const requests = requestCounts.get(ip).filter(t => t > windowStart);
    requests.push(now);
    requestCounts.set(ip, requests);
    if (requests.length > MAX_REQUESTS) {
        console.log(`Peticiones excedidas desde IP: ${ip}, Endpoint: ${req.path}`);
        return res.status(429).json({
            success: false,
            message: 'Demasiadas solicitudes desde esta IP, por favor intente nuevamente después de 15 minutos.',
            error: 'RATE_LIMIT_EXCEEDED'
        });
    }
    next();
};

const middlewares = (app) => {
    app.use(corsMiddleware);
    app.use(securityHeaders);
    app.use(morgan('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(rateLimitMiddleware);
};

export const initServer = async () => {
    const app = express();
    const PORT = process.env.PORT || 3005;
    app.set('trust proxy', 1);
    try {
        middlewares(app);
        await dbConnection();
        routes(app);
        app.use(errorHandler);
        app.listen(PORT, () => {
            console.log(`Server Chapin Bank running on port ${PORT}`);
            console.log(`Health check endpoint: http://localhost:${PORT}${BASE_PATH}/health`);
        });
    } catch (err) {
        console.error(`Chapin Bank - Error al iniciar el servidor: ${err.message}`);
        process.exit(1);
    }
};