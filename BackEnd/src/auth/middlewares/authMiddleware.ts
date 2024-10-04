import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Middleware para verificar si el usuario está autenticado.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
};

/**
 * Middleware para autorizar solo a agentes registrados.
 */
export const authorizeAgent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (req.isAuthenticated()) {
    const email = (req.user as any).correo;

    try {
      const agente = await prisma.agente.findUnique({
        where: { correo: email },
      });

      if (agente) {
        return next(); // Asegúrate de llamar a next() si el agente existe
      } else {
        res.status(403).json({ message: 'Acceso denegado. Solo agentes registrados pueden acceder.' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Error al verificar la autorización.' });
    }
  } else {
    res.redirect('/login');
  }
};