
import { connectMySQL } from '../_lib/mysql.js';
import { authenticateClientPortal } from '../_lib/auth.js';
import { ok, fail } from '../_lib/response.js';
import { corsHeaders } from '../_lib/cors.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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
      // Mock de dados NPS
      const mockNpsRecords = [
        {
          id: 'nps-001',
          patientName: 'João Silva',
          professionalName: 'Dr. Carlos Mendes',
          score: 9,
          comment: 'Excelente atendimento! Dr. Carlos foi muito atencioso e explicou tudo detalhadamente.',
          createdAt: '2025-01-20T14:30:00Z',
          appointmentId: 'apt-001'
        },
        {
          id: 'nps-002',
          patientName: 'Maria Santos',
          professionalName: 'Dra. Ana Costa',
          score: 10,
          comment: 'Perfeito! A doutora é muito competente e o atendimento foi rápido.',
          createdAt: '2025-01-21T10:15:00Z',
          appointmentId: 'apt-002'
        },
        {
          id: 'nps-003',
          patientName: 'Pedro Oliveira',
          professionalName: 'Dr. José Silva',
          score: 8,
          comment: 'Bom profissional, mas a consulta demorou um pouco para começar.',
          createdAt: '2025-01-22T16:45:00Z',
          appointmentId: 'apt-003'
        },
        {
          id: 'nps-004',
          patientName: 'Ana Rodrigues',
          professionalName: 'Dr. Carlos Mendes',
          score: 10,
          comment: 'Sempre excelente! Dr. Carlos é muito cuidadoso e dedicado.',
          createdAt: '2025-01-23T11:20:00Z',
          appointmentId: 'apt-004'
        },
        {
          id: 'nps-005',
          patientName: 'Carlos Pereira',
          professionalName: 'Dra. Ana Costa',
          score: 7,
          comment: 'Atendimento bom, mas o tempo de espera foi um pouco longo.',
          createdAt: '2025-01-23T15:30:00Z',
          appointmentId: 'apt-005'
        },
        {
          id: 'nps-006',
          patientName: 'Lucia Santos',
          professionalName: 'Dr. José Silva',
          score: 9,
          comment: 'Procedimento realizado com muito cuidado. Recomendo!',
          createdAt: '2025-01-24T09:10:00Z',
          appointmentId: 'apt-006'
        }
      ];

      // Calcula estatísticas
      const totalResponses = mockNpsRecords.length;
      const averageScore = mockNpsRecords.reduce((sum, record) => sum + record.score, 0) / totalResponses;
      const promoters = mockNpsRecords.filter(record => record.score >= 9).length;
      const passives = mockNpsRecords.filter(record => record.score >= 7 && record.score <= 8).length;
      const detractors = mockNpsRecords.filter(record => record.score <= 6).length;
      const npsScore = Math.round(((promoters - detractors) / totalResponses) * 100);

      const stats = {
        totalResponses,
        averageScore: Math.round(averageScore * 10) / 10,
        promoters,
        passives,
        detractors,
        npsScore
      };

      return ok(res, {
        records: mockNpsRecords,
        stats,
        page: 1,
        limit: 10,
        total: totalResponses,
        hasMore: false
      });
    }

    if (req.method === 'POST') {
      const { appointmentId, score, comment } = req.body;

      if (!appointmentId || !score || score < 0 || score > 10) {
        return fail(res, 'INVALID_DATA', 'Dados inválidos', 400);
      }

      // Mock de criação de NPS
      const newNps = {
        id: `nps-${Date.now()}`,
        patientName: 'Novo Paciente',
        professionalName: 'Dr. Exemplo',
        score: parseInt(score),
        comment: comment || null,
        createdAt: new Date().toISOString(),
        appointmentId
      };

      return ok(res, newNps, 201);
    }

    return fail(res, 'METHOD_NOT_ALLOWED', 'Método não permitido', 405);

  } catch (error) {
    console.error('Erro em /api/client-portal/modulo-agenda/nps:', error);
    return fail(res, 'INTERNAL_ERROR', 'Erro interno do servidor', 500);
  }
}
