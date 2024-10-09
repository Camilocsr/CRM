import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import WebSocket from 'ws';

const prisma = new PrismaClient();

let lastLeadConversations: Record<number, string | null> = {};
let websocketClients: WebSocket[] = [];

const watchLeadChanges = (req: Request, res: Response, next: NextFunction) => {
    const intervalId = setInterval(async () => {
        try {
            const leads = await prisma.lead.findMany({
                select: {
                    id: true,
                    numeroWhatsapp: true, // Campo numeroWhatsapp
                    conversacion: true,
                },
            });

            for (const lead of leads) {
                const { id, numeroWhatsapp, conversacion } = lead; // Obtenemos el numeroWhatsapp
                const currentConversation = JSON.parse(conversacion || '[]');
                const lastConversation = JSON.parse(lastLeadConversations[id] || '[]');

                if (JSON.stringify(currentConversation) !== JSON.stringify(lastConversation)) {
                    // Actualizamos la conversación almacenada
                    lastLeadConversations[id] = conversacion;

                    // Enviamos el número de teléfono y la conversación a los clientes WebSocket
                    websocketClients.forEach((client) => {
                        if (client.readyState === WebSocket.OPEN) {
                            console.log(`Enviando el número de teléfono ${numeroWhatsapp} y la conversación al cliente WebSocket.`);
                            console.log(`Datos enviados: ${JSON.stringify({ numero: numeroWhatsapp, conversacion: currentConversation })}`);
                            client.send(JSON.stringify({
                                numero: numeroWhatsapp,
                                conversacion: currentConversation // Enviar la conversación actual
                            }));
                        } else {
                            console.log(`Cliente WebSocket no está abierto para el lead ${numeroWhatsapp}.`);
                        }
                    });


                    // Logs detallados en la consola
                    console.log(`Número de Lead ${numeroWhatsapp} con conversación editada.`);
                    console.log(`Conversación actual:`, currentConversation);
                    console.log(`Última conversación almacenada:`, lastConversation);
                    console.log(`Número de Lead ${numeroWhatsapp} enviado a clientes WebSocket.`);
                }
            }
        } catch (error) {
            console.error('Error al consultar la base de datos:', error);
        }
    }, 1000); // Intervalo de 1 segundo

    req.on('close', () => {
        clearInterval(intervalId);
    });

    next();
};

export const registerWebSocketClient = (client: WebSocket) => {
    websocketClients.push(client);
    client.on('close', () => {
        websocketClients = websocketClients.filter(c => c !== client);
    });
};

export default watchLeadChanges;