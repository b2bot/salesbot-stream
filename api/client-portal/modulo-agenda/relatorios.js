
import { connectMySQL } from '../_lib/mysql.js';
import { authenticateClientPortal } from '../_lib/auth.js';
import { ok, fail } from '../_lib/response.js';
import { corsHeaders } from '../_lib/cors.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
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
    const { startDate, endDate, groupBy = 'professional' } = req.query;

    if (req.method === 'GET') {
      // Mock de dados de relatório
      const mockReportData = {
        professional: [
          {
            label: 'Dr. Carlos Mendes',
            totalAtendimentos: 45,
            atendimentosRealizados: 42,
            atendimentosCancelados: 3,
            receita: 12600.00,
            tempoMedioAtendimento: 35
          },
          {
            label: 'Dra. Ana Costa',
            totalAtendimentos: 38,
            atendimentosRealizados: 36,
            atendimentosCancelados: 2,
            receita: 9800.00,
            tempoMedioAtendimento: 28
          },
          {
            label: 'Dr. José Silva',
            totalAtendimentos: 32,
            atendimentosRealizados: 28,
            atendimentosCancelados: 4,
            receita: 8400.00,
            tempoMedioAtendimento: 42
          },
          {
            label: 'Dra. Maria Oliveira',
            totalAtendimentos: 29,
            atendimentosRealizados: 27,
            atendimentosCancelados: 2,
            receita: 7350.00,
            tempoMedioAtendimento: 30
          }
        ],
        specialty: [
          {
            label: 'Cardiologia',
            totalAtendimentos: 45,
            atendimentosRealizados: 42,
            atendimentosCancelados: 3,
            receita: 12600.00,
            tempoMedioAtendimento: 35
          },
          {
            label: 'Dermatologia',
            totalAtendimentos: 38,
            atendimentosRealizados: 36,
            atendimentosCancelados: 2,
            receita: 9800.00,
            tempoMedioAtendimento: 28
          },
          {
            label: 'Ortopedia',
            totalAtendimentos: 32,
            atendimentosRealizados: 28,
            atendimentosCancelados: 4,
            receita: 8400.00,
            tempoMedioAtendimento: 42
          },
          {
            label: 'Ginecologia',
            totalAtendimentos: 29,
            atendimentosRealizados: 27,
            atendimentosCancelados: 2,
            receita: 7350.00,
            tempoMedioAtendimento: 30
          }
        ],
        insurance: [
          {
            label: 'Unimed',
            totalAtendimentos: 52,
            atendimentosRealizados: 48,
            atendimentosCancelados: 4,
            receita: 14040.00,
            tempoMedioAtendimento: 33
          },
          {
            label: 'Bradesco Saúde',
            totalAtendimentos: 34,
            atendimentosRealizados: 32,
            atendimentosCancelados: 2,
            receita: 8840.00,
            tempoMedioAtendimento: 31
          },
          {
            label: 'Amil',
            totalAtendimentos: 28,
            atendimentosRealizados: 26,
            atendimentosCancelados: 2,
            receita: 7280.00,
            tempoMedioAtendimento: 29
          },
          {
            label: 'Particular',
            totalAtendimentos: 22,
            atendimentosRealizados: 21,
            atendimentosCancelados: 1,
            receita: 8190.00,
            tempoMedioAtendimento: 38
          }
        ],
        location: [
          {
            label: 'Consultório 1',
            totalAtendimentos: 45,
            atendimentosRealizados: 42,
            atendimentosCancelados: 3,
            receita: 12600.00,
            tempoMedioAtendimento: 35
          },
          {
            label: 'Consultório 2',
            totalAtendimentos: 38,
            atendimentosRealizados: 36,
            atendimentosCancelados: 2,
            receita: 9800.00,
            tempoMedioAtendimento: 28
          },
          {
            label: 'Sala de Procedimentos',
            totalAtendimentos: 25,
            atendimentosRealizados: 23,
            atendimentosCancelados: 2,
            receita: 9200.00,
            tempoMedioAtendimento: 45
          },
          {
            label: 'Centro Cirúrgico 1',
            totalAtendimentos: 12,
            atendimentosRealizados: 11,
            atendimentosCancelados: 1,
            receita: 6600.00,
            tempoMedioAtendimento: 120
          }
        ],
        day: [
          {
            label: '20/01/2025',
            totalAtendimentos: 24,
            atendimentosRealizados: 22,
            atendimentosCancelados: 2,
            receita: 6400.00,
            tempoMedioAtendimento: 32
          },
          {
            label: '21/01/2025',
            totalAtendimentos: 28,
            atendimentosRealizados: 26,
            atendimentosCancelados: 2,
            receita: 7200.00,
            tempoMedioAtendimento: 35
          },
          {
            label: '22/01/2025',
            totalAtendimentos: 32,
            atendimentosRealizados: 30,
            atendimentosCancelados: 2,
            receita: 8100.00,
            tempoMedioAtendimento: 29
          },
          {
            label: '23/01/2025',
            totalAtendimentos: 26,
            atendimentosRealizados: 24,
            atendimentosCancelados: 2,
            receita: 6800.00,
            tempoMedioAtendimento: 31
          }
        ]
      };

      const items = mockReportData[groupBy] || mockReportData.professional;
      
      // Calcula o resumo
      const summary = {
        totalAtendimentos: items.reduce((sum, item) => sum + item.totalAtendimentos, 0),
        atendimentosRealizados: items.reduce((sum, item) => sum + item.atendimentosRealizados, 0),
        atendimentosCancelados: items.reduce((sum, item) => sum + item.atendimentosCancelados, 0),
        receitaTotal: items.reduce((sum, item) => sum + item.receita, 0),
        tempoMedioGeral: Math.round(items.reduce((sum, item) => sum + item.tempoMedioAtendimento, 0) / items.length)
      };

      return ok(res, { items, summary });
    }

    return fail(res, 'METHOD_NOT_ALLOWED', 'Método não permitido', 405);

  } catch (error) {
    console.error('Erro em /api/client-portal/modulo-agenda/relatorios:', error);
    return fail(res, 'INTERNAL_ERROR', 'Erro interno do servidor', 500);
  }
}
