import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getLeadsByTypeAndAgent = async (req: Request, res: Response): Promise<void> => {
  const { tipoGestion, nombreAgente } = req.query;

  if (!nombreAgente) {
    res.status(400).json({ error: 'Se requiere el nombre del agente' });
    return;
  }

  try {
    let whereClause: any = {
      agente: {
        nombre: nombreAgente as string,
      },
    };

    if (tipoGestion) {
      whereClause.tipoGestion = {
        tipoGestion: tipoGestion as string,
      };
    }

    const leads = await prisma.lead.findMany({
      where: whereClause,
      include: {
        tipoGestion: true,
        agente: true,
      },
    });

    if (leads.length === 0) {
      res.status(404).json({ message: 'No se encontraron leads con los criterios especificados' });
    } else {
      res.status(200).json(leads);
    }
  } catch (error) {
    console.error('Error al obtener los leads:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};