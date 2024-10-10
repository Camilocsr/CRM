import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import WebSocket from 'ws';

const prisma = new PrismaClient();

let lastLeadConversations: Record<number, string> = {};
let websocketClients: WebSocket[] = [];

const watchLeadChanges = (req: Request, res: Response, next: NextFunction) => {
    const intervalId = setInterval(async () => {
        try {
            const leads = await prisma.lead.findMany({
                select: {
                    id: true,
                    numeroWhatsapp: true,
                    conversacion: true,
                },
            });

            for (const lead of leads) {
                const { id, numeroWhatsapp, conversacion } = lead;
                
                const currentConversation = conversacion || '[]';
                
                if (currentConversation !== lastLeadConversations[id]) {
                    lastLeadConversations[id] = currentConversation;

                    const parsedConversation = JSON.parse(currentConversation);

                    websocketClients.forEach((client) => {
                        if (client.readyState === WebSocket.OPEN) {
                            const message = JSON.stringify({
                                numero: numeroWhatsapp,
                                conversacion: parsedConversation
                            });
                            client.send(message);
                            console.log(`Enviado al cliente WebSocket: ${message}`);
                        }
                    });

                    // Logs detallados en la consola
                    console.log(`Cambio detectado para el Lead ${numeroWhatsapp}`);
                    console.log(`Nueva conversación:`, parsedConversation);
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