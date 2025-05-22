import React from 'react';
import { Link } from 'wouter';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-amber-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Página não encontrada</h2>
        <p className="text-gray-600 mb-6">
          A página que você está procurando não existe ou foi movida para outro endereço.
        </p>
        <Link href="/dashboard">
          <div className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer">
            Voltar ao Dashboard
          </div>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;