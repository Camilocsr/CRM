import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors'; 
import whatsappRoutes from './src/routes/whatsappRoutes.routes';
import whatsappRoutesAgentes from './src/routes/agentes/whatsappRoutesAgentes.routes';
import routesAuth from './src/auth/routes/auth.routes';
import './src/auth/config/passport-setup';
import watchLeadChanges, { registerWebSocketClient } from './src/middleware/watchLeadChanges';
import WebSocket from 'ws';
import dotenv from 'dotenv';
import http from 'http';

dotenv.config();

const app = express();

app.use(watchLeadChanges); // middleware para detectar cambios en la base de datos.

app.use(cors({
    origin: process.env.ENPOINT_APP_REACT,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(
    session({
        secret: process.env.SERVER_SECRET_KEY || ` `,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

// Rutas API
app.use('/api', routesAuth);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/', whatsappRoutesAgentes);

export const setupWebSocket = (server: http.Server) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('Cliente conectado');

        registerWebSocketClient(ws);

        ws.on('message', (message) => {
            console.log(`Mensaje recibido: ${message}`);
            ws.send(`Mensaje recibido: ${message}`);
        });

        ws.on('close', () => {
            console.log('Cliente desconectado');
        });
    });
};

export default app;