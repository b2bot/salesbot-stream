
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

      // Mock de salas/unidades
      const mockSalas = [
        {
          id: 'sala-001',
          nome: 'Consultório 1',
          tipo: 'consultorio',
          localizacao: 'Térreo - Ala A',
          capacidade: 1,
          equipamentos: 'Mesa, cadeiras, maca, negatoscópio',
          status: 'ativo',
          observacoes: 'Consultório principal para cardiologia',
          created_at: '2024-01-08T08:00:00Z',
          updated_at: '2024-01-08T08:00:00Z'
        },
        {
          id: 'sala-002',
          nome: 'Consultório 2',
          tipo: 'consultorio',
          localizacao: 'Térreo - Ala A',
          capacidade: 1,
          equipamentos: 'Mesa, cadeiras, maca, dermatoscópio',
          status: 'ativo',
          observacoes: 'Consultório equipado para dermatologia',
          created_at: '2024-01-09T08:00:00Z',
          updated_at: '2024-01-09T08:00:00Z'
        },
        {
          id: 'sala-003',
          nome: 'Sala de Procedimentos',
          tipo: 'sala_procedimento',
          localizacao: 'Térreo - Ala B',
          capacidade: 2,
          equipamentos: 'Maca cirúrgica, foco, carrinho de materiais, monitor',
          status: 'ativo',
          observacoes: 'Para pequenos procedimentos ambulatoriais',
          created_at: '2024-01-10T08:00:00Z',
          updated_at: '2024-01-10T08:00:00Z'
        },
        {
          id: 'sala-004',
          nome: 'Centro Cirúrgico 1',
          tipo: 'centro_cirurgico',
          localizacao: '2º Andar',
          capacidade: 4,
          equipamentos: 'Mesa cirúrgica, focos, anestesia, monitor multiparâmetros',
          status: 'ativo',
          observacoes: 'Centro cirúrgico completo',
          created_at: '2024-01-11T08:00:00Z',
          updated_at: '2024-01-11T08:00:00Z'
        }
      ];

      // Aplicar filtros
      let filteredSalas = mockSalas;
      
      if (req.query.search) {
        const search = req.query.search.toLowerCase();
        filteredSalas = filteredSalas.filter(sala =>
          sala.nome.toLowerCase().includes(search) ||
          sala.localizacao.toLowerCase().includes(search)
        );
      }

      if (req.query.tipo) {
        filteredSalas = filteredSalas.filter(s => s.tipo === req.query.tipo);
      }

      if (req.query.status) {
        filteredSalas = filteredSalas.filter(s => s.status === req.query.status);
      }

      // Paginação
      const startIndex = offset;
      const endIndex = offset + limit;
      const paginatedSalas = filteredSalas.slice(startIndex, endIndex);

      return ok(res, buildPaginationResponse(
        paginatedSalas,
        filteredSalas.length,
        page,
        limit
      ));
    }

    if (req.method === 'POST') {
      const salaData = req.body;
      
      // Simula criação
      const newSala = {
        id: `sala-${Date.now()}`,
        ...salaData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return ok(res, newSala, 201);
    }

    return fail(res, 'METHOD_NOT_ALLOWED', 'Método não permitido', 405);

  } catch (error) {
    console.error('Erro em /api/client-portal/modulo-agenda/salas-unidades:', error);
    return fail(res, 'INTERNAL_ERROR', 'Erro interno do servidor', 500);
  }
}
