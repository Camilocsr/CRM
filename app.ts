import express from 'express';
import whatsappRoutes from './src/routes/whatsappRoutes.routes'; // Asegúrate de que la ruta sea correcta

const app = express();

// Usar las rutas de WhatsApp
app.use('/api/whatsapp', whatsappRoutes);

export default app;