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
        // Busca el Lead existente
        let existingLead = await prisma.lead.findUnique({
            where: {
                numeroWhatsapp: number,
            },
        });

        // Si no existe, crea un nuevo Lead con valores predeterminados
        if (!existingLead) {
            existingLead = await prisma.lead.create({
                data: {
                    numeroWhatsapp: number,
                    nombre: 'Sin nombre',  // Valor predeterminado para el nombre
                    conversacion: JSON.stringify([]), // Inicia como un array vacío
                    idTipoGestion: 1, // Puedes ajustar según tu lógica
                    urlPhotoPerfil: null,  // Este campo queda como null
                },
            });
        }

        // Busca el agente
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

        // Envía el mensaje
        await client.sendMessage(chatId, message);

        // Actualiza la conversación
        let conversation: { Agente: string; message: string; timestamp: string }[] = [];
        try {
            conversation = existingLead.conversacion ? JSON.parse(existingLead.conversacion) : [];
        } catch (error) {
            console.error('Error al analizar la conversación:', error);
            conversation = [];
        }

        // Obtiene la fecha y hora actuales en el formato requerido
        const currentTimestamp = new Date().toISOString(); // Esto devuelve el formato ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)

        // Agrega el mensaje del agente a la conversación
        conversation.push({ 
            Agente: `${nombreAgente}`, 
            message, 
            timestamp: currentTimestamp // Usar timestamp en lugar de time
        });

        // Actualiza el lead en la base de datos
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