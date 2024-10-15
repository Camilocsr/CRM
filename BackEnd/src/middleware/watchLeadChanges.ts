import { PrismaClient } from '@prisma/client';
import { Server } from 'socket.io';

const prisma = new PrismaClient();

let lastLeadConversations: Record<number, string> = {};

const watchLeadChanges = (io: Server) => {
  setInterval(async () => {
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

          io.emit('leadUpdate', {
            numero: numeroWhatsapp,
            conversacion: parsedConversation
          });

          console.log(`Cambio detectado para el Lead ${numeroWhatsapp}`);
          console.log(`Nueva conversación:`, parsedConversation);
        }
      }
    } catch (error) {
      console.error('Error al consultar la base de datos:', error);
    }
  }, 1000); // Intervalo de 1 segundo
};

export default watchLeadChanges;