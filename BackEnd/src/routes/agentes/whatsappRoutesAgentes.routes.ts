import { Router } from 'express';
import { addAgents } from '../../controllers/agentes/addAgents';

const router = Router();

router.post('/addAgents', addAgents);

export default router;