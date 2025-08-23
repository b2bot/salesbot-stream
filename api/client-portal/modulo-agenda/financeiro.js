
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

    if (req.method === 'GET') {
      // Mock de dados financeiros
      const mockFinanceiroData = {
        contas: [
          {
            id: 'conta-001',
            description: 'Consulta Cardiologia - João Silva',
            value: 280.00,
            dueDate: '2025-01-25',
            status: 'pending',
            type: 'receivable',
            professionalName: 'Dr. Carlos Mendes',
            patientName: 'João Silva',
            appointmentId: 'apt-001'
          },
          {
            id: 'conta-002',
            description: 'Consulta Dermatologia - Maria Santos',
            value: 250.00,
            dueDate: '2025-01-26',
            status: 'paid',
            type: 'receivable',
            professionalName: 'Dra. Ana Costa',
            patientName: 'Maria Santos',
            appointmentId: 'apt-002'
          },
          {
            id: 'conta-003',
            description: 'Material Cirúrgico - Fornecedor XYZ',
            value: 1200.00,
            dueDate: '2025-01-30',
            status: 'pending',
            type: 'payable',
            professionalName: null,
            patientName: null,
            appointmentId: null
          },
          {
            id: 'conta-004',
            description: 'Procedimento Ortopedia - Pedro Oliveira',
            value: 450.00,
            dueDate: '2025-01-27',
            status: 'paid',
            type: 'receivable',
            professionalName: 'Dr. José Silva',
            patientName: 'Pedro Oliveira',
            appointmentId: 'apt-003'
          },
          {
            id: 'conta-005',
            description: 'Aluguel Equipamento - Fornecedor ABC',
            value: 800.00,
            dueDate: '2025-02-01',
            status: 'pending',
            type: 'payable',
            professionalName: null,
            patientName: null,
            appointmentId: null
          }
        ],
        rateios: [
          {
            professional: 'Dr. Carlos Mendes',
            specialty: 'Cardiologia',
            grossRevenue: 12600.00,
            fees: 1890.00,
            netRevenue: 10710.00,
            percentage: 35.2
          },
          {
            professional: 'Dra. Ana Costa',
            specialty: 'Dermatologia',
            grossRevenue: 9800.00,
            fees: 1470.00,
            netRevenue: 8330.00,
            percentage: 27.8
          },
          {
            professional: 'Dr. José Silva',
            specialty: 'Ortopedia',
            grossRevenue: 8400.00,
            fees: 1260.00,
            netRevenue: 7140.00,
            percentage: 23.6
          },
          {
            professional: 'Dra. Maria Oliveira',
            specialty: 'Ginecologia',
            grossRevenue: 7350.00,
            fees: 1102.50,
            netRevenue: 6247.50,
            percentage: 20.8
          }
        ],
        projecoes: [
          {
            date: '2025-01-25',
            consultations: 18,
            procedures: 3,
            estimatedRevenue: 4850.00,
            confirmedRevenue: 4200.00
          },
          {
            date: '2025-01-26',
            consultations: 16,
            procedures: 2,
            estimatedRevenue: 4100.00,
            confirmedRevenue: 3950.00
          },
          {
            date: '2025-01-27',
            consultations: 22,
            procedures: 4,
            estimatedRevenue: 5680.00,
            confirmedRevenue: 5100.00
          },
          {
            date: '2025-01-28',
            consultations: 20,
            procedures: 5,
            estimatedRevenue: 6200.00,
            confirmedRevenue: 5400.00
          },
          {
            date: '2025-01-29',
            consultations: 24,
            procedures: 3,
            estimatedRevenue: 5900.00,
            confirmedRevenue: 5650.00
          },
          {
            date: '2025-01-30',
            consultations: 19,
            procedures: 6,
            estimatedRevenue: 6750.00,
            confirmedRevenue: 5900.00
          }
        ]
      };

      // Calcula resumo
      const totalReceivable = mockFinanceiroData.contas
        .filter(conta => conta.type === 'receivable')
        .reduce((sum, conta) => sum + conta.value, 0);

      const totalPayable = mockFinanceiroData.contas
        .filter(conta => conta.type === 'payable')
        .reduce((sum, conta) => sum + conta.value, 0);

      const projectedRevenue = mockFinanceiroData.projecoes
        .reduce((sum, projecao) => sum + projecao.estimatedRevenue, 0);

      const summary = {
        totalReceivable,
        totalPayable,
        netBalance: totalReceivable - totalPayable,
        projectedRevenue
      };

      return ok(res, {
        ...mockFinanceiroData,
        summary
      });
    }

    return fail(res, 'METHOD_NOT_ALLOWED', 'Método não permitido', 405);

  } catch (error) {
    console.error('Erro em /api/client-portal/modulo-agenda/financeiro:', error);
    return fail(res, 'INTERNAL_ERROR', 'Erro interno do servidor', 500);
  }
}
