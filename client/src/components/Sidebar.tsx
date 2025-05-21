import React from 'react';
import { Link, useLocation } from 'wouter';
import { useViewMode, VIEW_MODES } from '../contexts/ViewModeContext';
import { cn } from '@/lib/utils';
import {
  Home,
  BarChart2,
  FileText,
  Users,
  ShoppingCart,
  Calendar,
  Settings,
  FileCheck,
  Wallet,
  DollarSign,
  Upload,
  GanttChart,
  Building,
  Calculator,
  BookOpen
} from 'lucide-react';

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  viewModes: string[];
  permissions: string[];
}

const mainMenuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    href: '/',
    icon: <Home className="h-5 w-5" />,
    viewModes: [VIEW_MODES.ESCRITORIO, VIEW_MODES.EMPRESA, VIEW_MODES.CONTADOR, VIEW_MODES.EXTERNO],
    permissions: []
  },
  {
    label: 'Clientes',
    href: '/clients',
    icon: <Users className="h-5 w-5" />,
    viewModes: [VIEW_MODES.ESCRITORIO],
    permissions: ['gerencial_clientes']
  },
  {
    label: 'Fiscal',
    href: '/fiscal',
    icon: <FileCheck className="h-5 w-5" />,
    viewModes: [VIEW_MODES.ESCRITORIO, VIEW_MODES.EMPRESA, VIEW_MODES.CONTADOR],
    permissions: ['fiscal_nfe', 'fiscal_nfse']
  },
  {
    label: 'Documentos',
    href: '/documents',
    icon: <FileText className="h-5 w-5" />,
    viewModes: [VIEW_MODES.ESCRITORIO, VIEW_MODES.EMPRESA, VIEW_MODES.CONTADOR, VIEW_MODES.EXTERNO],
    permissions: ['documentos_upload', 'documentos_ged']
  },
  {
    label: 'Financeiro',
    href: '/financial',
    icon: <Wallet className="h-5 w-5" />,
    viewModes: [VIEW_MODES.ESCRITORIO, VIEW_MODES.EMPRESA],
    permissions: ['financeiro_honorarios', 'financeiro_conciliacoes', 'financeiro_pagamentos', 'financeiro_recebimentos']
  },
  {
    label: 'Honorários',
    href: '/invoices',
    icon: <DollarSign className="h-5 w-5" />,
    viewModes: [VIEW_MODES.ESCRITORIO],
    permissions: ['financeiro_honorarios']
  },
  {
    label: 'Conciliações',
    href: '/reconciliation',
    icon: <BarChart2 className="h-5 w-5" />,
    viewModes: [VIEW_MODES.ESCRITORIO, VIEW_MODES.EMPRESA],
    permissions: ['financeiro_conciliacoes']
  },
  {
    label: 'Estoque',
    href: '/inventory',
    icon: <ShoppingCart className="h-5 w-5" />,
    viewModes: [VIEW_MODES.EMPRESA],
    permissions: ['estoque_produtos', 'estoque_movimentacoes']
  },
  {
    label: 'Relatórios',
    href: '/reports',
    icon: <GanttChart className="h-5 w-5" />,
    viewModes: [VIEW_MODES.ESCRITORIO, VIEW_MODES.EMPRESA, VIEW_MODES.CONTADOR],
    permissions: ['financeiro_relatorios']
  },
  {
    label: 'Agenda',
    href: '/calendar',
    icon: <Calendar className="h-5 w-5" />,
    viewModes: [VIEW_MODES.ESCRITORIO, VIEW_MODES.EMPRESA, VIEW_MODES.CONTADOR],
    permissions: []
  },
  {
    label: 'Calculadora Fiscal',
    href: '/tax-calculator',
    icon: <Calculator className="h-5 w-5" />,
    viewModes: [VIEW_MODES.ESCRITORIO, VIEW_MODES.EMPRESA, VIEW_MODES.CONTADOR, VIEW_MODES.EXTERNO],
    permissions: ['fiscal_impostos']
  }
];

