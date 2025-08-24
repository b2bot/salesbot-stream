import { useState, useEffect } from 'react';
import { fetchWithClientAuth } from '../fetchWithClientAuth';
import { toast } from '@/hooks/use-toast';

// Types
export interface GoogleBusinessMetrics {
  views: { value: number; change: number };
  searches: { value: number; change: number };
  calls: { value: number; change: number };
  website: { value: number; change: number };
  directions: { value: number; change: number };
}

export interface GoogleBusinessReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  replied: boolean;
  response?: string;
}

export interface GoogleBusinessInfo {
  name: string;
  address: string;
  phone: string;
  website: string;
  category: string;
  hours: Record<string, string>;
}

export interface GoogleBusinessQuestion {
  id: string;
  question: string;
  author: string;
  date: string;
  answered: boolean;
  answer?: string;
}

export interface GoogleBusinessAuth {
  connected: boolean;
  email?: string;
  lastSync?: string;
}

// Auth Hook
export const useGoogleBusinessAuth = () => {
  const [auth, setAuth] = useState<GoogleBusinessAuth>({ connected: false });
  const [loading, setLoading] = useState(false);

  const fetchAuthStatus = async () => {
    try {
      const data = await fetchWithClientAuth('/api/client-portal/google-business/auth-status');
      setAuth(data);
    } catch (error) {
      console.error('Erro ao buscar status de autenticação:', error);
    }
  };

  const connect = async () => {
    setLoading(true);
    try {
      const data = await fetchWithClientAuth('/api/client-portal/google-business/connect', {
        method: 'POST'
      });
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao conectar com Google Business Profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const disconnect = async () => {
    setLoading(true);
    try {
      await fetchWithClientAuth('/api/client-portal/google-business/disconnect', {
        method: 'POST'
      });
      setAuth({ connected: false });
      toast({
        title: "Sucesso",
        description: "Conta desconectada com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao desconectar conta",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthStatus();
  }, []);

  return { auth, loading, connect, disconnect, refetch: fetchAuthStatus };
};

// Metrics Hook
export const useGoogleBusinessMetrics = () => {
  const [metrics, setMetrics] = useState<GoogleBusinessMetrics | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMetrics = async (params?: { startDate?: string; endDate?: string; location?: string }) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(params || {});
      const data = await fetchWithClientAuth(`/api/client-portal/google-business/metrics?${queryParams}`);
      setMetrics(data.metrics);
      setChartData(data.chartData || []);
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return { metrics, chartData, loading, refetch: fetchMetrics };
};

// Reviews Hook
export const useGoogleBusinessReviews = () => {
  const [reviews, setReviews] = useState<GoogleBusinessReview[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async (filters?: { rating?: string; status?: string; period?: string }) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filters || {});
      const data = await fetchWithClientAuth(`/api/client-portal/google-business/reviews?${queryParams}`);
      setReviews(data);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
    } finally {
      setLoading(false);
    }
  };

  const replyToReview = async (reviewId: string, response: string) => {
    try {
      await fetchWithClientAuth('/api/client-portal/google-business/reviews/reply', {
        method: 'POST',
        body: JSON.stringify({ reviewId, response })
      });
      
      toast({
        title: "Sucesso",
        description: "Resposta enviada com sucesso"
      });
      
      fetchReviews(); // Refresh reviews
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar resposta",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return { reviews, loading, replyToReview, refetch: fetchReviews };
};

// Business Info Hook
export const useGoogleBusinessInfo = () => {
  const [info, setInfo] = useState<GoogleBusinessInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInfo = async () => {
    setLoading(true);
    try {
      const data = await fetchWithClientAuth('/api/client-portal/google-business/info');
      setInfo(data);
    } catch (error) {
      console.error('Erro ao buscar informações do negócio:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateInfo = async (updatedInfo: Partial<GoogleBusinessInfo>) => {
    setLoading(true);
    try {
      await fetchWithClientAuth('/api/client-portal/google-business/info', {
        method: 'PUT',
        body: JSON.stringify(updatedInfo)
      });
      
      toast({
        title: "Sucesso",
        description: "Informações atualizadas com sucesso"
      });
      
      fetchInfo(); // Refresh info
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar informações",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  return { info, loading, updateInfo, refetch: fetchInfo };
};

// Questions Hook
export const useGoogleBusinessQuestions = () => {
  const [questions, setQuestions] = useState<GoogleBusinessQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await fetchWithClientAuth('/api/client-portal/google-business/questions');
      setQuestions(data);
    } catch (error) {
      console.error('Erro ao buscar perguntas:', error);
    } finally {
      setLoading(false);
    }
  };

  const answerQuestion = async (questionId: string, answer: string) => {
    try {
      await fetchWithClientAuth('/api/client-portal/google-business/questions/answer', {
        method: 'POST',
        body: JSON.stringify({ questionId, answer })
      });
      
      toast({
        title: "Sucesso",
        description: "Resposta enviada com sucesso"
      });
      
      fetchQuestions(); // Refresh questions
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao enviar resposta",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return { questions, loading, answerQuestion, refetch: fetchQuestions };
};