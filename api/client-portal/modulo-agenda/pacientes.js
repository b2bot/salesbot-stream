
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

      // Mock de pacientes
      const mockPacientes = [
        {
          id: 'pac-001',
          nome: 'João Silva',
          email: 'joao.silva@email.com',
          telefone: '(11) 99999-1111',
          cpf: '123.456.789-01',
          data_nascimento: '1985-05-15',
          endereco: 'Rua das Flores, 123 - São Paulo/SP',
          convenio_id: 'conv-001',
          convenio_nome: 'Unimed',
          status: 'ativo',
          created_at: '2024-01-15T08:00:00Z',
          updated_at: '2024-01-15T08:00:00Z'
        },
        {
          id: 'pac-002',
          nome: 'Maria Santos',
          email: 'maria.santos@email.com',
          telefone: '(11) 99999-2222',
          cpf: '987.654.321-09',
          data_nascimento: '1990-03-20',
          endereco: 'Av. Paulista, 456 - São Paulo/SP',
          convenio_id: 'conv-002',
          convenio_nome: 'Bradesco Saúde',
          status: 'ativo',
          created_at: '2024-01-16T09:00:00Z',
          updated_at: '2024-01-16T09:00:00Z'
        },
        {
          id: 'pac-003',
          nome: 'Pedro Oliveira',
          email: 'pedro.oliveira@email.com',
          telefone: '(11) 99999-3333',
          cpf: '456.789.123-45',
          data_nascimento: '1975-12-10',
          endereco: 'Rua Augusta, 789 - São Paulo/SP',
          convenio_id: 'conv-003',
          convenio_nome: 'Amil',
          status: 'ativo',
          created_at: '2024-01-17T10:00:00Z',
          updated_at: '2024-01-17T10:00:00Z'
        }
      ];

      // Aplicar filtros
      let filteredPacientes = mockPacientes;
      
      if (req.query.search) {
        const search = req.query.search.toLowerCase();
        filteredPacientes = filteredPacientes.filter(paciente =>
          paciente.nome.toLowerCase().includes(search) ||
          paciente.email.toLowerCase().includes(search) ||
          paciente.cpf.includes(search)
        );
      }

      if (req.query.convenio_id) {
        filteredPacientes = filteredPacientes.filter(p => p.convenio_id === req.query.convenio_id);
      }

      if (req.query.status) {
        filteredPacientes = filteredPacientes.filter(p => p.status === req.query.status);
      }

      // Paginação
      const startIndex = offset;
      const endIndex = offset + limit;
      const paginatedPacientes = filteredPacientes.slice(startIndex, endIndex);

      return ok(res, buildPaginationResponse(
        paginatedPacientes,
        filteredPacientes.length,
        page,
        limit
      ));
    }

    if (req.method === 'POST') {
      const pacienteData = req.body;
      
      // Simula criação
      const newPaciente = {
        id: `pac-${Date.now()}`,
        ...pacienteData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return ok(res, newPaciente, 201);
    }

    return fail(res, 'METHOD_NOT_ALLOWED', 'Método não permitido', 405);

  } catch (error) {
    console.error('Erro em /api/client-portal/modulo-agenda/pacientes:', error);
    return fail(res, 'INTERNAL_ERROR', 'Erro interno do servidor', 500);
  }
}
