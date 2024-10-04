import express from 'express';
import session from 'express-session';
import passport from 'passport';
import whatsappRoutes from './src/routes/whatsappRoutes.routes';
import whatsappRoutesAgentes from './src/routes/agentes/whatsappRoutesAgentes.routes';
import routesAuth from './src/auth/routes/auth.routes';
import './src/auth/config/passport-setup';

const app = express();

app.use(
    session({
        secret: 'your_secret_key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // Cambiar a true en producción con HTTPS
            maxAge: 1000 * 60 * 60 * 24, // 1 día
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use('/api/', routesAuth);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/', whatsappRoutesAgentes);

export default app;