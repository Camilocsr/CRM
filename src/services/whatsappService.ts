import { Client, LocalAuth } from 'whatsapp-web.js';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

const client = new Client({
    authStrategy: new LocalAuth(),
});

export const generateQRCode = () => {
    return new Promise<string>((resolve, reject) => {
        client.on('qr', (qr) => {
            console.log('QR recibido, generando imagen...');

            const filePath = path.join(__dirname, '../../public/qr-code.png'); // Ruta donde se guardará la imagen

            QRCode.toFile(filePath, qr, { width: 300 }, (err) => {
                if (err) {
                    console.error('Error al generar el QR:', err);
                    reject(err);
                } else {
                    console.log('Código QR generado correctamente');
                    // Devolver la URL del archivo generado
                    resolve(`/qr-code.png`); // Cambia esto si tienes una ruta diferente para servir archivos estáticos
                }
            });
        });

        client.on('ready', () => {
            console.log('¡Cliente de WhatsApp listo!');
        });

        client.on('message', (message) => {
            console.log(`Mensaje recibido de ${message.from}: ${message.body}`);

            if (message.body.toLowerCase() === 'hola') {
                message.reply('¡Hola! ¿Cómo puedo ayudarte hoy?');
            }
        });

        client.initialize();
    });
};