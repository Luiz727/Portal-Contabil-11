import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  ReceiptText, 
  FileText, 
  Users, 
  PackageOpen, 
  Truck, 
  Tags, 
  Calculator, 
  CreditCard, 
  BarChart3, 
  Wrench, 
  ChevronDown,
  Calendar,
  Menu,
  MessageSquare,
  LineChart,
  Settings,
  FileCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import logoNixconFull from '../../assets/logo-nixcon-full.png';
import logoNixconIcon from '../../assets/logo-nixcon-icon.png';
import { useAuth } from '@/hooks/useAuth';
import { ViewModeContext } from '@/contexts/ViewModeContext';

// Componente para os itens do menu lateral
const SidebarItem = ({ icon: Icon, label, to, active, hasSubmenu, collapsed, onClick }) => {
  return (
    <div onClick={onClick}>
      <Link href={to} className={`flex items-center px-4 py-2.5 text-sm ${active ? 'bg-primary/10 text-[rgb(55,65,81)] font-medium' : 'text-[rgb(55,65,81)] hover:bg-gray-100'} rounded-md transition-colors`}>
        <Icon size={18} className={`${collapsed ? "mx-auto" : "mr-3"} text-[#d9bb42]`} />
        {!collapsed && (
          <>
            <span>{label}</span>
            {hasSubmenu && <ChevronDown size={16} className="ml-auto text-[rgb(55,65,81)]" />}
          </>
        )}
      </Link>
    </div>
  );
};

