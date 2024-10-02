import { Router } from 'express';
import { sendMessage } from '../controllers/whatsappController';

const router = Router();

// Ruta para enviar un mensaje por WhatsApp
router.post('/send', sendMessage);

export default router;