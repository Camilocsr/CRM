import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors'; 
import whatsappRoutes from './src/routes/whatsappRoutes.routes';
import whatsappRoutesAgentes from './src/routes/agentes/whatsappRoutesAgentes.routes';
import routesAuth from './src/auth/routes/auth.routes';
import './src/auth/config/passport-setup';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
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

app.use('/api', routesAuth);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/', whatsappRoutesAgentes);

export default app;