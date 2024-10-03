import { Request, Response } from 'express';
import { generateQRCode } from '../services/whatsappService';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

export const startWhatsApp = async (req: Request, res: Response) => {
    try {
        console.log('Iniciando servicio de WhatsApp...');

        const qrCodeData = await generateQRCode();

        console.log(`Código QR generado y guardado en ${qrCodeData}`);

        res.status(200).json({
            qrCode: qrCodeData,
            qrCodeUrl: `/qr-code.png`
        });

    } catch (error) {
        console.error('Error al inicializar WhatsApp:', error);
        res.status(500).send('Error al inicializar WhatsApp');
    }
};