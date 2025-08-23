
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

      // Mock de procedimentos
      const mockProcedimentos = [
        {
          id: 'proc-001',
          nome: 'Cirurgia de Catarata',
          tipo: 'cirurgia',
          paciente_id: 'pac-001',
          paciente_nome: 'João Silva',
          profissional_principal_id: 'prof-001',
          profissional_principal_nome: 'Dr. Carlos Mendes',
          equipe_ids: ['prof-002'],
          equipe_nomes: ['Dra. Ana Costa'],
          sala_id: 'sala-004',
          sala_nome: 'Centro Cirúrgico 1',
          convenio_id: 'conv-001',
          convenio_nome: 'Unimed',
          data_inicio: '2025-01-25T08:00:00',
          data_fim: '2025-01-25T10:00:00',
          duracao_estimada: 120,
          materiais: ['Lente intraocular', 'Kit de facoemulsificação', 'Sutura 10-0'],
          status: 'agendado',
          observacoes: 'Paciente em jejum 12h. Verificar exames pre-operatórios.',
          valor_estimado: 2500.00,
          created_at: '2024-01-15T08:00:00Z',
          updated_at: '2024-01-15T08:00:00Z'
        },
        {
          id: 'proc-002',
          nome: 'Biópsia de Pele',
          tipo: 'procedimento',
          paciente_id: 'pac-002',
          paciente_nome: 'Maria Santos',
          profissional_principal_id: 'prof-002',
          profissional_principal_nome: 'Dra. Ana Costa',
          equipe_ids: [],
          equipe_nomes: [],
          sala_id: 'sala-003',
          sala_nome: 'Sala de Procedimentos',
          convenio_id: 'conv-002',
          convenio_nome: 'Bradesco Saúde',
          data_inicio: '2025-01-26T14:00:00',
          data_fim: '2025-01-26T14:30:00',
          duracao_estimada: 30,
          materiais: ['Kit de biópsia', 'Anestésico local', 'Curativo'],
          status: 'agendado',
          observacoes: 'Lesão no braço direito. Enviar para patologia.',
          valor_estimado: 300.00,
          created_at: '2024-01-16T09:00:00Z',
          updated_at: '2024-01-16T09:00:00Z'
        }
      ];

      // Aplicar filtros
      let filteredProcedimentos = mockProcedimentos;
      
      // Filtros por data
      if (req.query.data_inicio) {
        filteredProcedimentos = filteredProcedimentos.filter(proc => 
          proc.data_inicio >= req.query.data_inicio
        );
      }

      if (req.query.data_fim) {
        filteredProcedimentos = filteredProcedimentos.filter(proc => 
          proc.data_fim <= req.query.data_fim
        );
      }

      // Outros filtros
      if (req.query.paciente_id) {
        filteredProcedimentos = filteredProcedimentos.filter(proc => 
          proc.paciente_id === req.query.paciente_id
        );
      }

      if (req.query.profissional_id) {
        filteredProcedimentos = filteredProcedimentos.filter(proc => 
          proc.profissional_principal_id === req.query.profissional_id ||
          proc.equipe_ids.includes(req.query.profissional_id)
        );
      }

      if (req.query.sala_id) {
        filteredProcedimentos = filteredProcedimentos.filter(proc => 
          proc.sala_id === req.query.sala_id
        );
      }

      if (req.query.tipo) {
        filteredProcedimentos = filteredProcedimentos.filter(proc => 
          proc.tipo === req.query.tipo
        );
      }

      if (req.query.status) {
        filteredProcedimentos = filteredProcedimentos.filter(proc => 
          proc.status === req.query.status
        );
      }

      // Paginação
      const startIndex = offset;
      const endIndex = offset + limit;
      const paginatedProcedimentos = filteredProcedimentos.slice(startIndex, endIndex);

      return ok(res, buildPaginationResponse(
        paginatedProcedimentos,
        filteredProcedimentos.length,
        page,
        limit
      ));
    }

    if (req.method === 'POST') {
      const procedimentoData = req.body;
      
      // Simula criação
      const newProcedimento = {
        id: `proc-${Date.now()}`,
        ...procedimentoData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return ok(res, newProcedimento, 201);
    }

    return fail(res, 'METHOD_NOT_ALLOWED', 'Método não permitido', 405);

  } catch (error) {
    console.error('Erro em /api/client-portal/modulo-agenda/procedimentos:', error);
    return fail(res, 'INTERNAL_ERROR', 'Erro interno do servidor', 500);
  }
}
