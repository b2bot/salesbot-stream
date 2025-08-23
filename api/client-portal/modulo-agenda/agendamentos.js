
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

      // Mock de agendamentos
      const mockAgendamentos = [
        {
          id: 'ag-001',
          paciente_id: 'pac-001',
          paciente_nome: 'João Silva',
          profissional_id: 'prof-001',
          profissional_nome: 'Dr. Carlos Mendes',
          convenio_id: 'conv-001',
          convenio_nome: 'Unimed',
          sala_id: 'sala-001',
          sala_nome: 'Consultório 1',
          data_inicio: '2025-01-24T09:00:00',
          data_fim: '2025-01-24T09:30:00',
          tipo: 'consulta',
          status: 'agendado',
          observacoes: 'Consulta de rotina',
          valor: 150.00,
          created_at: '2024-01-20T08:00:00Z',
          updated_at: '2024-01-20T08:00:00Z'
        },
        {
          id: 'ag-002',
          paciente_id: 'pac-002',
          paciente_nome: 'Maria Santos',
          profissional_id: 'prof-002',
          profissional_nome: 'Dra. Ana Costa',
          convenio_id: 'conv-002',
          convenio_nome: 'Bradesco Saúde',
          sala_id: 'sala-002',
          sala_nome: 'Consultório 2',
          data_inicio: '2025-01-24T10:00:00',
          data_fim: '2025-01-24T10:30:00',
          tipo: 'consulta',
          status: 'confirmado',
          observacoes: 'Retorno dermatologia',
          valor: 200.00,
          created_at: '2024-01-21T09:00:00Z',
          updated_at: '2024-01-21T09:00:00Z'
        }
      ];

      // Aplicar filtros
      let filteredAgendamentos = mockAgendamentos;
      
      // Filtros por data
      if (req.query.data_inicio) {
        filteredAgendamentos = filteredAgendamentos.filter(ag => 
          ag.data_inicio >= req.query.data_inicio
        );
      }

      if (req.query.data_fim) {
        filteredAgendamentos = filteredAgendamentos.filter(ag => 
          ag.data_fim <= req.query.data_fim
        );
      }

      // Outros filtros
      if (req.query.paciente_id) {
        filteredAgendamentos = filteredAgendamentos.filter(ag => 
          ag.paciente_id === req.query.paciente_id
        );
      }

      if (req.query.profissional_id) {
        filteredAgendamentos = filteredAgendamentos.filter(ag => 
          ag.profissional_id === req.query.profissional_id
        );
      }

      if (req.query.status) {
        filteredAgendamentos = filteredAgendamentos.filter(ag => 
          ag.status === req.query.status
        );
      }

      if (req.query.tipo) {
        filteredAgendamentos = filteredAgendamentos.filter(ag => 
          ag.tipo === req.query.tipo
        );
      }

      // Paginação
      const startIndex = offset;
      const endIndex = offset + limit;
      const paginatedAgendamentos = filteredAgendamentos.slice(startIndex, endIndex);

      return ok(res, buildPaginationResponse(
        paginatedAgendamentos,
        filteredAgendamentos.length,
        page,
        limit
      ));
    }

    if (req.method === 'POST') {
      const agendamentoData = req.body;
      
      // Simula criação
      const newAgendamento = {
        id: `ag-${Date.now()}`,
        ...agendamentoData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return ok(res, newAgendamento, 201);
    }

    return fail(res, 'METHOD_NOT_ALLOWED', 'Método não permitido', 405);

  } catch (error) {
    console.error('Erro em /api/client-portal/modulo-agenda/agendamentos:', error);
    return fail(res, 'INTERNAL_ERROR', 'Erro interno do servidor', 500);
  }
}