// Componente para seções do menu
const SidebarSection = ({ title, children, collapsed }) => {
  return (
    <div className="mb-6">
      {!collapsed && (
        <h3 className="uppercase text-xs font-semibold text-gray-500 px-4 mb-2">
          {title}
        </h3>
      )}
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
};

export default function NIXCONSidebarResponsivo({ onToggle }) {
  const [location, navigate] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [keepCollapsed, setKeepCollapsed] = useState(false);
  const { user, hasPermission, shouldShowComponent, isAdmin, isSuperAdmin } = useAuth();
  const viewModeContext = useContext(ViewModeContext);
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    if (onToggle) onToggle(!collapsed);
  };
  
  // Recolher automaticamente em telas menores quando mudar de página
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && !keepCollapsed) {
        setCollapsed(true);
        if (onToggle) onToggle(true);
      } else if (window.innerWidth >= 768 && !keepCollapsed) {
        setCollapsed(false);
        if (onToggle) onToggle(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Monitorar mudanças na rota para recolher o menu automaticamente em dispositivos móveis
    const handleRouteChange = () => {
      if (window.innerWidth < 768 && !keepCollapsed) {
        setCollapsed(true);
        if (onToggle) onToggle(true);
      }
    };
    
    // Recolher no início
    handleRouteChange();
    
    return () => window.removeEventListener('resize', handleResize);
  }, [keepCollapsed, onToggle, location]);
  
  // Fechar o menu automaticamente quando clicar em um item (em telas pequenas)
  const handleItemClick = () => {
    // Sempre colapsar o menu ao clicar em qualquer item, independente do tamanho da tela
    // a menos que keepCollapsed esteja ativado
    if (!keepCollapsed) {
      setCollapsed(true);
      if (onToggle) onToggle(true);
    }
  };
  
  // Toggle para manter recolhido
  const toggleKeepCollapsed = () => {
    setKeepCollapsed(!keepCollapsed);
    setCollapsed(!keepCollapsed);
    if (onToggle) onToggle(!keepCollapsed);
  };
  
  return (
    <aside 
      className={`bg-white border-r border-gray-200 ${collapsed ? 'w-16' : 'w-64'} flex-shrink-0 h-full transition-all duration-300 ease-in-out hide-scrollbar`}
      style={{ overflowY: 'auto', scrollbarWidth: 'none' }}
    >
      <div className="p-4 border-b border-gray-200 mb-2 flex items-center justify-between">
        <div className={`flex items-center ${collapsed ? 'justify-center w-full' : ''}`}>
          <Link href="/" className="flex items-center">
            <img 
              src={collapsed ? logoNixconIcon : logoNixconFull} 
              alt="NIXCON Logo" 
              className="h-8" 
            />
          </Link>
        </div>
        
        <button
          onClick={toggleSidebar}
          className={`text-gray-500 hover:text-primary ${collapsed ? 'hidden' : 'block'}`}
        >
          <ChevronLeft size={18} />
        </button>
      </div>
      
      {collapsed && (
        <div className="flex justify-center my-2">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-primary"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
      
      {!collapsed && (
        <div className="flex items-center px-4 py-2">
          <input
            type="checkbox"
            id="keepCollapsed"
            checked={keepCollapsed}
            onChange={toggleKeepCollapsed}
            className="rounded text-primary focus:ring-primary"
          />
          <label htmlFor="keepCollapsed" className="ml-2 text-xs text-gray-500">
            Manter recolhido
          </label>
        </div>
      )}
      
      <div className="px-2 py-4">
        {/* Item Dashboard - Acessível a todos */}
        <SidebarItem 
          icon={LayoutDashboard} 
          label="Dashboard" 
          to="/" 
          active={location === "/"} 
          collapsed={collapsed}
          onClick={handleItemClick} 
        />
        
        {/* Item Clientes - Verifica permissão */}
        {shouldShowComponent(['ver_clientes', 'gerenciar_clientes']) && (
          <SidebarItem 
            icon={Users} 
            label="Clientes" 
            to="/clients" 
            active={location === "/clients"} 
            collapsed={collapsed}
            onClick={handleItemClick} 
          />
        )}
        
        {/* Item Documentos - Verifica permissão */}
        {shouldShowComponent(['ver_documentos', 'gerenciar_documentos']) && (
          <SidebarItem 
            icon={FileText} 
            label="Documentos" 
            to="/documents" 
            active={location === "/documents"} 
            collapsed={collapsed}
            onClick={handleItemClick} 
          />
        )}
        
        {/* Item Notas Fiscais - Verifica permissão */}
        {shouldShowComponent(['ver_notas', 'emitir_notas', 'gerenciar_notas']) && (
          <SidebarItem 
            icon={ReceiptText} 
            label="Notas Fiscais" 
            to="/invoices" 
            active={location === "/invoices"} 
            collapsed={collapsed}
            onClick={handleItemClick} 
          />
        )}
        
        {/* Item Calendário - Verifica permissão */}
        {shouldShowComponent(['ver_calendario', 'gerenciar_calendario']) && (
          <SidebarItem 
            icon={Calendar} 
            label="Calendário" 
            to="/calendar" 
            active={location === "/calendar"} 
            collapsed={collapsed}
            onClick={handleItemClick} 
          />
        )}
        
        {/* Seção Módulos - Verificar se pelo menos um item tem permissão */}
        {shouldShowComponent([
          'acessar_modulo_fiscal', 
          'usar_calculadora', 
          'ver_impostometro', 
          'acessar_financeiro', 
          'acessar_conciliacao', 
          'gerenciar_estoque', 
          'ver_relatorios'
        ]) && (
          <SidebarSection title="Módulos" collapsed={collapsed}>
            {/* Módulo Fiscal */}
            {shouldShowComponent(['acessar_modulo_fiscal']) && (
              <SidebarItem 
                icon={Calculator} 
                label="Módulo Fiscal" 
                to="/fiscal" 
                active={location.startsWith("/fiscal")} 
                hasSubmenu 
                collapsed={collapsed}
                onClick={handleItemClick} 
              />
            )}
            
            {/* Calculadora de Impostos */}
            {shouldShowComponent(['usar_calculadora']) && (
              <SidebarItem 
                icon={Calculator} 
                label="Calculadora" 
                to="/tax-calculator" 
                active={location === "/tax-calculator" || location === "/calculadora-nixcon"} 
                collapsed={collapsed}
                onClick={handleItemClick} 
              />
            )}
            
            {/* Impostômetro */}
            {shouldShowComponent(['ver_impostometro']) && (
              <SidebarItem 
                icon={CreditCard} 
                label="Impostômetro" 
                to="/impostometro" 
                active={location === "/impostometro"} 
                collapsed={collapsed}
                onClick={handleItemClick} 
              />
            )}
            
            {/* Financeiro */}
            {shouldShowComponent(['acessar_financeiro']) && (
              <SidebarItem 
                icon={LineChart} 
                label="Financeiro" 
                to="/financial" 
                active={location === "/financial"} 
                collapsed={collapsed}
                onClick={handleItemClick} 
              />
            )}
            
            {/* Conciliação */}
            {shouldShowComponent(['acessar_conciliacao']) && (
              <SidebarItem 
                icon={FileCheck} 
                label="Conciliação" 
                to="/reconciliation" 
                active={location === "/reconciliation"} 
                collapsed={collapsed}
                onClick={handleItemClick} 
              />
            )}
            
            {/* Estoque */}
            {shouldShowComponent(['gerenciar_estoque']) && (
              <SidebarItem 
                icon={PackageOpen} 
                label="Estoque" 
                to="/inventory" 
                active={location === "/inventory"} 
                collapsed={collapsed}
                onClick={handleItemClick} 
              />
            )}
            
            {/* Relatórios */}
            {shouldShowComponent(['ver_relatorios']) && (
              <SidebarItem 
                icon={BarChart3} 
                label="Relatórios" 
                to="/reports" 
                active={location === "/reports"} 
                collapsed={collapsed}
                onClick={handleItemClick} 
              />
            )}
          </SidebarSection>
        )}
        
        {/* Seção Comunicação - Verificar se pelo menos um item tem permissão */}
        {shouldShowComponent(['acessar_whatsapp', 'gerenciar_integracoes']) && (
          <SidebarSection title="Comunicação" collapsed={collapsed}>
            {/* WhatsApp */}
            {shouldShowComponent(['acessar_whatsapp']) && (
              <SidebarItem 
                icon={MessageSquare} 
                label="WhatsApp" 
                to="/whatsapp" 
                active={location === "/whatsapp"} 
                collapsed={collapsed}
                onClick={handleItemClick} 
              />
            )}
            
            {/* Integrações */}
            {shouldShowComponent(['gerenciar_integracoes']) && (
              <SidebarItem 
                icon={Wrench} 
                label="Integrações" 
                to="/integrations" 
                active={location === "/integrations"} 
                collapsed={collapsed}
                onClick={handleItemClick} 
              />
            )}
          </SidebarSection>
        )}
        
        {/* Seção Administração - Apenas para admin e superadmin */}
        {(isAdmin || isSuperAdmin) && (
          <SidebarSection title="Administração" collapsed={collapsed}>
            {/* Empresas Usuárias - Apenas para admin e superadmin */}
            <SidebarItem 
              icon={Users} 
              label="Empresas Usuárias" 
              to="/admin/empresas-usuarias" 
              active={location === "/admin/empresas-usuarias"} 
              collapsed={collapsed}
              onClick={handleItemClick} 
            />
            
            {/* Produtos Universais - Apenas para admin e superadmin */}
            <SidebarItem 
              icon={PackageOpen} 
              label="Produtos Universais" 
              to="/admin/produtos-universais" 
              active={location === "/admin/produtos-universais"} 
              collapsed={collapsed}
              onClick={handleItemClick} 
            />
            
            {/* Importar Produtos - Apenas para admin e superadmin */}
            <SidebarItem 
              icon={Truck} 
              label="Importar Produtos" 
              to="/admin/importar-produtos" 
              active={location === "/admin/importar-produtos"} 
              collapsed={collapsed}
              onClick={handleItemClick} 
            />
            
            {/* Planos e Assinaturas - Apenas para admin e superadmin */}
            <SidebarItem 
              icon={CreditCard} 
              label="Planos e Assinaturas" 
              to="/admin/planos" 
              active={location === "/admin/planos"} 
              collapsed={collapsed}
              onClick={handleItemClick} 
            />
          </SidebarSection>
        )}
        
        {/* Seção Sistema - Configurações básicas podem ser acessadas por todos */}
        <SidebarSection title="Sistema" collapsed={collapsed}>
          {/* Configurações - Acessível a todos */}
          <SidebarItem 
            icon={Settings} 
            label="Configurações" 
            to="/settings" 
            active={location === "/settings"} 
            collapsed={collapsed}
            onClick={handleItemClick} 
          />
          
          {/* Painel Administrativo - Apenas para admin e superadmin */}
          {(isAdmin || isSuperAdmin) && (
            <SidebarItem 
              icon={Settings} 
              label="Painel Administrativo" 
              to="/admin/painel" 
              active={location === "/admin/painel"} 
              collapsed={collapsed}
              onClick={handleItemClick} 
            />
          )}
          
          {user && user.id && (
            <div className={`mt-6 px-4 py-2 ${collapsed ? 'text-center' : ''}`}>
              <div className={`flex items-center ${collapsed ? 'justify-center' : ''}`}>
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                  {user.firstName ? user.firstName.charAt(0) : "U"}
                </div>
                {!collapsed && (
                  <div className="ml-3">
                    <p className="text-sm font-medium">{user.firstName || "Usuário"}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[150px]">{user.email || ""}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </SidebarSection>
      </div>
    </aside>
  );
}