import express from 'express';
//import session from 'express-session';
import whatsappRoutes from './src/routes/whatsappRoutes.routes';
import whatsappRoutesAgentes from './src/routes/agentes/whatsappRoutesAgentes.routes';
//import authRoutes from './src/auth/routes/auth.routes';

const app = express();

// app.use(
//     session({
//         secret: 'your_secret_key',
//         resave: false,
//         saveUninitialized: false,
//         cookie: {
//             secure: false,
//             maxAge: 1000 * 60 * 60 * 24,
//         },
//     })
// );

app.use(express.json());


app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/', whatsappRoutesAgentes);
//app.use('/api', authRoutes);

export default app;