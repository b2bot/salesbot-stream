
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
      const { appointmentId, observacoes } = req.body;

      if (!appointmentId) {
        return fail(res, 'MISSING_APPOINTMENT_ID', 'ID do agendamento é obrigatório', 400);
      }

      // Simula o check-in
      const checkInData = {
        appointmentId,
        status: 'em_andamento',
        checkin_time: new Date().toISOString(),
        checkin_observacoes: observacoes || null,
        updated_at: new Date().toISOString()
      };

      console.log(`Check-in realizado para agendamento ${appointmentId}:`, checkInData);

      return ok(res, {
        message: 'Check-in realizado com sucesso',
        data: checkInData
      });
    }

    return fail(res, 'METHOD_NOT_ALLOWED', 'Método não permitido', 405);

  } catch (error) {
    console.error('Erro em /api/client-portal/modulo-agenda/checkin:', error);
    return fail(res, 'INTERNAL_ERROR', 'Erro interno do servidor', 500);
  }
}
