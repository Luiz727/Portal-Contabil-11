import React, { useState } from 'react';
import { useViewMode, VIEW_MODES, VIEW_MODE_NAMES } from '../contexts/ViewModeContext';
import { useEmpresas } from '../contexts/EmpresasContext';

const ViewModeSelector = () => {
  const { 
    viewMode, 
    changeViewMode, 
    viewModeName, 
    currentCompany, 
    activeProfile,
    profiles
  } = useViewMode();
  
  const { empresas, empresaAtual, changeEmpresa } = useEmpresas();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Simplificação para demo: considera admin qualquer usuário no modo escritório
  const isAdmin = viewMode === VIEW_MODES.ESCRITORIO;

  // Função para mudar a empresa e o modo de visualização
  const changeEmpresaAndMode = (empresa, mode = VIEW_MODES.EMPRESA) => {
    if (changeEmpresa) {
      changeEmpresa(empresa.id);
    }
    
    // Passa a empresa selecionada para o changeViewMode
    changeViewMode(mode, empresa);
    setDropdownOpen(false);
  };

  // Ícones para cada modo de visualização (simplificados para texto)
  const getViewModeIcon = (mode) => {
    switch(mode) {
      case VIEW_MODES.ESCRITORIO: return "🏢";
      case VIEW_MODES.EMPRESA: return "🏭";
      case VIEW_MODES.CONTADOR: return "🧮";
      case VIEW_MODES.EXTERNO: return "👤";
      default: return "👁️";
    }
  };

  // Versão simplificada para dispositivos móveis ou usuários sem permissão
  if (!isAdmin || window.innerWidth < 768) {
    return (
      <div className="nixcon-flex nixcon-items-center">
        <div className="nixcon-px-4 nixcon-py-2 nixcon-bg-primary nixcon-text-white nixcon-rounded-md">
          <span className="mr-2">{getViewModeIcon(viewMode)}</span>
          <span>{viewModeName}</span>
          {activeProfile && viewMode !== VIEW_MODES.ESCRITORIO && (
            <span className="nixcon-badge nixcon-badge-primary nixcon-ml-2">
              {activeProfile.nome}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="nixcon-relative">
      <button 
        className="nixcon-btn nixcon-btn-primary nixcon-flex nixcon-items-center"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <span className="mr-2">{getViewModeIcon(viewMode)}</span>
        <span>{viewModeName}</span>
        {activeProfile && viewMode !== VIEW_MODES.ESCRITORIO && (
          <span className="nixcon-badge nixcon-badge-primary nixcon-ml-2 nixcon-bg-amber-50 nixcon-text-primary">
            {activeProfile.nome}
          </span>
        )}
        <span className="ml-2">▼</span>
      </button>

      {/* Dropdown menu */}
      {dropdownOpen && (
        <div className="nixcon-absolute nixcon-z-50 nixcon-mt-2 nixcon-w-64 nixcon-rounded-md nixcon-bg-white nixcon-shadow-lg nixcon-p-2 nixcon-right-0 nixcon-border nixcon-border-gray-200">
          <div className="nixcon-p-2 nixcon-font-semibold nixcon-border-b nixcon-border-gray-200">
            Mudar Modo de Visualização
          </div>
          
          {/* Opção de Escritório */}
          <div 
            className={`nixcon-p-2 nixcon-flex nixcon-items-center nixcon-cursor-pointer nixcon-rounded hover:nixcon-bg-gray-100 ${viewMode === VIEW_MODES.ESCRITORIO ? 'nixcon-bg-amber-50' : ''}`}
            onClick={() => changeViewMode(VIEW_MODES.ESCRITORIO)}
          >
            <span className="mr-2">{getViewModeIcon(VIEW_MODES.ESCRITORIO)}</span>
            <span>Visão do Escritório</span>
            {viewMode === VIEW_MODES.ESCRITORIO && (
              <span className="ml-auto">✓</span>
            )}
          </div>
          
          {/* Opção de Empresa - com submenu */}
          <div 
            className={`nixcon-p-2 nixcon-flex nixcon-items-center nixcon-cursor-pointer nixcon-rounded hover:nixcon-bg-gray-100 ${viewMode === VIEW_MODES.EMPRESA ? 'nixcon-bg-amber-50' : ''}`}
            onClick={() => {
              // Toggle submenu de empresas
              document.getElementById('empresa-submenu').classList.toggle('nixcon-hidden');
            }}
          >
            <span className="mr-2">{getViewModeIcon(VIEW_MODES.EMPRESA)}</span>
            <span>Visão da Empresa</span>
            <span className="ml-auto">▶</span>
          </div>
          
          {/* Submenu de Empresas */}
          <div id="empresa-submenu" className="nixcon-hidden nixcon-ml-4 nixcon-mt-1 nixcon-border-l nixcon-border-gray-200 nixcon-pl-2">
            {empresas.map((empresa) => (
              <div 
                key={empresa.id}
                className={`nixcon-p-2 nixcon-flex nixcon-items-center nixcon-cursor-pointer nixcon-rounded hover:nixcon-bg-gray-100 ${empresaAtual?.id === empresa.id && viewMode === VIEW_MODES.EMPRESA ? 'nixcon-bg-amber-50' : ''}`}
                onClick={() => changeEmpresaAndMode(empresa, VIEW_MODES.EMPRESA)}
              >
                <span className="mr-2">🏭</span>
                <div className="nixcon-flex nixcon-flex-col">
                  <span className="nixcon-text-sm">{empresa.nome}</span>
                  <span className="nixcon-text-xs nixcon-text-gray-500">{empresa.cnpj}</span>
                </div>
                {empresaAtual?.id === empresa.id && viewMode === VIEW_MODES.EMPRESA && (
                  <span className="ml-auto">✓</span>
                )}
              </div>
            ))}
          </div>
          
          {/* Opção de Contador */}
          <div 
            className={`nixcon-p-2 nixcon-flex nixcon-items-center nixcon-cursor-pointer nixcon-rounded hover:nixcon-bg-gray-100 ${viewMode === VIEW_MODES.CONTADOR ? 'nixcon-bg-amber-50' : ''}`}
            onClick={() => changeViewMode(VIEW_MODES.CONTADOR)}
          >
            <span className="mr-2">{getViewModeIcon(VIEW_MODES.CONTADOR)}</span>
            <span>Visão de Contador</span>
            {viewMode === VIEW_MODES.CONTADOR && (
              <span className="ml-auto">✓</span>
            )}
          </div>
          
          {/* Opção de Usuário Externo */}
          <div 
            className={`nixcon-p-2 nixcon-flex nixcon-items-center nixcon-cursor-pointer nixcon-rounded hover:nixcon-bg-gray-100 ${viewMode === VIEW_MODES.EXTERNO ? 'nixcon-bg-amber-50' : ''}`}
            onClick={() => changeViewMode(VIEW_MODES.EXTERNO)}
          >
            <span className="mr-2">{getViewModeIcon(VIEW_MODES.EXTERNO)}</span>
            <span>Visão Externa</span>
            {viewMode === VIEW_MODES.EXTERNO && (
              <span className="ml-auto">✓</span>
            )}
          </div>
          
          {/* Rodapé com configurações */}
          <div className="nixcon-mt-2 nixcon-pt-2 nixcon-border-t nixcon-border-gray-200">
            <div 
              className="nixcon-p-2 nixcon-flex nixcon-items-center nixcon-cursor-pointer nixcon-rounded hover:nixcon-bg-gray-100"
              onClick={() => {
                // Link para página de configurações
                window.location.href = "/admin/configuracoes?tab=visualizacoes";
                setDropdownOpen(false);
              }}
            >
              <span className="mr-2">⚙️</span>
              <span>Configurar Perfis de Visualização</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewModeSelector;