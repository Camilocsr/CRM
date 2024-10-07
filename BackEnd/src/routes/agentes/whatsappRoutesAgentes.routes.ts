import { Router } from 'express';
import { addAgents } from '../../controllers/agentes/addAgents';
import { getAgenteWithLeads } from '../../controllers/agentes/getAgentes';

const router = Router();

router.post('/addAgents', addAgents);
router.get('/getAgentes/:correo', getAgenteWithLeads);

export default router;