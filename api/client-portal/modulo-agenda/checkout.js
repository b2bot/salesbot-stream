
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
      const { appointmentId, observacoes, nps_nota, nps_comentario } = req.body;

      if (!appointmentId) {
        return fail(res, 'MISSING_APPOINTMENT_ID', 'ID do agendamento é obrigatório', 400);
      }

      // Simula o check-out
      const checkOutData = {
        appointmentId,
        status: 'concluido',
        checkout_time: new Date().toISOString(),
        checkout_observacoes: observacoes || null,
        updated_at: new Date().toISOString()
      };

      // Se há dados de NPS, salva também
      if (nps_nota !== undefined) {
        const npsData = {
          appointment_id: appointmentId,
          nota: nps_nota,
          comentario: nps_comentario || null,
          created_at: new Date().toISOString()
        };
        
        console.log(`NPS registrado para agendamento ${appointmentId}:`, npsData);
        checkOutData.nps = npsData;
      }

      console.log(`Check-out realizado para agendamento ${appointmentId}:`, checkOutData);

      return ok(res, {
        message: 'Check-out realizado com sucesso',
        data: checkOutData
      });
    }

    return fail(res, 'METHOD_NOT_ALLOWED', 'Método não permitido', 405);

  } catch (error) {
    console.error('Erro em /api/client-portal/modulo-agenda/checkout:', error);
    return fail(res, 'INTERNAL_ERROR', 'Erro interno do servidor', 500);
  }
}
