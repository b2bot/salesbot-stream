export const config = { runtime: 'nodejs' };
import { authenticateClientPortal } from '../_lib/auth.js';
import { connectMySQL } from '../_lib/mysql.js';
import { corsMiddleware } from '../_lib/cors.js';
import { handleResponse } from '../_lib/response.js';

// Mock data for now - will be replaced with real Google Business Profile API calls
const generateMockQuestions = () => [
  {
    id: '1',
    question: 'Vocês atendem por convênio?',
    author: 'Cliente Anônimo',
    date: '2024-12-06',
    answered: false
  },
  {
    id: '2',
    question: 'Qual o horário de funcionamento no sábado?',
    author: 'Cliente Anônimo',
    date: '2024-12-05',
    answered: true,
    answer: 'Funcionamos aos sábados das 08:00 às 12:00.'
  },
  {
    id: '3',
    question: 'Fazem atendimento de urgência?',
    author: 'Cliente Anônimo',
    date: '2024-12-04',
    answered: false
  },
  {
    id: '4',
    question: 'Qual o valor da consulta particular?',
    author: 'Cliente Anônimo',
    date: '2024-12-03',
    answered: true,
    answer: 'Os valores variam conforme a especialidade. Entre em contato para mais informações.'
  }
];

export default async function handler(req, res) {
  await corsMiddleware(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const auth = await authenticateClientPortal(req);
    if (!auth.success) {
      return handleResponse(res, 401, { error: auth.error });
    }

    const { clientId, clientUserId } = auth.data;

    // TODO: Implement real Google Business Profile API call to get Q&A
    // For now, return mock data
    const questions = generateMockQuestions();

    return handleResponse(res, 200, questions);

  } catch (error) {
    console.error('Erro ao buscar perguntas:', error);
    return handleResponse(res, 500, { error: 'Erro interno do servidor' });
  }
}