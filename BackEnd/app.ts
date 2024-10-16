import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import whatsappRoutes from './src/routes/whatsappRoutes.routes';
import whatsappRoutesAgentes from './src/routes/agentes/whatsappRoutesAgentes.routes';
import leadsWhatsapp from './src/routes/leads/leadsWhatsapp.routes';
import routesAuth from './src/auth/routes/auth.routes';
import './src/auth/config/passport-setup';
import watchLeadChanges from './src/middleware/watchLeadChanges';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.ENPOINT_APP_REACT,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Middleware para agregar encabezados de seguridad
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "script-src 'self' 'unsafe-inline'");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// Configuración de CORS
app.use(cors({
  origin: process.env.ENPOINT_APP_REACT,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Configuración de sesión
app.use(
  session({
    secret: process.env.SERVER_SECRET_KEY || 'default_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
    },
  })
);

// Inicialización de Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware para parsear JSON
app.use(express.json());

// Rutas API
app.use('/api', routesAuth);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/', whatsappRoutesAgentes);
app.use('/api/', leadsWhatsapp);

// Configuración de Socket.IO
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Middleware para observar cambios de leads
watchLeadChanges(io);

// Función para iniciar el servidor
const startServer = (port: number) => {
  httpServer.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
  });
};

export { app, io, startServer };