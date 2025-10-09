import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAutenticacao } from '@/contexts/ContextoAutenticacao';

interface RotaProtegidaProps {
  children: React.ReactNode;
}

export function RotaProtegida({ children }: RotaProtegidaProps) {
  const { estaAutenticado, estaCarregando } = useAutenticacao();

  if (estaCarregando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}