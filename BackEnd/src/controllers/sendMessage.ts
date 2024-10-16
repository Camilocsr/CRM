import { Request, Response } from 'express';
import { client } from '../services/whatsappService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
    const { number, message, nombreAgente } = req.body;

    if (!number || !message || !nombreAgente) {
        res.status(400).json({ error: 'Número, mensaje y nombre del agente son requeridos.' });
        return;
    }

    try {
        let existingLead = await prisma.lead.findUnique({
            where: {
                numeroWhatsapp: number,
            },
            include: {
                tipoGestion: true
            }
        });

        if (!existingLead) {
            const tipoGestionNoGestionado = await prisma.tipoGestion.findFirst({
                where: { tipoGestion: 'no gestionado' }
            });

            existingLead = await prisma.lead.create({
                data: {
                    numeroWhatsapp: number,
                    nombre: 'Sin nombre',
                    conversacion: JSON.stringify([]),
                    idTipoGestion: tipoGestionNoGestionado?.id ?? null,
                    urlPhotoPerfil: null,
                },
                include: {
                    tipoGestion: true
                }
            });
        }

        const agente = await prisma.agente.findFirst({
            where: {
                nombre: nombreAgente,
            },
        });

        if (!agente) {
            res.status(404).json({ error: 'Agente no encontrado.' });
            return;
        }

        const chatId = `${number}@c.us`;

        await client.sendMessage(chatId, message);

        let conversation: { Agente: string; message: string; timestamp: string }[] = [];
        try {
            conversation = existingLead.conversacion ? JSON.parse(existingLead.conversacion) : [];
        } catch (error) {
            console.error('Error al analizar la conversación:', error);
            conversation = [];
        }

        const currentTimestamp = new Date().toISOString();

        conversation.push({
            Agente: `${nombreAgente}`,
            message,
            timestamp: currentTimestamp
        });

        let updatedTipoGestionId: number | null = existingLead.idTipoGestion;
        if (existingLead.tipoGestion?.tipoGestion === 'no gestionado') {
            const tipoGestionGestionado = await prisma.tipoGestion.findFirst({
                where: { tipoGestion: 'gestionado' }
            });
            updatedTipoGestionId = tipoGestionGestionado?.id ?? null;
        }

        await prisma.lead.update({
            where: { id: existingLead.id! },
            data: {
                conversacion: JSON.stringify(conversation),
                idAgente: agente.id,
                idTipoGestion: updatedTipoGestionId
            },
        });

        res.status(200).json({
            success: true,
            message: 'Mensaje enviado correctamente, conversación actualizada y tipo de gestión verificado.'
        });
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        res.status(500).json({ error: 'Error al enviar el mensaje.' });
    }
};