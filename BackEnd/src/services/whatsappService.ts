import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import QRCode from 'qrcode';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import uploadFileToS3 from './AWS/S3/uploadS3';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const bucketName = process.env.BUCKET_S3;

if (!bucketName) {
    throw new Error("El nombre del bucket S3 no está definido en las variables de entorno.");
}

export const client = new Client({
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

            let conversation: { Cliente: string; message: string; time: string }[] = [];

            const handleMediaMessage = async (media: MessageMedia) => {
                const buffer = Buffer.from(media.data, 'base64');
                
                const fileType = media.mimetype.split('/');
                const fileExtension = fileType[1];
                const newFileName = `${Date.now()}.${fileExtension}`;
                const filePath = path.join(__dirname, '../../uploads', newFileName);
                
                await fs.writeFile(filePath, buffer);
                console.log('Archivo guardado en:', filePath);
            
                const s3Url = await uploadFileToS3(bucketName, filePath);
                
                try {
                    await fs.unlink(filePath);
                    console.log('Archivo local eliminado:', filePath);
                } catch (error) {
                    console.error('Error al eliminar el archivo local:', error);
                }
                
                return s3Url;
            };

            const currentTime = new Date().toLocaleTimeString('es-ES', { hour12: false });

            if (!existingLead) {
                const tipoGestionNoGestionado = await prisma.tipoGestion.findUnique({
                    where: {
                        tipoGestion: 'no gestionado',
                    },
                });

                if (!tipoGestionNoGestionado) {
                    console.error('No se encontró el tipo de gestión "no gestionado".');
                    return;
                }

                if (message.hasMedia) {
                    const media = await message.downloadMedia();
                    const s3Url = await handleMediaMessage(media);
                    if (s3Url) {
                        conversation.push({ Cliente: 'cliente', message: s3Url, time: currentTime });
                    }
                } else {
                    conversation.push({ Cliente: 'cliente', message: message.body, time: currentTime });
                }

                const newLead = await prisma.lead.create({
                    data: {
                        nombre: contactName,
                        numeroWhatsapp: contactNumber,
                        conversacion: JSON.stringify(conversation),
                        idTipoGestion: tipoGestionNoGestionado.id,
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

                if (message.hasMedia) {
                    const media = await message.downloadMedia();
                    const s3Url = await handleMediaMessage(media);
                    if (s3Url) {
                        conversation.push({ Cliente: 'cliente', message: s3Url, time: currentTime });
                    }
                } else {
                    conversation.push({ Cliente: 'cliente', message: message.body, time: currentTime });
                }

                await prisma.lead.update({
                    where: { id: existingLead.id! },
                    data: { conversacion: JSON.stringify(conversation) },
                });
            }
        });

        client.initialize();
    });
};