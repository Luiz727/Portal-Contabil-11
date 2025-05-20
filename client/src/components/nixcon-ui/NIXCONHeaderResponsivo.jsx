import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  Search, 
  Bell, 
  User,
  Menu,
  ChevronDown,
  LogOut,
  Settings,
  HelpCircle,
  Building,
  UserCircle
} from 'lucide-react';
import logoNixcon from '../../assets/logo-nixcon.png';

const NIXCONHeaderResponsivo = ({ 
  onMenuToggle, 
  empresas = [], 
  empresaSelecionada, 
  onChangeEmpresa 
}) => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState('escritorio'); // 'escritorio' ou 'empresa'
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showViewModeSelector, setShowViewModeSelector] = useState(false);
  const [notificacoes] = useState([
    { id: 1, titulo: 'Nova declaração disponível', data: '19/05/2025', lida: false },
    { id: 2, titulo: 'Vencimento de imposto próximo', data: '18/05/2025', lida: true },
    { id: 3, titulo: 'Documento enviado para assinatura', data: '17/05/2025', lida: true }
  ]);
  
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    if (showNotifications) setShowNotifications(false);
  };
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showUserMenu) setShowUserMenu(false);
  };
  
  const handleLogout = async () => {
    window.location.href = '/api/logout';
  };
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="nixcon-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 focus:outline-none"
              onClick={onMenuToggle}
            >
              <Menu size={24} />
            </button>
          </div>
          
          <div className="flex items-center">
            <div className="md:hidden flex-shrink-0 flex items-center ml-2">
              <img
                className="h-8 w-auto"
                src={logoNixcon}
                alt="NIXCON"
              />
            </div>
            
            {/* Seletor de Empresas */}
            <div className="hidden md:ml-6 md:flex md:items-center">
              {empresas && empresas.length > 0 && (
                <div className="relative inline-block text-left">
                  <div>
                    <button
                      type="button"
                      className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      id="empresa-menu"
                      aria-expanded="true"
                      aria-haspopup="true"
                      onClick={() => {
                        if (onChangeEmpresa && empresaSelecionada) {
                          onChangeEmpresa(empresaSelecionada);
                          setViewMode('empresa');
                        }
                      }}
                    >
                      {empresaSelecionada?.nome || 'Selecione uma empresa'}
                      <ChevronDown className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Indicador de Visão (Escritório/Empresa) */}
              <div className="ml-4">
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
                    onClick={() => setViewMode('escritorio')}
                    className="ml-2 text-xs text-primary hover:underline"
                  >
                    Alternar para Escritório
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            {/* Barra de Pesquisa */}
            <div className="hidden md:ml-4 md:flex-1 md:flex md:max-w-xs">
              <div className="w-full">
                <label htmlFor="search" className="sr-only">Buscar</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="search"
                    name="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-100 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Buscar documentos, clientes..."
                    type="search"
                  />
                </div>
              </div>
            </div>
            
            {/* Notificações */}
            <button
              type="button"
              className="ml-auto md:ml-4 p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
              onClick={toggleNotifications}
            >
              <span className="sr-only">Ver notificações</span>
              <div className="relative">
                <Bell size={20} />
                {notificacoes.some(n => !n.lida) && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                )}
              </div>
            </button>
            
            {/* Menu do Usuário */}
            <div className="ml-3 relative">
              <div>
                <button
                  type="button"
                  className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  id="user-menu"
                  aria-expanded="true"
                  aria-haspopup="true"
                  onClick={toggleUserMenu}
                >
                  <span className="sr-only">Abrir menu do usuário</span>
                  {user && user.profileImageUrl ? (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user.profileImageUrl}
                      alt=""
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <User size={16} />
                    </div>
                  )}
                </button>
              </div>
              
              {/* Dropdown do menu do usuário */}
              {showUserMenu && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <div className="block px-4 py-2 text-xs text-gray-400 border-b border-gray-100">
                    {user && (
                      <>
                        <p className="font-medium text-sm text-gray-700">{user.firstName} {user.lastName}</p>
                        <p className="truncate">{user.email}</p>
                      </>
                    )}
                  </div>
                  <a
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <Settings size={16} className="mr-3" />
                    Configurações
                  </a>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <HelpCircle size={16} className="mr-3" />
                    Ajuda e suporte
                  </a>
                  <a
                    href="#"
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100"
                    role="menuitem"
                  >
                    <LogOut size={16} className="mr-3" />
                    Sair
                  </a>
                </div>
              )}
              
              {/* Dropdown de notificações */}
              {showNotifications && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h3 className="text-sm font-medium text-gray-700">Notificações</h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto hide-scrollbar">
                    {notificacoes.length === 0 ? (
                      <div className="py-6 text-center text-gray-500 text-sm">
                        Nenhuma notificação
                      </div>
                    ) : (
                      <div className="py-1">
                        {notificacoes.map(notificacao => (
                          <a
                            key={notificacao.id}
                            href="#"
                            className={`block px-4 py-2 hover:bg-gray-50 ${!notificacao.lida ? 'bg-primary/5' : ''}`}
                          >
                            <p className="text-sm font-medium text-gray-900">{notificacao.titulo}</p>
                            <p className="text-xs text-gray-500 mt-1">{notificacao.data}</p>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gray-100 py-2 px-4">
                    <a href="/notifications" className="text-sm font-medium text-primary hover:text-primary-dark">
                      Ver todas as notificações
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Seletor de Empresas Mobile com Indicador de Visão */}
      {empresas && empresas.length > 0 && (
        <div className="border-t border-gray-200 md:hidden px-4 py-2 bg-gray-50">
          <select
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            value={empresaSelecionada?.id || ''}
            onChange={(e) => {
              const empresa = empresas.find(emp => emp.id === e.target.value);
              if (empresa && onChangeEmpresa) {
                onChangeEmpresa(empresa);
                setViewMode('empresa');
              }
            }}
          >
            <option value="" disabled>Selecione uma empresa</option>
            {empresas.map(empresa => (
              <option key={empresa.id} value={empresa.id}>
                {empresa.nome}
              </option>
            ))}
          </select>

          {/* Indicador de Visão Mobile */}
          <div className="mt-2 flex flex-col items-center">
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
                  Visão Empresa: {empresaSelecionada?.nome}
                </>
              )}
            </div>
            
            {viewMode === 'empresa' && (
              <button 
                onClick={() => setViewMode('escritorio')}
                className="mt-1 text-xs text-primary hover:underline"
              >
                Alternar para Visão Escritório
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default NIXCONHeaderResponsivo;