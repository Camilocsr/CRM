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
        const existingLead = await prisma.lead.findUnique({
            where: {
                numeroWhatsapp: number,
            },
        });

        if (!existingLead) {
            res.status(404).json({ error: 'El número no se encuentra registrado.' });
            return;
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

        let conversation: { sender: string; message: string }[] = [];

        try {
            conversation = existingLead.conversacion ? JSON.parse(existingLead.conversacion) : [];
        } catch (error) {
            console.error('Error al analizar la conversación:', error);
            conversation = [];
        }

        conversation.push({ sender: `${nombreAgente}`, message });

        await prisma.lead.update({
            where: { id: existingLead.id! },
            data: {
                conversacion: JSON.stringify(conversation),
                idAgente: agente.id,
            },
        });

        res.status(200).json({ success: true, message: 'Mensaje enviado correctamente y conversación actualizada.' });
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        res.status(500).json({ error: 'Error al enviar el mensaje.' });
    }
};