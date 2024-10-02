import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

// Inicializar cliente de WhatsApp con almacenamiento local para autenticación
const client = new Client({
    authStrategy: new LocalAuth(), // Guarda las sesiones localmente
});

// Mostrar el QR en la consola
client.on('qr', (qr) => {
    console.log('Escanea este código QR para iniciar sesión en WhatsApp:');
    qrcode.generate(qr, { small: true });
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