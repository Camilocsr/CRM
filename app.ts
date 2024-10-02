import { Client, LocalAuth } from 'whatsapp-web.js';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

// Inicializar cliente de WhatsApp con almacenamiento local para autenticación
const client = new Client({
    authStrategy: new LocalAuth(), // Guarda las sesiones localmente
});

// Mostrar el QR en una imagen
client.on('qr', (qr) => {
    const qrImagePath = path.join(__dirname, 'qr.png'); // Ruta de la imagen
    QRCode.toFile(qrImagePath, qr, {
        width: 300, // Ajusta el tamaño según sea necesario
    }, (err) => {
        if (err) {
            console.error('Error al generar el QR:', err);
        } else {
            console.log('Código QR guardado en:', qrImagePath);
        }
    });
});

// Confirmar que el cliente está listo
client.on('ready', () => {
    console.log('¡Cliente de WhatsApp listo!');
});

// Manejar mensajes entrantes
client.on('message', (message) => {
    console.log(`Mensaje recibido de ${message.from}: ${message.body}`);

    // Ejemplo: Responder automáticamente a un mensaje
    if (message.body.toLowerCase() === 'hola') {
        message.reply('¡Hola! ¿Cómo puedo ayudarte hoy?');
    }
});

// Iniciar cliente
client.initialize();