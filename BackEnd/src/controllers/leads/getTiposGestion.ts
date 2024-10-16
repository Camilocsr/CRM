import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTiposGestion = async (req: Request, res: Response) => {
  try {
    const tiposGestion = await prisma.tipoGestion.findMany({
      select: {
        tipoGestion: true,
      },
    });

    const nombresTiposGestion = tiposGestion.map(t => t.tipoGestion);

    res.status(200).json(nombresTiposGestion);
  } catch (error) {
    console.error('Error al obtener tipos de gestión:', error);
    res.status(500).json({ message: 'Error al obtener tipos de gestión' });
  }
};