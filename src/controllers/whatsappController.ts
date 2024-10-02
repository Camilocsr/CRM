import { Request, Response } from 'express';
import axios from 'axios';

// Enviar un mensaje de WhatsApp usando Builder
export const sendMessage = async (req: Request, res: Response) => {
  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({ error: 'Número de destinatario y mensaje son requeridos.' });
  }

  try {
    const response = await axios.post(
      'https://api.tyntec.com/conversations/v3/messages',
      {
        to: to,
        from: process.env.WHATSAPP_FROM, // Tu número de WhatsApp habilitado
        channel: 'whatsapp',
        content: {
          type: 'text',
          text: message
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.TYNTEC_API_KEY}`
        }
      }
    );

    res.status(200).json({
      message: 'Mensaje enviado con éxito.',
      data: response.data
    });
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    res.status(500).json({ error: 'Error al enviar mensaje.' });
  }
};