import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const SupabaseTest: React.FC = () => {
  const [sessionData, setSessionData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Erro ao verificar sessão:', error);
          setError(error.message);
          return;
        }
        
        setSessionData(data);
        console.log('Dados da sessão:', data);
      } catch (err) {
        console.error('Erro inesperado:', err);
        setError('Erro inesperado ao conectar com Supabase');
      }
    };
    
    checkSession();
  }, []);
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Teste de Conexão Supabase</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Erro:</p>
          <p>{error}</p>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded p-4">
        <h2 className="text-lg font-semibold mb-2">Status da Conexão</h2>
        <p>URL do Supabase: {import.meta.env.VITE_SUPABASE_URL ? 'Configurado' : 'Não configurado'}</p>
        <p>Chave Anônima: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configurada' : 'Não configurada'}</p>
        
        <h2 className="text-lg font-semibold mt-4 mb-2">Dados da Sessão</h2>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-96">
          {sessionData ? JSON.stringify(sessionData, null, 2) : 'Carregando...'}
        </pre>
      </div>
    </div>
  );
};

export default SupabaseTest;