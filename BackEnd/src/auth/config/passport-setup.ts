import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

passport.use(new GoogleStrategy({
    clientID: process.env.CUSTOM_ID!,
    clientSecret: process.env.CLIENT_SECRET!,
    callbackURL: "/auth/google/callback",
    passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
    const email = profile.emails?.[0].value;

    try {
        const agente = await prisma.agente.findUnique({
            where: { correo: email },
        });

        if (agente) {
            return done(null, agente);
        } else {
            return done(null, false, { message: 'No autorizado. El correo no está registrado.' });
        }
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
    try {
        const agente = await prisma.agente.findUnique({ where: { id } });
        done(null, agente);
    } catch (err) {
        done(err);
    }
});