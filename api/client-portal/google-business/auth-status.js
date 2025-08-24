export const config = { runtime: 'nodejs' };
import { authenticateClientPortal } from '../_lib/auth.js';
import { connectMySQL } from '../_lib/mysql.js';
import { corsMiddleware } from '../_lib/cors.js';
import { handleResponse } from '../_lib/response.js';

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
    const pool = connectMySQL();

    const [rows] = await pool.execute(
      `SELECT id, email, connected_at, last_sync_at 
       FROM google_business_accounts 
       WHERE client_id = ? AND client_user_id = ? AND is_active = 1
       ORDER BY connected_at DESC LIMIT 1`,
      [clientId, clientUserId]
    );

    if (rows.length === 0) {
      return handleResponse(res, 200, { 
        connected: false 
      });
    }

    const account = rows[0];
    return handleResponse(res, 200, {
      connected: true,
      email: account.email,
      lastSync: account.last_sync_at
    });

  } catch (error) {
    console.error('Erro ao verificar status Google Business:', error);
    return handleResponse(res, 500, { error: 'Erro interno do servidor' });
  }
}