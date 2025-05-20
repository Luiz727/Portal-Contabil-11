import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, ReceiptText, FileText, Users, 
  PackageOpen, Truck, Tags, Calculator, 
  CreditCard, BarChart3, Wrench, ChevronDown
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, to, active, hasSubmenu }) => {
  return (
    <Link href={to}>
      <a className={`flex items-center px-4 py-2.5 text-sm ${active ? 'bg-primary text-white' : 'text-secondary hover:bg-gray-100'} rounded-md transition-colors`}>
        <Icon size={18} className="mr-3" />
        <span>{label}</span>
        {hasSubmenu && <ChevronDown size={16} className="ml-auto" />}
      </a>
    </Link>
  );
};

const SidebarSection = ({ title, children }) => {
  return (
    <div className="mb-3">
      {title && (
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4 mb-2">
          {title}
        </h3>
      )}
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
};

export default function NIXCONSidebar() {
  const [location] = useLocation();
  
  return (
    <aside className="bg-white border-r border-gray-200 w-60 flex-shrink-0 overflow-y-auto h-full">
      <div className="p-4 border-b border-gray-200 mb-2">
        <div className="flex items-center justify-center">
          <img 
            src="https://via.placeholder.com/120x40?text=NIXCON" 
            alt="NIXCON Logo" 
            className="h-10" 
          />
        </div>
      </div>
      
      <div className="px-2 py-2 bg-primary-bg rounded-md mx-3 mb-4">
        <div className="text-xs text-secondary-light">Visão Comércio Varejista Alfa Ltda</div>
      </div>
      
      <div className="px-2 py-4">
        <SidebarItem 
          icon={LayoutDashboard} 
          label="Painel de Controle" 
          to="/" 
          active={location === "/"} 
        />
        
        <SidebarItem 
          icon={Calculator} 
          label="Módulo Fiscal" 
          to="/fiscal" 
          active={location === "/fiscal" || location === "/tax-calculator"} 
          hasSubmenu 
        />
        
        <SidebarSection title="Cadastros da Empresa">
          <SidebarItem 
            icon={PackageOpen} 
            label="Meus Produtos" 
            to="/produtos" 
            active={location === "/produtos"} 
          />
          
          <SidebarItem 
            icon={FileText} 
            label="Meus Serviços" 
            to="/servicos" 
            active={location === "/servicos"} 
          />
          
          <SidebarItem 
            icon={Users} 
            label="Meus Clientes" 
            to="/clientes" 
            active={location === "/clientes"} 
          />
          
          <SidebarItem 
            icon={Truck} 
            label="Fornecedores" 
            to="/fornecedores" 
            active={location === "/fornecedores"} 
          />
          
          <SidebarItem 
            icon={Truck} 
            label="Transportadoras" 
            to="/transportadoras" 
            active={location === "/transportadoras"} 
          />
          
          <SidebarItem 
            icon={Tags} 
            label="Categorias" 
            to="/categorias" 
            active={location === "/categorias"} 
          />
        </SidebarSection>
        
        <SidebarItem 
          icon={ReceiptText} 
          label="Emissor Fiscal" 
          to="/emissor" 
          active={location === "/emissor"} 
          hasSubmenu 
        />
        
        <SidebarItem 
          icon={CreditCard} 
          label="Financeiro" 
          to="/financeiro" 
          active={location === "/financeiro"} 
          hasSubmenu 
        />
        
        <SidebarItem 
          icon={BarChart3} 
          label="Relatórios" 
          to="/relatorios" 
          active={location === "/relatorios"} 
          hasSubmenu 
        />
        
        <SidebarItem 
          icon={Wrench} 
          label="Ferramentas e Utilitários" 
          to="/ferramentas" 
          active={location === "/ferramentas"} 
          hasSubmenu 
        />
      </div>
    </aside>
  );
}