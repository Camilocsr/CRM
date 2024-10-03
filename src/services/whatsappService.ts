import { Client, LocalAuth } from 'whatsapp-web.js';
import QRCode from 'qrcode';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const client = new Client({
    authStrategy: new LocalAuth(),
});

export const generateQRCode = () => {
    return new Promise<string>((resolve, reject) => {
        client.on('qr', (qr) => {
            console.log('QR recibido, generando imagen...');

            const filePath = path.join(__dirname, '../../public/qr-code.png');

            QRCode.toFile(filePath, qr, { width: 300 }, (err) => {
                if (err) {
                    console.error('Error al generar el QR:', err);
                    reject(err);
                } else {
                    console.log('Código QR generado correctamente');
                    resolve(`/qr-code.png`);
                }
            });
        });

        client.on('ready', () => {
            console.log('¡Cliente de WhatsApp listo!');
        });

        client.on('message', async (message) => {
            console.log(`Mensaje recibido de ${message.from}: ${message.body}`);
        
            const contact = await message.getContact();
            const contactName = contact.pushname || contact.number;
            const contactNumber = contact.number;
        
            console.log(`Nombre del contacto: ${contactName}`);
        
            const existingLead = await prisma.lead.findUnique({
                where: {
                    numeroWhatsapp: contactNumber,
                },
            });
        
            let conversation: { sender: string; message: string }[] = [];
        
            if (!existingLead) {
                conversation.push({ sender: 'cliente', message: message.body });
        
                const newLead = await prisma.lead.create({
                    data: {
                        nombre: contactName,
                        numeroWhatsapp: contactNumber,
                        conversacion: JSON.stringify(conversation),
                    },
                });
                console.log(`Nuevo lead creado: ${JSON.stringify(newLead)}`);
                message.reply('¡Gracias! Tu información ha sido registrada.');
            } else {
                console.log(`El lead ya existe: ${JSON.stringify(existingLead)}`);
        
                try {
                    conversation = existingLead.conversacion ? JSON.parse(existingLead.conversacion) : [];
                } catch (error) {
                    console.error('Error al analizar la conversación:', error);
                    conversation = [];
                }
        
                conversation.push({ sender: 'cliente', message: message.body });
        
                await prisma.lead.update({
                    where: { id: existingLead.id! },
                    data: { conversacion: JSON.stringify(conversation) },
                });
                message.reply('Tu mensaje ha sido registrado.');
            }

            if (message.body.toLowerCase() === 'hola') {
                const replyMessage = '¡Hola! ¿Cómo puedo ayudarte hoy?';
                await client.sendMessage(message.from, replyMessage);
                conversation.push({ sender: 'whatsapp', message: replyMessage });
        
                if (existingLead) {
                    await prisma.lead.update({
                        where: { id: existingLead.id },
                        data: { conversacion: JSON.stringify(conversation) },
                    });
                }
            }
        });

        client.initialize();
    });
};