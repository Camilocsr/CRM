import axios from 'axios';
import { Lead } from '../components/Agentes/types';

const API_URL = import.meta.env.VITE_API_URL_GENERAL;

export const fetchLeadsByCategory = async (category: string, agenteName: string): Promise<Lead[]> => {
  try {
    if (category === 'Todos') {
      const response = await axios.get(`${API_URL}/getLeadsTipoGestion`, {
        params: { nombreAgente: agenteName }
      });
      return response.data;
    } else {
      const response = await axios.get(`${API_URL}/getLeadsTipoGestion`, {
        params: { tipoGestion: category, nombreAgente: agenteName }
      });
      return response.data;
    }
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }
};