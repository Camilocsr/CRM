import { Router } from 'express';
import { addAgents } from '../../controllers/agentes/addAgents';
import { getAgenteWithLeads } from '../../controllers/agentes/getAgentes';
import { getLeadsByTypeAndAgent } from '../../controllers/agentes/getLeadsTipoGestion';

const router = Router();

router.post('/addAgents', addAgents);
router.get('/getAgentes/:correo', getAgenteWithLeads);
router.get('/getLeadsTipoGestion', getLeadsByTypeAndAgent);

export default router;