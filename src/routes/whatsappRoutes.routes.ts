import { Router } from 'express';
import { startWhatsApp } from '../controllers/whatsappController';

const router = Router();

router.get('/start', startWhatsApp);

export default router;