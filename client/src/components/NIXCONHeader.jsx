import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  User,
  Menu,
  ChevronDown,
  Building,
  UserCircle
} from 'lucide-react';

export default function NIXCONHeader({ onMenuToggle }) {
  const [showEmpresaSelector, setShowEmpresaSelector] = useState(false);
  const [empresaSelecionada, setEmpresaSelecionada] = useState({ id: '1', nome: 'Comércio Varejista Alfa Ltda' });
  const [viewMode, setViewMode] = useState('empresa'); // 'escritorio' ou 'empresa'
  
  const empresas = [
    { id: '1', nome: 'Comércio Varejista Alfa Ltda' },
    { id: '2', nome: 'Holding Investimentos XYZ S.A.' },
    { id: '3', nome: 'Serviços Contábeis NIXCON' }
  ];
  
  const toggleEmpresaSelector = () => {
    setShowEmpresaSelector(!showEmpresaSelector);
  };
  
  const handleChangeEmpresa = (empresa) => {
    setEmpresaSelecionada(empresa);
    setShowEmpresaSelector(false);
    setViewMode('empresa');
  };
  
  const switchToEscritorioView = () => {
    setViewMode('escritorio');
  };
  
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          {/* Menu para Mobile */}
          <button 
            onClick={onMenuToggle}
            className="text-gray-500 hover:text-gray-700 md:hidden"
          >
            <Menu size={24} />
          </button>
          
          {/* Seletor de Empresa */}
          <div className="hidden md:block ml-4 relative">
            <button
              onClick={toggleEmpresaSelector}
              className="flex items-center text-gray-700 hover:text-gray-900 text-sm font-medium border border-gray-300 rounded-md px-3 py-1.5"
            >
              {empresaSelecionada.nome}
              <ChevronDown size={16} className="ml-2" />
            </button>
            
            {showEmpresaSelector && (
              <div className="absolute z-10 mt-2 w-72 bg-white border border-gray-200 rounded-md shadow-lg">
                <div className="p-2">
                  {empresas.map(empresa => (
                    <button
                      key={empresa.id}
                      onClick={() => handleChangeEmpresa(empresa)}
                      className={`w-full text-left py-2 px-3 text-sm rounded-md ${
                        empresa.id === empresaSelecionada.id 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {empresa.nome}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Indicador de Visão */}
          <div className="hidden md:block ml-4">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              viewMode === 'escritorio' 
                ? 'bg-primary/10 text-primary' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {viewMode === 'escritorio' ? (
                <>
                  <Building className="inline-block w-3 h-3 mr-1" />
                  Visão Escritório
                </>
              ) : (
                <>
                  <UserCircle className="inline-block w-3 h-3 mr-1" />
                  Visão Empresa
                </>
              )}
            </div>
            
            {viewMode === 'empresa' && (
              <button 
                onClick={switchToEscritorioView}
                className="ml-2 text-xs text-primary hover:underline"
              >
                Alternar para Visão Escritório
              </button>
            )}
          </div>
        </div>
        
        <div className="flex items-center">
          {/* Barra de Pesquisa */}
          <div className="hidden md:block relative mr-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar..."
              className="py-1.5 pl-10 pr-3 block w-64 rounded-md border border-gray-300 text-sm"
            />
          </div>
          
          {/* Notificações */}
          <button className="p-1.5 text-gray-500 hover:text-gray-700 mr-2">
            <Bell size={20} />
          </button>
          
          {/* Perfil */}
          <button className="p-1.5 text-gray-500 hover:text-gray-700">
            <User size={20} />
          </button>
        </div>
      </div>
      
      {/* Menu Mobile para Empresas */}
      <div className="md:hidden mt-4">
        <select
          value={empresaSelecionada.id}
          onChange={(e) => {
            const empresa = empresas.find(emp => emp.id === e.target.value);
            if (empresa) handleChangeEmpresa(empresa);
          }}
          className="block w-full py-1.5 px-3 border border-gray-300 bg-white rounded-md text-sm"
        >
          {empresas.map(empresa => (
            <option key={empresa.id} value={empresa.id}>
              {empresa.nome}
            </option>
          ))}
        </select>
        
        {/* Indicador de Visão Mobile */}
        <div className="mt-2 flex items-center justify-center">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            viewMode === 'escritorio' 
              ? 'bg-primary/10 text-primary' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {viewMode === 'escritorio' ? 'Visão Escritório' : 'Visão Empresa'}
          </div>
          
          {viewMode === 'empresa' && (
            <button 
              onClick={switchToEscritorioView}
              className="ml-2 text-xs text-primary hover:underline"
            >
              Alternar
            </button>
          )}
        </div>
      </div>
    </header>
  );
}