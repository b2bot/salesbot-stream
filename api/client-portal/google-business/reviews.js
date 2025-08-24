export const config = { runtime: 'nodejs' };
import { authenticateClientPortal } from '../_lib/auth.js';
import { connectMySQL } from '../_lib/mysql.js';
import { corsMiddleware } from '../_lib/cors.js';
import { handleResponse } from '../_lib/response.js';

// Mock data for now - will be replaced with real Google Business Profile API calls
const generateMockReviews = () => [
  {
    id: '1',
    author: 'Maria Silva',
    rating: 5,
    comment: 'Excelente atendimento! Dra. Ana foi muito atenciosa e esclareceu todas as minhas dúvidas. Recomendo!',
    date: '2024-12-07',
    replied: false
  },
  {
    id: '2',
    author: 'João Santos',
    rating: 4,
    comment: 'Boa clínica, ambiente limpo e organizado. Apenas o tempo de espera foi um pouco longo.',
    date: '2024-12-06',
    replied: true,
    response: 'Obrigado pelo feedback, João! Estamos trabalhando para reduzir o tempo de espera.'
  },
  {
    id: '3',
    author: 'Ana Costa',
    rating: 5,
    comment: 'Profissionais muito competentes e atendimento humanizado. Muito satisfeita com o resultado!',
    date: '2024-12-05',
    replied: false
  },
  {
    id: '4',
    author: 'Carlos Oliveira',
    rating: 3,
    comment: 'Atendimento ok, mas o preço é um pouco alto.',
    date: '2024-12-04',
    replied: false
  },
  {
    id: '5',
    author: 'Fernanda Lima',
    rating: 5,
    comment: 'Adorei o atendimento! Equipe muito profissional e local muito bem organizado.',
    date: '2024-12-03',
    replied: true,
    response: 'Muito obrigado pelo carinho, Fernanda! É sempre um prazer atendê-la.'
  }
];

export default async function handler(req, res) {
  await corsMiddleware(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  if (req.method === 'GET') {
    try {
      const auth = await authenticateClientPortal(req);
      if (!auth.success) {
        return handleResponse(res, 401, { error: auth.error });
      }

      const { rating, status, period } = req.query;
      
      // For now, return mock data with filtering
      let reviews = generateMockReviews();
      
      if (rating && rating !== 'todas') {
        reviews = reviews.filter(r => r.rating.toString() === rating);
      }
      
      if (status === 'respondidas') {
        reviews = reviews.filter(r => r.replied);
      } else if (status === 'nao-respondidas') {
        reviews = reviews.filter(r => !r.replied);
      }

      return handleResponse(res, 200, reviews);

    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      return handleResponse(res, 500, { error: 'Erro interno do servidor' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}