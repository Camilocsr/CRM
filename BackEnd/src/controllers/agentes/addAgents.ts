import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addAgents = async (req: Request, res: Response): Promise<void> => {
    const { nombre, correo } = req.body;

    if (!nombre || !correo) {
        res.status(400).json({ message: 'Faltan datos requeridos.' });
        return;
    }

    try {
        const existingAgent = await prisma.agente.findUnique({
            where: {
                correo,
            },
        });

        if (existingAgent) {
            res.status(409).json({ message: 'Ya existe un agente con este correo.' });
            return;
        }

        const newAgent = await prisma.agente.create({
            data: {
                nombre,
                correo
            },
        });

        res.status(201).json(newAgent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al agregar el agente.' });
    } finally {
        await prisma.$disconnect();
    }
};