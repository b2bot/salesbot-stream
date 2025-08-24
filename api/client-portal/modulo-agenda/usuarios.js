
import { connectMySQL } from '../_lib/mysql.js';
import { authenticateClientPortal } from '../_lib/auth.js';
import { ok, fail } from '../_lib/response.js';
import { corsHeaders } from '../_lib/cors.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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

    if (req.method === 'GET') {
      // Mock de usuários
      const mockUsuarios = [
        {
          id: 'user-001',
          nome: 'João Admin',
          email: 'admin@clinica.com',
          nivel_acesso: 'admin',
          status: 'ativo',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z'
        },
        {
          id: 'user-002',
          nome: 'Maria Recepcionista',
          email: 'recepcao@clinica.com',
          nivel_acesso: 'recepcionista',
          status: 'ativo',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z'
        },
        {
          id: 'user-003',
          nome: 'Pedro Financeiro',
          email: 'financeiro@clinica.com',
          nivel_acesso: 'financeiro',
          status: 'ativo',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z'
        }
      ];

      return ok(res, {
        items: mockUsuarios,
        total: mockUsuarios.length
      });
    }

    if (req.method === 'POST') {
      const usuarioData = req.body;
      
      // Mock de criação
      const newUsuario = {
        id: `user-${Date.now()}`,
        nome: usuarioData.nome,
        email: usuarioData.email,
        nivel_acesso: usuarioData.nivel_acesso,
        status: usuarioData.status || 'ativo',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Novo usuário criado:', newUsuario);
      return ok(res, newUsuario);
    }

    if (req.method === 'PUT') {
      const usuarioId = req.url.split('/').pop();
      const usuarioData = req.body;

      // Mock de atualização
      const updatedUsuario = {
        id: usuarioId,
        ...usuarioData,
        updated_at: new Date().toISOString()
      };

      console.log('Usuário atualizado:', updatedUsuario);
      return ok(res, updatedUsuario);
    }

    return fail(res, 'METHOD_NOT_ALLOWED', 'Método não permitido', 405);

  } catch (error) {
    console.error('Erro em /api/client-portal/modulo-agenda/usuarios:', error);
    return fail(res, 'INTERNAL_ERROR', 'Erro interno do servidor', 500);
  }
}
