
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
      // Mock de eventos da agenda
      const mockEvents = [
        {
          id: 'evt-001',
          title: 'João Silva - Dr. Carlos Mendes',
          start: '2025-01-24T09:00:00',
          end: '2025-01-24T09:30:00',
          patientName: 'João Silva',
          professionalName: 'Dr. Carlos Mendes',
          specialty: 'Cardiologia',
          status: 'scheduled',
          type: 'consultation',
          location: 'Consultório 1',
          insurance: 'Unimed',
          backgroundColor: '#8B5CF6',
          borderColor: '#8B5CF6',
        },
        {
          id: 'evt-002',
          title: 'Maria Santos - Dra. Ana Costa',
          start: '2025-01-24T10:00:00',
          end: '2025-01-24T10:30:00',
          patientName: 'Maria Santos',
          professionalName: 'Dra. Ana Costa',
          specialty: 'Dermatologia',
          status: 'in_progress',
          type: 'consultation',
          location: 'Consultório 2',
          insurance: 'Bradesco Saúde',
          backgroundColor: '#F59E0B',
          borderColor: '#F59E0B',
        },
        {
          id: 'evt-003',
          title: 'Pedro Oliveira - Dr. José Silva',
          start: '2025-01-24T14:00:00',
          end: '2025-01-24T15:00:00',
          patientName: 'Pedro Oliveira',
          professionalName: 'Dr. José Silva',
          specialty: 'Ortopedia',
          status: 'scheduled',
          type: 'procedure',
          location: 'Sala de Procedimentos',
          insurance: 'Amil',
          backgroundColor: '#3B82F6',
          borderColor: '#3B82F6',
        },
        {
          id: 'evt-004',
          title: 'Ana Rodrigues - Dr. Carlos Mendes',
          start: '2025-01-24T15:30:00',
          end: '2025-01-24T16:00:00',
          patientName: 'Ana Rodrigues',
          professionalName: 'Dr. Carlos Mendes',
          specialty: 'Cardiologia',
          status: 'completed',
          type: 'consultation',
          location: 'Consultório 1',
          insurance: 'SulAmérica',
          backgroundColor: '#10B981',
          borderColor: '#10B981',
        },
        {
          id: 'evt-005',
          title: 'Carlos Pereira - Dra. Ana Costa',
          start: '2025-01-25T08:30:00',
          end: '2025-01-25T09:00:00',
          patientName: 'Carlos Pereira',
          professionalName: 'Dra. Ana Costa',
          specialty: 'Dermatologia',
          status: 'scheduled',
          type: 'consultation',
          location: 'Consultório 2',
          insurance: 'Particular',
          backgroundColor: '#8B5CF6',
          borderColor: '#8B5CF6',
        },
        {
          id: 'evt-006',
          title: 'Lucia Santos - Dr. José Silva',
          start: '2025-01-25T10:00:00',
          end: '2025-01-25T12:00:00',
          patientName: 'Lucia Santos',
          professionalName: 'Dr. José Silva',
          specialty: 'Ortopedia',
          status: 'scheduled',
          type: 'surgery',
          location: 'Centro Cirúrgico 1',
          insurance: 'Unimed',
          backgroundColor: '#DC2626',
          borderColor: '#DC2626',
        },
      ];

      // Simula filtros (em produção, seria aplicado no banco)
      let filteredEvents = mockEvents;

      const { professionalIds, specialtyIds, insuranceIds, locationIds, status, type } = req.query;

      if (professionalIds) {
        const ids = Array.isArray(professionalIds) ? professionalIds : [professionalIds];
        // Simula filtro por profissional (em produção seria JOIN com tabela professionals)
        filteredEvents = filteredEvents.filter(event => 
          ids.some(id => event.professionalName.toLowerCase().includes(id))
        );
      }

      if (status) {
        const statusArray = Array.isArray(status) ? status : [status];
        filteredEvents = filteredEvents.filter(event => statusArray.includes(event.status));
      }

      if (type) {
        const typeArray = Array.isArray(type) ? type : [type];
        filteredEvents = filteredEvents.filter(event => typeArray.includes(event.type));
      }

      return ok(res, filteredEvents);
    }

    return fail(res, 'METHOD_NOT_ALLOWED', 'Método não permitido', 405);

  } catch (error) {
    console.error('Erro em /api/client-portal/modulo-agenda/events:', error);
    return fail(res, 'INTERNAL_ERROR', 'Erro interno do servidor', 500);
  }
}