const adminMenuItems: MenuItem[] = [
  {
    label: 'Painel Administrativo',
    href: '/admin/painel',
    icon: <Building className="h-5 w-5" />,
    viewModes: [VIEW_MODES.ESCRITORIO],
    permissions: ['admin_configuracoes']
  },
  {
    label: 'Configurações',
    href: '/admin/configuracoes',
    icon: <Settings className="h-5 w-5" />,
    viewModes: [VIEW_MODES.ESCRITORIO, VIEW_MODES.EMPRESA],
    permissions: ['admin_configuracoes']
  },
  {
    label: 'Empresas',
    href: '/admin/empresas-usuarias',
    icon: <Building className="h-5 w-5" />,
    viewModes: [VIEW_MODES.ESCRITORIO],
    permissions: ['gerencial_empresas']
  },
  {
    label: 'Usuários e Permissões',
    href: '/admin/usuarios',
    icon: <Users className="h-5 w-5" />,
    viewModes: [VIEW_MODES.ESCRITORIO],
    permissions: ['gerencial_usuarios', 'admin_perfis']
  },
  {
    label: 'Produtos Universais',
    href: '/admin/produtos-universais',
    icon: <ShoppingCart className="h-5 w-5" />,
    viewModes: [VIEW_MODES.ESCRITORIO],
    permissions: ['gerencial_produtos']
  },
  {
    label: 'Integrações',
    href: '/integrations',
    icon: <Upload className="h-5 w-5" />,
    viewModes: [VIEW_MODES.ESCRITORIO],
    permissions: ['admin_integracao']
  }
];

const helpMenuItems: MenuItem[] = [
  {
    label: 'Documentação',
    href: '/help/docs',
    icon: <BookOpen className="h-5 w-5" />,
    viewModes: [VIEW_MODES.ESCRITORIO, VIEW_MODES.EMPRESA, VIEW_MODES.CONTADOR, VIEW_MODES.EXTERNO],
    permissions: []
  }
];

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar = ({ isMobile, isOpen, closeSidebar }: SidebarProps) => {
  const [location] = useLocation();
  const { viewMode, hasPermission } = useViewMode();

  // Filtrar menus com base no modo de visualização e permissões
  const filteredMainMenu = mainMenuItems.filter(item => 
    item.viewModes.includes(viewMode) && 
    (item.permissions.length === 0 || item.permissions.some(p => hasPermission(p)))
  );
  
  const filteredAdminMenu = adminMenuItems.filter(item => 
    item.viewModes.includes(viewMode) && 
    (item.permissions.length === 0 || item.permissions.some(p => hasPermission(p)))
  );

  const renderMenuItem = (item: MenuItem) => {
    const isActive = location === item.href;
    
    return (
      <Link 
        key={item.href} 
        href={item.href}
        onClick={() => isMobile && closeSidebar()}
      >
        <a className={cn(
          "flex items-center px-4 py-2.5 text-sm rounded-md transition-colors",
          isActive 
            ? "bg-primary text-white font-medium" 
            : "text-gray-700 hover:bg-gray-100"
        )}>
          <span className="mr-3">{item.icon}</span>
          <span>{item.label}</span>
        </a>
      </Link>
    );
  };

  const sidebarClass = cn(
    "flex flex-col h-full overflow-y-auto bg-white border-r border-gray-200",
    "w-64 fixed top-14 bottom-0 left-0 z-30 transition-transform duration-300",
    isMobile && !isOpen && "-translate-x-full",
    isMobile && isOpen && "translate-x-0"
  );

  return (
    <>
      {/* Overlay para dispositivos móveis */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={closeSidebar}
        />
      )}
      
      <div className={sidebarClass}>
        <div className="py-4 flex-1">
          {/* Menus principais */}
          <div className="px-3 mb-6">
            <h2 className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Principal
            </h2>
            <div className="space-y-1">
              {filteredMainMenu.map(renderMenuItem)}
            </div>
          </div>
          
          {/* Menu administrativo - apenas exibido se houver itens filtrados */}
          {filteredAdminMenu.length > 0 && (
            <div className="px-3 mb-6">
              <h2 className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Administração
              </h2>
              <div className="space-y-1">
                {filteredAdminMenu.map(renderMenuItem)}
              </div>
            </div>
          )}
          
          {/* Menu de ajuda */}
          <div className="px-3">
            <h2 className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Ajuda e Suporte
            </h2>
            <div className="space-y-1">
              {helpMenuItems.map(renderMenuItem)}
            </div>
          </div>
        </div>
        
        {/* Rodapé fixo no fundo do sidebar */}
        <div className="p-3 border-t border-gray-200">
          <div className="flex items-center px-4 py-2 text-sm text-gray-600">
            <div className="flex-1">
              Versão 1.0.0
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;