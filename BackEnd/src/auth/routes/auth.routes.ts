import { Router } from 'express';
import { loginWithGoogle, googleCallback, logout } from '../controllers/authController';

const router = Router();

router.get('/auth/google', loginWithGoogle);

router.get('/auth/google/callback', googleCallback);

router.get('/logout', logout);

export default router;