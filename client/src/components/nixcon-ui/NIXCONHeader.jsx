import React from 'react';
import { Link } from 'wouter';
import { Eye } from 'lucide-react';
import logoNixcon from '../../assets/logo-nixcon.png';

export default function NIXCONHeader({ title, subtitle, showBackLink = false }) {
  return (
    <header className="bg-white py-4 px-0 border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          {/* Logo da NIXCON */}
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center">
                <img src={logoNixcon} alt="NIXCON Logo" className="h-8" />
              </a>
            </Link>
          </div>
        </div>
        
        <div className="flex items-center">
          <Link href="/dashboard">
            <a className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg px-4 py-1.5 flex items-center text-sm font-medium transition-colors">
              <Eye className="w-4 h-4 mr-2 text-primary" />
              Voltar Visão Escritório
            </a>
          </Link>
        </div>
      </div>
    </header>
  );
}

// Componente para mostrar o contexto da empresa atual
export function CompanyContext({ companyName }) {
  return (
    <div className="bg-primary-bg py-2 px-4 text-sm flex items-center">
      <span className="text-secondary-light mr-2">Você está calculando como:</span>
      <span className="font-medium text-primary">{companyName || 'Comércio Varejista Alfa Ltda'}</span>
    </div>
  );
}

// Componente para o banner de informações/alertas
export function InfoBanner({ type = 'info', children }) {
  const bgColors = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };
  
  return (
    <div className={`${bgColors[type]} border rounded-md p-4 mb-6`}>
      {children}
    </div>
  );
}