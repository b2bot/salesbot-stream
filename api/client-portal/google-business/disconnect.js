export const config = { runtime: 'nodejs' };
import { authenticateClientPortal } from '../_lib/auth.js';
import { connectMySQL } from '../_lib/mysql.js';
import { corsMiddleware } from '../_lib/cors.js';
import { handleResponse } from '../_lib/response.js';

export default async function handler(req, res) {
  await corsMiddleware(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const auth = await authenticateClientPortal(req);
    if (!auth.success) {
      return handleResponse(res, 401, { error: auth.error });
    }

    const { clientId, clientUserId } = auth.data;
    const pool = connectMySQL();

    // Deactivate account
    await pool.execute(
      `UPDATE google_business_accounts 
       SET is_active = 0, disconnected_at = NOW()
       WHERE client_id = ? AND client_user_id = ?`,
      [clientId, clientUserId]
    );

    return handleResponse(res, 200, { success: true });

  } catch (error) {
    console.error('Erro ao desconectar Google Business:', error);
    return handleResponse(res, 500, { error: 'Erro interno do servidor' });
  }
}