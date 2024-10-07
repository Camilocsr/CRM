import { Request, Response } from 'express';
import passport from 'passport';
import dotenv from 'dotenv';

export const loginWithGoogle = passport.authenticate('google', {
    scope: ['profile', 'email'],
});

export const googleCallback = passport.authenticate('google', {
    successRedirect: '/dashboard',
    failureRedirect: `${process.env.ENPOINT_LOGIN}`,
});

export const logout = (req: Request, res: Response) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ error: 'Error al cerrar sesión' });
        res.redirect('/');
    });
};