
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
      // Mock de especialidades
      const mockEspecialidades = [
        {
          id: 'esp-001',
          nome: 'Cardiologia',
          descricao: 'Especialidade médica que cuida do coração',
          status: 'ativa',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z'
        },
        {
          id: 'esp-002',
          nome: 'Dermatologia',
          descricao: 'Especialidade médica que cuida da pele',
          status: 'ativa',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z'
        },
        {
          id: 'esp-003',
          nome: 'Ortopedia',
          descricao: 'Especialidade médica que cuida dos ossos e articulações',
          status: 'ativa',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z'
        }
      ];

      return ok(res, {
        items: mockEspecialidades,
        total: mockEspecialidades.length
      });
    }

    if (req.method === 'POST') {
      const especialidadeData = req.body;
      
      // Mock de criação
      const newEspecialidade = {
        id: `esp-${Date.now()}`,
        ...especialidadeData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Nova especialidade criada:', newEspecialidade);
      return ok(res, newEspecialidade);
    }

    if (req.method === 'PUT') {
      const especialidadeId = req.url.split('/').pop();
      const especialidadeData = req.body;

      // Mock de atualização
      const updatedEspecialidade = {
        id: especialidadeId,
        ...especialidadeData,
        updated_at: new Date().toISOString()
      };

      console.log('Especialidade atualizada:', updatedEspecialidade);
      return ok(res, updatedEspecialidade);
    }

    return fail(res, 'METHOD_NOT_ALLOWED', 'Método não permitido', 405);

  } catch (error) {
    console.error('Erro em /api/client-portal/modulo-agenda/especialidades:', error);
    return fail(res, 'INTERNAL_ERROR', 'Erro interno do servidor', 500);
  }
}
