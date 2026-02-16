'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import{ corsOptions} from './cors.configuration.js';
import { helmetOptions } from './helmet.configuration.js';
import { dbConnection } from './db.configuration.js';
import { requestLimit } from './rateLimit.configuration.js';
import { errorHandler } from '../middlewares/handle-errors.js';
import historyRoutes from '../src/history/history.routes.js';


const BASE_PATH = '/chapinbank/v1';

const routes = (app) =>{
    app.use(`${BASE_PATH}/history`, historyRoutes);
    app.get(`${BASE_PATH}/health`, (req, res)=>{
        res.status(200).json({
            status: 'Healthy',
            timesStamp: new Date().toISOString(),
            service: 'Chapin Bank - History and State service'
        });//healthy
    })//app get

    app.use((req, res)=>{
        res.status(404).json({
            success: false,
            message: 'Endpoint no encontrado'
        });
    })
}//routes

const middlewares = (app)=>{
    app.use(cors(corsOptions));
    app.use(helmet(helmetOptions));
    app.use(morgan('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(requestLimit)
}//middlewares

export const initServer = async ()=>{
    const app = express();
    const PORT = process.env.PORT;
    app.set('trust proxy', 1)
    try{
        middlewares(app);
        await dbConnection();
        routes(app);
        app.use(errorHandler);
        app.listen(PORT, ()=>{
            console.log(`Server Chapin Bank running on port ${PORT}`);
            console.log(`Health check endpoint: http://localhost:${PORT}${BASE_PATH}/health`);

        });
    }catch(err){
        console.error(`Chapin Bank - Error al inciar el servidor: ${err.message}`);
        process.exit(1);
    }//conectarse al servidor
}//initServer