
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setUnauthorizedHandler } from '@/hooks/client-portal/fetchWithClientAuth';

interface ClientPortalContextData {
  preferences: Record<string, any>;
  updatePreference: (key: string, value: any) => void;
}

const ClientPortalContext = createContext<ClientPortalContextData>({} as ClientPortalContextData);

export const useClientPortal = () => {
  const context = useContext(ClientPortalContext);
  if (!context) {
    throw new Error('useClientPortal must be used within a ClientPortalProvider');
  }
  return context;
};

interface ClientPortalProviderProps {
  children: React.ReactNode;
}

export const ClientPortalProvider: React.FC<ClientPortalProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<Record<string, any>>({});
  const navigate = useNavigate();

  useEffect(() => {
    // Configura o handler global de 401
    setUnauthorizedHandler(() => {
      navigate('/client-portal/login');
    });

    // Carrega preferências salvas
    const savedPreferences = localStorage.getItem('cp.preferences');
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error('Erro ao carregar preferências:', error);
      }
    }
  }, [navigate]);

  const updatePreference = (key: string, value: any) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    localStorage.setItem('cp.preferences', JSON.stringify(newPreferences));
  };

  return (
    <ClientPortalContext.Provider value={{ preferences, updatePreference }}>
      {children}
    </ClientPortalContext.Provider>
  );
};
