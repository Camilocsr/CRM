import { Request, Response } from 'express';
import { client } from '../services/whatsappService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
    const { number, message } = req.body;

    if (!number || !message) {
        res.status(400).json({ error: 'Número y mensaje son requeridos.' });
        return;
    }

    try {
        // Buscar el número en la base de datos
        const existingLead = await prisma.lead.findUnique({
            where: {
                numeroWhatsapp: number,
            },
        });

        if (!existingLead) {
            res.status(404).json({ error: 'El número no se encuentra registrado.' });
            return;
        }

        // Construir chatId
        const chatId = `${number}@c.us`;

        // Enviar el mensaje
        await client.sendMessage(chatId, message);

        // Agregar el mensaje a la conversación
        let conversation: { sender: string; message: string }[] = [];

        try {
            conversation = existingLead.conversacion ? JSON.parse(existingLead.conversacion) : [];
        } catch (error) {
            console.error('Error al analizar la conversación:', error);
            conversation = [];
        }

        conversation.push({ sender: 'whatsapp', message });

        // Actualizar la conversación en la base de datos
        await prisma.lead.update({
            where: { id: existingLead.id! },
            data: { conversacion: JSON.stringify(conversation) },
        });

        res.status(200).json({ success: true, message: 'Mensaje enviado correctamente y conversación actualizada.' });
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        res.status(500).json({ error: 'Error al enviar el mensaje.' });
    }
};