export const config = { runtime: 'nodejs' };
import { authenticateClientPortal } from '../../_lib/auth.js';
import { connectMySQL } from '../../_lib/mysql.js';
import { corsMiddleware } from '../../_lib/cors.js';
import { handleResponse } from '../../_lib/response.js';

export default async function handler(req, res) {
  await corsMiddleware(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const auth = await authenticateClientPortal(req);
    if (!auth.success) {
      return handleResponse(res, 401, { error: auth.error });
    }

    const { reviewId, response } = req.body;

    if (!reviewId || !response) {
      return handleResponse(res, 400, { error: 'ReviewId e response são obrigatórios' });
    }

    // TODO: Implement real Google Business Profile API call to reply to review
    // For now, just simulate success
    
    return handleResponse(res, 200, { 
      success: true,
      message: 'Resposta enviada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao responder avaliação:', error);
    return handleResponse(res, 500, { error: 'Erro interno do servidor' });
  }
}