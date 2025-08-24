export const config = { runtime: 'nodejs' };
import { authenticateClientPortal } from '../_lib/auth.js';
import { connectMySQL } from '../_lib/mysql.js';
import { corsMiddleware } from '../_lib/cors.js';
import { handleResponse } from '../_lib/response.js';

// Mock data for now - will be replaced with real Google Business Profile API calls
const mockBusinessInfo = {
  name: 'Clínica Saúde & Vida',
  address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
  phone: '(11) 3456-7890',
  website: 'https://clinicasaudevida.com.br',
  category: 'Clínica Médica',
  hours: {
    'Segunda': '08:00 - 18:00',
    'Terça': '08:00 - 18:00',
    'Quarta': '08:00 - 18:00',
    'Quinta': '08:00 - 18:00',
    'Sexta': '08:00 - 17:00',
    'Sábado': '08:00 - 12:00',
    'Domingo': 'Fechado'
  }
};

export default async function handler(req, res) {
  await corsMiddleware(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const auth = await authenticateClientPortal(req);
    if (!auth.success) {
      return handleResponse(res, 401, { error: auth.error });
    }

    const { clientId, clientUserId } = auth.data;

    if (req.method === 'GET') {
      // TODO: Implement real Google Business Profile API call to get business info
      // For now, return mock data
      return handleResponse(res, 200, mockBusinessInfo);
    }

    if (req.method === 'PUT') {
      // TODO: Implement real Google Business Profile API call to update business info
      // For now, just simulate success
      return handleResponse(res, 200, { 
        success: true,
        message: 'Informações atualizadas com sucesso'
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Erro ao gerenciar informações do negócio:', error);
    return handleResponse(res, 500, { error: 'Erro interno do servidor' });
  }
}