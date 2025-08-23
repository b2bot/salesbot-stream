
import { authenticateClientPortal } from '../_lib/auth.js';
import { ok, fail } from '../_lib/response.js';
import { corsHeaders } from '../_lib/cors.js';
import { normalizePagination, buildPaginationResponse } from '../_lib/pagination.js';

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
      const { page, limit, offset } = normalizePagination(req.query);

      // Mock de profissionais
      const mockProfissionais = [
        {
          id: 'prof-001',
          nome: 'Dr. Carlos Mendes',
          email: 'carlos.mendes@clinica.com',
          telefone: '(11) 3333-1111',
          cpf: '111.222.333-44',
          crm: 'CRM/SP 123456',
          especialidade_id: 'esp-001',
          especialidade_nome: 'Cardiologia',
          status: 'ativo',
          cor_agenda: '#8B5CF6',
          created_at: '2024-01-10T08:00:00Z',
          updated_at: '2024-01-10T08:00:00Z'
        },
        {
          id: 'prof-002',
          nome: 'Dra. Ana Costa',
          email: 'ana.costa@clinica.com',
          telefone: '(11) 3333-2222',
          cpf: '222.333.444-55',
          crm: 'CRM/SP 654321',
          especialidade_id: 'esp-002',
          especialidade_nome: 'Dermatologia',
          status: 'ativo',
          cor_agenda: '#F59E0B',
          created_at: '2024-01-11T08:00:00Z',
          updated_at: '2024-01-11T08:00:00Z'
        },
        {
          id: 'prof-003',
          nome: 'Dr. José Silva',
          email: 'jose.silva@clinica.com',
          telefone: '(11) 3333-3333',
          cpf: '333.444.555-66',
          crm: 'CRM/SP 789123',
          especialidade_id: 'esp-003',
          especialidade_nome: 'Ortopedia',
          status: 'ativo',
          cor_agenda: '#3B82F6',
          created_at: '2024-01-12T08:00:00Z',
          updated_at: '2024-01-12T08:00:00Z'
        }
      ];

      // Aplicar filtros
      let filteredProfissionais = mockProfissionais;
      
      if (req.query.search) {
        const search = req.query.search.toLowerCase();
        filteredProfissionais = filteredProfissionais.filter(prof =>
          prof.nome.toLowerCase().includes(search) ||
          prof.especialidade_nome.toLowerCase().includes(search) ||
          prof.crm.toLowerCase().includes(search)
        );
      }

      if (req.query.especialidade_id) {
        filteredProfissionais = filteredProfissionais.filter(p => 
          p.especialidade_id === req.query.especialidade_id
        );
      }

      if (req.query.status) {
        filteredProfissionais = filteredProfissionais.filter(p => p.status === req.query.status);
      }

      // Paginação
      const startIndex = offset;
      const endIndex = offset + limit;
      const paginatedProfissionais = filteredProfissionais.slice(startIndex, endIndex);

      return ok(res, buildPaginationResponse(
        paginatedProfissionais,
        filteredProfissionais.length,
        page,
        limit
      ));
    }

    if (req.method === 'POST') {
      const profissionalData = req.body;
      
      // Simula criação
      const newProfissional = {
        id: `prof-${Date.now()}`,
        ...profissionalData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return ok(res, newProfissional, 201);
    }

    return fail(res, 'METHOD_NOT_ALLOWED', 'Método não permitido', 405);

  } catch (error) {
    console.error('Erro em /api/client-portal/modulo-agenda/profissionais:', error);
    return fail(res, 'INTERNAL_ERROR', 'Erro interno do servidor', 500);
  }
}
