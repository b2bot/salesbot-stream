// /api/client-portal/modulo-agenda/clientes.js

import { authenticateClientPortal } from '../_lib/auth.js';
import { ok, fail } from '../_lib/response.js';

// Mock de dados de clientes
const mockClientes = [
    {
        id: 'CLI-001',
        nome: 'Ana Silva',
        data_nascimento: '1985-05-20',
        cpf: '111.222.333-44',
        status: 'ativo',
        created_at: '2023-01-15T09:00:00Z',
        email: 'ana.silva@example.com',
        telefone: '(11) 98765-4321',
        endereco: 'Rua das Flores, 123, São Paulo, SP',
        observacoes: 'Paciente com histórico de alergia a penicilina.'
    },
    {
        id: 'CLI-002',
        nome: 'Bruno Costa',
        data_nascimento: '1992-11-30',
        cpf: '222.333.444-55',
        status: 'inativo',
        created_at: '2022-11-20T14:30:00Z',
        email: 'bruno.costa@example.com',
        telefone: '(21) 91234-5678',
        endereco: 'Avenida Copacabana, 456, Rio de Janeiro, RJ',
        observacoes: ''
    },
    {
        id: 'CLI-003',
        nome: 'Carla Dias',
        data_nascimento: '1978-02-10',
        cpf: '333.444.555-66',
        status: 'ativo',
        created_at: '2023-03-10T11:00:00Z',
        email: 'carla.dias@example.com',
        telefone: '(31) 95555-8888',
        endereco: 'Rua da Bahia, 789, Belo Horizonte, MG',
        observacoes: 'Prefere contato por e-mail.'
    },
];

export default async function handler(req, res) {
    // Autenticação (reutilizando a lógica existente)
    const authResult = await authenticateClientPortal(req);
    if (!authResult.success) {
        return fail(res, 'UNAUTHORIZED', authResult.error, 401);
    }

    if (req.method === 'GET') {
        const { search, status } = req.query;

        let filteredClientes = mockClientes;

        if (search) {
            const lowercasedSearch = search.toLowerCase();
            filteredClientes = filteredClientes.filter(c =>
                c.nome.toLowerCase().includes(lowercasedSearch) ||
                c.cpf.includes(lowercasedSearch) ||
                c.id.toLowerCase().includes(lowercasedSearch)
            );
        }

        if (status) {
            filteredClientes = filteredClientes.filter(c => c.status === status);
        }

        return ok(res, {
            items: filteredClientes,
            total: filteredClientes.length
        });
    }

    return fail(res, 'METHOD_NOT_ALLOWED', 'Método não permitido', 405);
}