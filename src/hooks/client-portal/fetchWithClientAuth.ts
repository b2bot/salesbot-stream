
import { toast } from "@/hooks/use-toast";

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

let onUnauthorized: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: () => void) => {
  onUnauthorized = handler;
};

export const fetchWithClientAuth = async <T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const token = localStorage.getItem('cp.token');
    
    if (!token) {
      throw new Error('Token não encontrado');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (response.status === 401) {
      localStorage.removeItem('cp.token');
      if (onUnauthorized) {
        onUnauthorized();
      }
      throw new Error('Não autorizado');
    }

    const result: ApiResponse<T> = await response.json();

    if (!result.success) {
      throw new Error(result.error?.message || 'Erro na requisição');
    }

    return result.data as T;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};
