import { Router } from 'express';
import { updateLead } from '../../controllers/leads/uploadLead';
import { upload } from '../../middleware/multer';
import { getTiposGestion } from '../../controllers/leads/getTiposGestion';

const router = Router();

router.put('/updateLead/:numeroWhatsapp', upload.single('urlPhotoPerfil'), updateLead);
router.get('/tipos_gestion', getTiposGestion);

export default router;