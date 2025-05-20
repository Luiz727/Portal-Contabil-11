import React from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  FileText,
  CreditCard,
  Users,
  Building,
  UserCog,
  CalendarDays,
  Settings,
  Package,
  LineChart,
  MessageSquare,
  Calculator,
  ServerCog,
  Clipboard,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Definições das camadas de acesso
enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  ESCRITORIO = 'escritorio',
  EMPRESA = 'empresa',
  CLIENTE = 'cliente'
}

// Módulos do sistema
enum SystemModule {
  DASHBOARD = 'dashboard',
  FISCAL = 'fiscal',
  FINANCEIRO = 'financeiro',
  DOCUMENTOS = 'documentos',
  CLIENTES = 'clientes',
  EMPRESAS = 'empresas',
  USUARIOS = 'usuarios',
  TAREFAS = 'tarefas',
  CALENDARIO = 'calendario',
  HONORARIOS = 'honorarios',
  INVENTARIO = 'inventario',
  CONFIGURACOES = 'configuracoes',
  XML_VAULT = 'xmlVault',
  WHATSAPP = 'whatsapp',
  TAX_CALCULATOR = 'taxCalculator',
  BACKUP = 'backup',
  AUDIT = 'audit'
}

// Estrutura do item de menu
interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  module: SystemModule;
  roles: UserRole[];
}

/**
 * Componente de navegação que se adapta ao nível de acesso do usuário
 * Exibe apenas os itens de menu permitidos para o papel do usuário
 */
const LayeredNavigation = () => {
  const { user } = useAuth();
  const [location, navigate] = useLocation();
  
  // Determinação do papel do usuário (simplificado para desenvolvimento)
  const userRole = user?.role as UserRole || UserRole.SUPERADMIN;
  
  // Definição dos itens de menu com controle de acesso por papel
  const menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      path: '/',
      icon: <BarChart3 className="h-5 w-5" />,
      module: SystemModule.DASHBOARD,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.ESCRITORIO, UserRole.EMPRESA, UserRole.CLIENTE]
    },
    {
      label: 'Módulo Fiscal',
      path: '/fiscal',
      icon: <FileText className="h-5 w-5" />,
      module: SystemModule.FISCAL,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.ESCRITORIO, UserRole.EMPRESA]
    },
    {
      label: 'Financeiro',
      path: '/financeiro',
      icon: <CreditCard className="h-5 w-5" />,
      module: SystemModule.FINANCEIRO,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.ESCRITORIO, UserRole.EMPRESA]
    },
    {
      label: 'Documentos',
      path: '/documentos',
      icon: <Clipboard className="h-5 w-5" />,
      module: SystemModule.DOCUMENTOS,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.ESCRITORIO, UserRole.EMPRESA, UserRole.CLIENTE]
    },
    {
      label: 'Clientes',
      path: '/clientes',
      icon: <Users className="h-5 w-5" />,
      module: SystemModule.CLIENTES,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.ESCRITORIO, UserRole.EMPRESA]
    },
    {
      label: 'Empresas',
      path: '/empresas',
      icon: <Building className="h-5 w-5" />,
      module: SystemModule.EMPRESAS,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.ESCRITORIO]
    },
    {
      label: 'Usuários',
      path: '/usuarios',
      icon: <UserCog className="h-5 w-5" />,
      module: SystemModule.USUARIOS,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN]
    },
    {
      label: 'Tarefas',
      path: '/tarefas',
      icon: <Clipboard className="h-5 w-5" />,
      module: SystemModule.TAREFAS,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.ESCRITORIO, UserRole.EMPRESA]
    },
    {
      label: 'Calendário',
      path: '/calendario',
      icon: <CalendarDays className="h-5 w-5" />,
      module: SystemModule.CALENDARIO,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.ESCRITORIO, UserRole.EMPRESA]
    },
    {
      label: 'Honorários',
      path: '/honorarios',
      icon: <CreditCard className="h-5 w-5" />,
      module: SystemModule.HONORARIOS,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.ESCRITORIO]
    },
    {
      label: 'Inventário',
      path: '/inventario',
      icon: <Package className="h-5 w-5" />,
      module: SystemModule.INVENTARIO,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.ESCRITORIO, UserRole.EMPRESA]
    },
    {
      label: 'XML Vault',
      path: '/xml-vault',
      icon: <ServerCog className="h-5 w-5" />,
      module: SystemModule.XML_VAULT,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.ESCRITORIO, UserRole.EMPRESA]
    },
    {
      label: 'WhatsApp Connect',
      path: '/whatsapp',
      icon: <MessageSquare className="h-5 w-5" />,
      module: SystemModule.WHATSAPP,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.ESCRITORIO, UserRole.EMPRESA]
    },
    {
      label: 'Calculadora Fiscal',
      path: '/tax-calculator',
      icon: <Calculator className="h-5 w-5" />,
      module: SystemModule.TAX_CALCULATOR,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.ESCRITORIO, UserRole.EMPRESA, UserRole.CLIENTE]
    },
    {
      label: 'Backup & Restore',
      path: '/backup',
      icon: <ServerCog className="h-5 w-5" />,
      module: SystemModule.BACKUP,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN]
    },
    {
      label: 'Auditoria',
      path: '/audit',
      icon: <LineChart className="h-5 w-5" />,
      module: SystemModule.AUDIT,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN]
    },
    {
      label: 'Configurações',
      path: '/configuracoes',
      icon: <Settings className="h-5 w-5" />,
      module: SystemModule.CONFIGURACOES,
      roles: [UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.ESCRITORIO, UserRole.EMPRESA]
    }
  ];

  // Filtrar itens de menu com base no papel do usuário
  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <div className="h-full flex flex-col bg-white border-r p-4">
      {/* Logo da NIXCON */}
      <div className="flex items-center justify-center py-6 mb-6">
        <h1 className="text-xl font-bold text-primary">NIXCON</h1>
      </div>
      
      {/* Menu de navegação */}
      <nav className="space-y-1 flex-grow">
        {filteredMenuItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            className={cn(
              "w-full justify-start px-3 py-2 h-10 text-sm font-medium",
              location === item.path 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            onClick={() => navigate(item.path)}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Button>
        ))}
      </nav>
      
      {/* Informações do usuário e logout */}
      <div className="pt-6 mt-6 border-t">
        <div className="px-3 py-2">
          <p className="text-sm font-medium">{user?.nome || 'Usuário'}</p>
          <p className="text-xs text-muted-foreground">{user?.email || 'usuário@exemplo.com'}</p>
          <p className="text-xs text-primary mt-1">{userRole}</p>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start px-3 py-2 mt-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={() => navigate('/logout')}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sair
        </Button>
      </div>
    </div>
  );
};

export default LayeredNavigation;