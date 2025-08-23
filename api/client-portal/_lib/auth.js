
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

export async function authenticateClientPortal(req) {
  try {
    // Tenta pegar o token do header Authorization ou do cookie
    let token = null;
    
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies['cp.token']) {
      token = req.cookies['cp.token'];
    }

    if (!token) {
      return { success: false, error: 'Token não fornecido' };
    }

    // Verifica e decodifica o token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (!decoded.clientId || !decoded.clientUserId) {
      return { success: false, error: 'Token inválido' };
    }

    return {
      success: true,
      data: {
        clientId: decoded.clientId,
        clientUserId: decoded.clientUserId,
        role: decoded.role || 'client',
        permissions: decoded.permissions || []
      }
    };

  } catch (error) {
    console.error('Erro na autenticação:', error);
    return { success: false, error: 'Token inválido ou expirado' };
  }
}
