import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const addAgents = async (req: Request, res: Response): Promise<void> => {
    const { nombre, correo, contrasena } = req.body;

    if (!nombre || !correo || !contrasena) {
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

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

        const newAgent = await prisma.agente.create({
            data: {
                nombre,
                correo,
                contrasena: hashedPassword,
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