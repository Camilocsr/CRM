import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getAgentWithFewestLeads() {
    const agents = await prisma.agente.findMany({
        include: {
            _count: {
                select: { leads: true }
            }
        },
        where: {
            rol: 'AGENTE'
        },
        orderBy: {
            leads: {
                _count: 'asc'
            }
        }
    });

    if (agents.length === 0) {
        throw new Error('No hay agentes disponibles para asignar leads');
    }

    return agents[0];
}

export default getAgentWithFewestLeads;