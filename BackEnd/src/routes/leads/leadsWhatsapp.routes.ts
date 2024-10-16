import { Router } from 'express';
import { updateLead } from '../../controllers/leads/uploadLead';
import { upload } from '../../middleware/multer';

const router = Router();

router.put('/updateLead/:numeroWhatsapp', upload.single('urlPhotoPerfil'), updateLead);

export default router;