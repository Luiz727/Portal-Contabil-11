import React from 'react';
import { useLocation } from 'wouter';
import useLayeredAccess from '@/hooks/useLayeredAccess';

import { UserRole, SystemModule } from '../../shared/auth/permissions';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  FileText,
  Calculator,
  Users,
  Building2,
  Settings,
  FileArchive,
  Calendar,
  MessageSquare,
  DollarSign,
  Package,
  LogOut
} from 'lucide-react';

// Interface para os itens do menu
interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  module: SystemModule;
  roles: UserRole[];
}

/**
 * Componente de navegação que se adapta ao nível de acesso do usuário
 */
const LayeredNavigation = () => {
  const [location, navigate] = useLocation();
  const { userRole, canView, isSuperAdmin } = useLayeredAccess();
  
  // Lista completa de itens do menu
  const menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <BarChart3 className="w-5 h-5" />,
      module: SystemModule.DASHBOARD,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.ESCRITORIO, UserRole.EMPRESA]
    },
    {
      label: 'Fiscal',
      path: '/fiscal',
      icon: <FileText className="w-5 h-5" />,
      module: SystemModule.FISCAL,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.ESCRITORIO, UserRole.EMPRESA]
    },
    {
      label: 'Calculadora de Impostos',
      path: '/tax-calculator',
      icon: <Calculator className="w-5 h-5" />,
      module: SystemModule.TAX_CALCULATOR,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.ESCRITORIO, UserRole.EMPRESA, UserRole.CLIENTE]
    },
    {
      label: 'Clientes',
      path: '/clients',
      icon: <Users className="w-5 h-5" />,
      module: SystemModule.CLIENTES,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.ESCRITORIO, UserRole.EMPRESA]
    },
    {
      label: 'Empresas',
      path: '/empresas',
      icon: <Building2 className="w-5 h-5" />,
      module: SystemModule.EMPRESAS,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN]
    },
    {
      label: 'Documentos',
      path: '/documents',
      icon: <FileText className="w-5 h-5" />,
      module: SystemModule.DOCUMENTOS,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.ESCRITORIO, UserRole.EMPRESA, UserRole.CLIENTE]
    },
    {
      label: 'Honorários',
      path: '/honorarios',
      icon: <DollarSign className="w-5 h-5" />,
      module: SystemModule.HONORARIOS,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.ESCRITORIO]
    },
    {
      label: 'Tarefas',
      path: '/tasks',
      icon: <FileText className="w-5 h-5" />,
      module: SystemModule.TAREFAS,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.ESCRITORIO, UserRole.EMPRESA]
    },
    {
      label: 'Calendário',
      path: '/calendar',
      icon: <Calendar className="w-5 h-5" />,
      module: SystemModule.CALENDARIO,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.ESCRITORIO, UserRole.EMPRESA]
    },
    {
      label: 'XML Vault',
      path: '/xml-vault',
      icon: <FileArchive className="w-5 h-5" />,
      module: SystemModule.XML_VAULT,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.ESCRITORIO, UserRole.EMPRESA]
    },
    {
      label: 'WhatsApp',
      path: '/whatsapp',
      icon: <MessageSquare className="w-5 h-5" />,
      module: SystemModule.WHATSAPP,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.ESCRITORIO]
    },
    {
      label: 'Financeiro',
      path: '/financial',
      icon: <DollarSign className="w-5 h-5" />,
      module: SystemModule.FINANCEIRO,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.ESCRITORIO, UserRole.EMPRESA]
    },
    {
      label: 'Inventário',
      path: '/inventory',
      icon: <Package className="w-5 h-5" />,
      module: SystemModule.INVENTARIO,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.ESCRITORIO, UserRole.EMPRESA]
    },
    {
      label: 'Configurações',
      path: '/settings',
      icon: <Settings className="w-5 h-5" />,
      module: SystemModule.CONFIGURACOES,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN]
    },
  ];

  // Filtra os itens de menu com base no papel e permissões do usuário
  const filteredMenuItems = menuItems.filter(item => {
    // Superadmin vê tudo
    if (isSuperAdmin) {
      return true;
    }
    
    // Para outros usuários, verifica o papel e a permissão
    return item.roles.includes(userRole) && canView(item.module);
  });

  // Função para fazer logout
  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 border-r">
      <div className="p-4">
        <h2 className="text-2xl font-bold text-primary">NIXCON</h2>
        <p className="text-sm text-gray-500">Sistema de Contabilidade</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {filteredMenuItems.map((item) => (
            <li key={item.path}>
              <Button
                variant={location === item.path ? 'default' : 'ghost'}
                className={`w-full justify-start ${location === item.path ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'}`}
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Área do usuário */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-between">
          <div>
            {isSuperAdmin && (
              <div className="text-xs font-semibold text-primary mb-1">
                SUPERADMIN
              </div>
            )}
            <div className="text-sm font-medium">
              {isSuperAdmin ? 'Administrador NIXCON' : 'Usuário'}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LayeredNavigation;