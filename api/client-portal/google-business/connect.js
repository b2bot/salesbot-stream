export const config = { runtime: 'nodejs' };
import { authenticateClientPortal } from '../_lib/auth.js';
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

    // Google OAuth2 configuration
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_BUSINESS_CLIENT_ID;
    const GOOGLE_REDIRECT_URI = process.env.GOOGLE_BUSINESS_REDIRECT_URI || 
      `${process.env.VERCEL_URL || 'http://localhost:3000'}/api/client-portal/google-business/callback`;

    if (!GOOGLE_CLIENT_ID) {
      return handleResponse(res, 500, { error: 'Configuração OAuth não encontrada' });
    }

    const scopes = [
      'https://www.googleapis.com/auth/business.manage',
      'https://www.googleapis.com/auth/plus.business.manage'
    ].join(' ');

    const state = Buffer.from(JSON.stringify({ clientId, clientUserId })).toString('base64');

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URI);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', scopes);
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');
    authUrl.searchParams.set('state', state);

    return handleResponse(res, 200, {
      authUrl: authUrl.toString()
    });

  } catch (error) {
    console.error('Erro ao iniciar conexão Google Business:', error);
    return handleResponse(res, 500, { error: 'Erro interno do servidor' });
  }
}