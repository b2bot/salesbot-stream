import React, { Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
const Index = React.lazy(() => import('./pages/Index'));
const Planos = React.lazy(() => import('./pages/Planos'));
const Solucoes = React.lazy(() => import('./pages/Solucoes'));
const Recursos = React.lazy(() => import('./pages/Recursos'));
const Integracoes = React.lazy(() => import('./pages/Integracoes'));
const NotFound = React.lazy(() => import('./pages/NotFound'));


const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Suspense fallback={<div>Carregando...</div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/planos" element={<Planos />} />
              <Route path="/plataforma" element={<Index />} />
              <Route path="/solucoes" element={<Solucoes />} />
              <Route path="/recursos" element={<Recursos />} />
              <Route path="/integracoes" element={<Integracoes />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Footer />
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
