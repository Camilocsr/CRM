import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import dotenv from 'dotenv';

dotenv.config();

export const loginWithGoogle = passport.authenticate('google', {
    scope: ['profile', 'email'],
});

export const googleCallback = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', (err: Error | null, user: any, info: any) => {
        if (err) {
            console.error('Error during authentication:', err);
            return next(err);
        }
        if (!user) {
            console.log('Authentication failed, user not found');
            return res.redirect(`${process.env.ENPOINT_LOGIN}`);
        }
        
        console.log('Authenticated user:', user);
        
        req.logIn(user, (err) => {
            if (err) {
                console.error('Error during login:', err);
                return next(err);
            }
            
            const userEmail = user.correo || 'email_not_found';
            
            console.log('User email:', userEmail);
            
            return res.redirect(`http://localhost:3000/api/getAgentes/${encodeURIComponent(userEmail)}`);
        });
    })(req, res, next);
};

export const logout = (req: Request, res: Response) => {
    req.logout((err) => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).json({ error: 'Error al cerrar sesión' });
        }
        res.redirect('/');
    });
};