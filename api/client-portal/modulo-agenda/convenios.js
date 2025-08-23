
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

      // Mock de convênios
      const mockConvenios = [
        {
          id: 'conv-001',
          nome: 'Unimed',
          tipo: 'plano_saude',
          status: 'ativo',
          contato_nome: 'João Santos',
          contato_telefone: '(11) 4444-1111',
          contato_email: 'joao@unimed.com.br',
          observacoes: 'Plano principal da clínica',
          created_at: '2024-01-05T08:00:00Z',
          updated_at: '2024-01-05T08:00:00Z'
        },
        {
          id: 'conv-002',
          nome: 'Bradesco Saúde',
          tipo: 'plano_saude',
          status: 'ativo',
          contato_nome: 'Maria Silva',
          contato_telefone: '(11) 4444-2222',
          contato_email: 'maria@bradescosaude.com.br',
          observacoes: 'Bom atendimento, pagamento em dia',
          created_at: '2024-01-06T08:00:00Z',
          updated_at: '2024-01-06T08:00:00Z'
        },
        {
          id: 'conv-003',
          nome: 'Particular',
          tipo: 'particular',
          status: 'ativo',
          contato_nome: null,
          contato_telefone: null,
          contato_email: null,
          observacoes: 'Pagamento direto pelo paciente',
          created_at: '2024-01-07T08:00:00Z',
          updated_at: '2024-01-07T08:00:00Z'
        }
      ];

      // Aplicar filtros
      let filteredConvenios = mockConvenios;
      
      if (req.query.search) {
        const search = req.query.search.toLowerCase();
        filteredConvenios = filteredConvenios.filter(conv =>
          conv.nome.toLowerCase().includes(search) ||
          (conv.contato_nome && conv.contato_nome.toLowerCase().includes(search))
        );
      }

      if (req.query.tipo) {
        filteredConvenios = filteredConvenios.filter(c => c.tipo === req.query.tipo);
      }

      if (req.query.status) {
        filteredConvenios = filteredConvenios.filter(c => c.status === req.query.status);
      }

      // Paginação
      const startIndex = offset;
      const endIndex = offset + limit;
      const paginatedConvenios = filteredConvenios.slice(startIndex, endIndex);

      return ok(res, buildPaginationResponse(
        paginatedConvenios,
        filteredConvenios.length,
        page,
        limit
      ));
    }

    if (req.method === 'POST') {
      const convenioData = req.body;
      
      // Simula criação
      const newConvenio = {
        id: `conv-${Date.now()}`,
        ...convenioData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return ok(res, newConvenio, 201);
    }

    return fail(res, 'METHOD_NOT_ALLOWED', 'Método não permitido', 405);

  } catch (error) {
    console.error('Erro em /api/client-portal/modulo-agenda/convenios:', error);
    return fail(res, 'INTERNAL_ERROR', 'Erro interno do servidor', 500);
  }
}
