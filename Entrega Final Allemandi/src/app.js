import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';

const app = express();
const PORT = process.env.PORT||8080;

const swaggerOpts = {
    definition:{
        openapi:'3.0.1',
        info:{
            title:'AdoptMe API test',
            description:'Documentación de usuarios'
        }
    },
    apis:['./src/docs/**/*.yaml']
}

const specs = swaggerJSDoc(swaggerOpts);
app.use('/api/docs',swaggerUI.serve,swaggerUI.setup(specs));

app.use(express.json());
app.use(cookieParser());

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/api/mocks', mocksRouter);

app.listen(PORT,()=>console.log(`Listening on ${PORT}`))
