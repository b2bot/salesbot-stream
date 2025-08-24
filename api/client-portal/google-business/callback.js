export const config = { runtime: 'nodejs' };
import { connectMySQL } from '../_lib/mysql.js';
import { corsMiddleware } from '../_lib/cors.js';

export default async function handler(req, res) {
  await corsMiddleware(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { code, state, error } = req.query;

    if (error) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/client-portal/modulo-agenda/google-meu-negocio?error=access_denied`);
    }

    if (!code || !state) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/client-portal/modulo-agenda/google-meu-negocio?error=invalid_request`);
    }

    // Decode state to get user info
    const { clientId, clientUserId } = JSON.parse(Buffer.from(state, 'base64').toString());

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_BUSINESS_CLIENT_ID,
        client_secret: process.env.GOOGLE_BUSINESS_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.GOOGLE_BUSINESS_REDIRECT_URI || 
          `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/client-portal/google-business/callback`
      })
    });

    const tokens = await tokenResponse.json();

    if (!tokens.access_token) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/client-portal/modulo-agenda/google-meu-negocio?error=token_exchange_failed`);
    }

    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });
    const userInfo = await userResponse.json();

    // Save to database
    const pool = connectMySQL();
    await pool.execute(
      `INSERT INTO google_business_accounts 
       (client_id, client_user_id, email, access_token, refresh_token, expires_at, connected_at, is_active)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), 1)
       ON DUPLICATE KEY UPDATE 
       access_token = VALUES(access_token),
       refresh_token = COALESCE(VALUES(refresh_token), refresh_token),
       expires_at = VALUES(expires_at),
       connected_at = NOW(),
       is_active = 1`,
      [
        clientId,
        clientUserId,
        userInfo.email,
        tokens.access_token,
        tokens.refresh_token || null,
        new Date(Date.now() + (tokens.expires_in * 1000))
      ]
    );

    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/client-portal/modulo-agenda/google-meu-negocio?success=connected`);

  } catch (error) {
    console.error('Erro no callback Google Business:', error);
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/client-portal/modulo-agenda/google-meu-negocio?error=internal_error`);
  }
}