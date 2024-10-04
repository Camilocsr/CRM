import { Router } from 'express';
import { startWhatsApp } from '../controllers/whatsappController';
import { sendMessage } from '../controllers/sendMessage';

const router = Router();

router.get('/start', startWhatsApp);
router.post('/sendMessage', sendMessage);

export default router;