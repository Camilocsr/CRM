import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAgenteWithLeads = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { correo } = req.params;

    try {
        const agente = await prisma.agente.findUnique({
            where: { correo },
            include: {
                leads: {
                    include: {
                        tipoGestion: true
                    }
                }
            },
        });

        if (!agente) {
            res.status(404).json({ message: 'Agente no encontrado' });
        } else {
            const leadsConTipoGestion = agente.leads.map(lead => ({
                id: lead.id,
                nombre: lead.nombre,
                numeroWhatsapp: lead.numeroWhatsapp,
                conversacion: lead.conversacion,
                idAgente: lead.idAgente,
                TipoGestion: lead.tipoGestion ? lead.tipoGestion.tipoGestion : null,
                urlPhotoPerfil: (lead as any).urlPhotoPerfil
            }));

            res.status(200).json({
                ...agente,
                leads: leadsConTipoGestion,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el agente', error });
    }
};