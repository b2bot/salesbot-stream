
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
      // Mock dos filtros disponíveis
      const mockFilters = {
        professionals: [
          {
            id: 'dr-carlos',
            name: 'Dr. Carlos Mendes',
            specialty: 'Cardiologia',
            color: '#8B5CF6'
          },
          {
            id: 'dra-ana',
            name: 'Dra. Ana Costa',
            specialty: 'Dermatologia',
            color: '#F59E0B'
          },
          {
            id: 'dr-jose',
            name: 'Dr. José Silva',
            specialty: 'Ortopedia',
            color: '#3B82F6'
          },
          {
            id: 'dra-maria',
            name: 'Dra. Maria Oliveira',
            specialty: 'Ginecologia',
            color: '#10B981'
          }
        ],
        specialties: [
          {
            id: 'cardiologia',
            name: 'Cardiologia',
            color: '#8B5CF6'
          },
          {
            id: 'dermatologia',
            name: 'Dermatologia',
            color: '#F59E0B'
          },
          {
            id: 'ortopedia',
            name: 'Ortopedia',
            color: '#3B82F6'
          },
          {
            id: 'ginecologia',
            name: 'Ginecologia',
            color: '#10B981'
          },
          {
            id: 'pediatria',
            name: 'Pediatria',
            color: '#EF4444'
          }
        ],
        insurances: [
          {
            id: 'unimed',
            name: 'Unimed',
            color: '#059669'
          },
          {
            id: 'bradesco',
            name: 'Bradesco Saúde',
            color: '#DC2626'
          },
          {
            id: 'amil',
            name: 'Amil',
            color: '#7C3AED'
          },
          {
            id: 'sulamerica',
            name: 'SulAmérica',
            color: '#0891B2'
          },
          {
            id: 'particular',
            name: 'Particular',
            color: '#6B7280'
          }
        ],
        locations: [
          {
            id: 'consultorio-1',
            name: 'Consultório 1',
            address: 'Térreo - Ala A'
          },
          {
            id: 'consultorio-2',
            name: 'Consultório 2',
            address: 'Térreo - Ala A'
          },
          {
            id: 'consultorio-3',
            name: 'Consultório 3',
            address: '1º Andar - Ala B'
          },
          {
            id: 'sala-procedimentos',
            name: 'Sala de Procedimentos',
            address: 'Térreo - Ala B'
          },
          {
            id: 'centro-cirurgico-1',
            name: 'Centro Cirúrgico 1',
            address: '2º Andar'
          },
          {
            id: 'centro-cirurgico-2',
            name: 'Centro Cirúrgico 2',
            address: '2º Andar'
          }
        ]
      };

      return ok(res, mockFilters);
    }

    return fail(res, 'METHOD_NOT_ALLOWED', 'Método não permitido', 405);

  } catch (error) {
    console.error('Erro em /api/client-portal/modulo-agenda/filters:', error);
    return fail(res, 'INTERNAL_ERROR', 'Erro interno do servidor', 500);
  }
}
