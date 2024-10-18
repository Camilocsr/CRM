import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import QRCode from 'qrcode';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import uploadFileToS3 from './AWS/S3/uploadS3';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import getAgentWithFewestLeads from './Whatsapp/agentLeadManager';
import { getAndSaveProfilePicture } from './Whatsapp/getAndSaveProfilePicture';
import { deleteFile } from '../utils/deleteFile';

dotenv.config();

const prisma = new PrismaClient();
const bucketName = process.env.BUCKET_S3;

if (!bucketName) {
    throw new Error("El nombre del bucket S3 no está definido en las variables de entorno.");
}

export const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
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

            const profileImagePath = await getAndSaveProfilePicture(contact);
            let profileImageS3Url = null;

            if (profileImagePath) {
                profileImageS3Url = await uploadFileToS3(bucketName, profileImagePath);
                console.log(`Imagen de perfil subida a S3: ${profileImageS3Url}`);

                try {
                    await deleteFile(profileImagePath);
                } catch (error) {
                    console.error('Error al eliminar el archivo local de imagen de perfil:', error);
                }
            }

            const existingLead = await prisma.lead.findUnique({
                where: { numeroWhatsapp: contactNumber },
            });

            let conversation: { Cliente: string; message: string; timestamp: string }[] = [];
            const currentTimestamp = new Date().toISOString();

            const handleMediaMessage = async (media: MessageMedia) => {
                const buffer = Buffer.from(media.data, 'base64');
                const fileType = media.mimetype.split('/');
                const fileExtension = fileType[1];
                const newFileName = `${Date.now()}.${fileExtension}`;
                const filePath = path.join(__dirname, '../../uploads', newFileName);

                await fs.writeFile(filePath, buffer);
                const s3Url = await uploadFileToS3(bucketName, filePath);

                try {
                    await deleteFile(filePath);
                } catch (error) {
                    console.error('Error al eliminar el archivo local:', error);
                }

                return s3Url;
            };

            if (!existingLead) {
                const tipoGestionNoGestionado = await prisma.tipoGestion.findUnique({
                    where: { tipoGestion: 'no gestionado' },
                });

                const assignedAgent = await getAgentWithFewestLeads();

                if (message.hasMedia) {
                    const media = await message.downloadMedia();
                    const s3Url = await handleMediaMessage(media);
                    if (s3Url) {
                        conversation.push({ Cliente: 'cliente', message: s3Url, timestamp: currentTimestamp });
                    }
                } else {
                    conversation.push({ Cliente: 'cliente', message: message.body, timestamp: currentTimestamp });
                }

                const newLead = await prisma.lead.create({
                    data: {
                        nombre: contactName,
                        numeroWhatsapp: contactNumber,
                        conversacion: JSON.stringify(conversation),
                        idTipoGestion: tipoGestionNoGestionado?.id,
                        idAgente: assignedAgent.id,
                        urlPhotoPerfil: profileImageS3Url,
                    },
                });

                console.log(`Nuevo lead creado: ${JSON.stringify(newLead)}`);
                message.reply('¡Gracias! Tu información ha sido registrada.');
            } else {
                if (existingLead.nombre === 'Sin nombre') {
                    await prisma.lead.update({
                        where: { id: existingLead.id },
                        data: { nombre: contactName },
                    });
                    console.log(`Nombre del lead actualizado a: ${contactName}`);
                }

                try {
                    conversation = existingLead.conversacion ? JSON.parse(existingLead.conversacion) : [];
                } catch (error) {
                    console.error('Error al analizar la conversación:', error);
                }

                if (message.hasMedia) {
                    const media = await message.downloadMedia();
                    const s3Url = await handleMediaMessage(media);
                    if (s3Url) {
                        conversation.push({ Cliente: 'cliente', message: s3Url, timestamp: currentTimestamp });
                    }
                } else {
                    conversation.push({ Cliente: 'cliente', message: message.body, timestamp: currentTimestamp });
                }

                await prisma.lead.update({
                    where: { id: existingLead.id },
                    data: {
                        conversacion: JSON.stringify(conversation),
                        urlPhotoPerfil: profileImageS3Url,
                    },
                });

                console.log(`Conversación actualizada para el lead con número: ${contactNumber}`);
            }
        });

        client.initialize();
    });
};