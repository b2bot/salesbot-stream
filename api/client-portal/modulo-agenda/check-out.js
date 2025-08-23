
import { connectMySQL } from '../_lib/mysql.js';
import { authenticateClientPortal } from '../_lib/auth.js';
import { ok, fail } from '../_lib/response.js';
import { corsHeaders } from '../_lib/cors.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', corsHeaders);
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Autenticação
    const authResult = await authenticateClientPortal(req);
    if (!authResult.success) {
      return fail(res, 'UNAUTHORIZED', authResult.error, 401);
    }

    const { clientId } = authResult.data;

    if (req.method === 'POST') {
      const { appointmentId } = req.body;

      if (!appointmentId) {
        return fail(res, 'INVALID_DATA', 'ID do agendamento é obrigatório', 400);
      }

      // Mock de check-out - em produção, atualizaria o banco de dados
      const mockResult = {
        appointmentId,
        status: 'completed',
        checkOutTime: new Date().toISOString(),
        message: 'Check-out realizado com sucesso'
      };

      console.log(`Check-out realizado para agendamento ${appointmentId} pelo cliente ${clientId}`);

      return ok(res, mockResult);
    }

    return fail(res, 'METHOD_NOT_ALLOWED', 'Método não permitido', 405);

  } catch (error) {
    console.error('Erro em /api/client-portal/modulo-agenda/check-out:', error);
    return fail(res, 'INTERNAL_ERROR', 'Erro interno do servidor', 500);
  }
}
