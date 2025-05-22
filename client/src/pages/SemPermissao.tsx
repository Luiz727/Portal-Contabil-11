import React from 'react';
import { Link } from 'wouter';
import { useAuth } from '../contexts/AuthContext';

const SemPermissao: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <svg 
          className="mx-auto h-16 w-16 text-amber-600" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-4V7a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3h6a3 3 0 003-3z" 
          />
        </svg>
        <h1 className="text-2xl font-bold text-gray-800 mt-4 mb-4">Acesso Restrito</h1>
        <p className="text-gray-600 mb-6">
          Você não tem permissão para acessar esta página. Entre em contato com um administrador se acredita que deveria ter acesso.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Link href="/dashboard">
            <div className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer">
              Voltar ao Dashboard
            </div>
          </Link>
          <button 
            onClick={handleLogout}
            className="inline-block bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};

export default SemPermissao;