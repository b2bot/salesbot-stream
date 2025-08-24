export const config = { runtime: 'nodejs' };
import { authenticateClientPortal } from '../_lib/auth.js';
import { connectMySQL } from '../_lib/mysql.js';
import { corsMiddleware } from '../_lib/cors.js';
import { handleResponse } from '../_lib/response.js';

// Mock data for now - will be replaced with real Google Business Profile API calls
const generateMockMetrics = () => ({
  views: { value: Math.floor(Math.random() * 3000) + 2000, change: (Math.random() * 30) - 15 },
  searches: { value: Math.floor(Math.random() * 1500) + 1000, change: (Math.random() * 25) - 12 },
  calls: { value: Math.floor(Math.random() * 200) + 100, change: (Math.random() * 20) - 10 },
  website: { value: Math.floor(Math.random() * 400) + 200, change: (Math.random() * 35) - 17 },
  directions: { value: Math.floor(Math.random() * 500) + 300, change: (Math.random() * 30) - 15 }
});

const generateMockChartData = () => {
  const data = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    data.push({
      date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      views: Math.floor(Math.random() * 100) + 40,
      searches: Math.floor(Math.random() * 50) + 20,
      calls: Math.floor(Math.random() * 20) + 5,
      website: Math.floor(Math.random() * 30) + 10,
      directions: Math.floor(Math.random() * 35) + 15
    });
  }
  return data;
};

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
    const { startDate, endDate, location } = req.query;

    // For now, return mock data
    // TODO: Implement real Google Business Profile API integration
    const metrics = generateMockMetrics();
    const chartData = generateMockChartData();

    return handleResponse(res, 200, {
      metrics,
      chartData
    });

  } catch (error) {
    console.error('Erro ao buscar métricas Google Business:', error);
    return handleResponse(res, 500, { error: 'Erro interno do servidor' });
  }
}