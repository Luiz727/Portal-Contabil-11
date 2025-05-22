import React from 'react';
import { Link } from 'wouter';
import { HomeIcon, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-brand-gray mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Página não encontrada</h2>
        <p className="text-gray-600 mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/" className="inline-flex items-center justify-center px-5 py-3 bg-brand-gold text-white rounded-md shadow-sm hover:bg-brand-gold/90 transition-colors">
            <HomeIcon className="w-5 h-5 mr-2" />
            Voltar ao Início
          </Link>
          
          <button 
            onClick={() => window.history.back()} 
            className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;