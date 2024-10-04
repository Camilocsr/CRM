import { Request, Response } from 'express';
import passport from 'passport';

export const loginWithGoogle = passport.authenticate('google', {
    scope: ['profile', 'email'],
});

export const googleCallback = passport.authenticate('google', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
});

export const logout = (req: Request, res: Response) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ error: 'Error al cerrar sesión' });
        res.redirect('/');
    });
};