import express from 'express';
import whatsappRoutes from './src/routes/whatsappRoutes.routes'; // Asegúrate de que la ruta sea correcta
import whatsappRoutesAgentes from './src/routes/agentes/whatsappRoutesAgentes.routes'

const app = express();

app.use(express.json());

// Usar las rutas de WhatsApp
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/', whatsappRoutesAgentes);

export default app;