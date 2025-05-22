import React from 'react';
import { Link } from 'wouter';

const SemPermissaoPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Acesso Negado</h2>
        <p className="text-gray-600 mb-8">Você não tem permissão para acessar esta página ou recurso.</p>
        <Link href="/">
          <div className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors cursor-pointer">
            Voltar ao início
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SemPermissaoPage;