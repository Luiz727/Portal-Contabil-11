import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ChevronDown, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

// Tipos de usuário
type UserRole = 'admin' | 'accountant' | 'client';

// Item do menu
type MenuItem = {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: UserRole[];
  submenu?: MenuItem[];
};

// Propriedades do componente
type ResponsiveMenuProps = {
  isExpanded: boolean;
  toggleSidebar: () => void;
};

// Componente principal do menu responsivo
export default function ResponsiveMenu({ isExpanded, toggleSidebar }: ResponsiveMenuProps) {
  const { user } = useAuth();
  const [location, navigate] = useLocation();
  const [userRole, setUserRole] = useState<UserRole>('client');
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});

  // Detectar o papel do usuário com base nos dados de autenticação
  useEffect(() => {
    if (user?.role) {
      setUserRole(user.role as UserRole);
    }
  }, [user]);

  // Alternar a expansão de um item do menu
  const toggleSubmenu = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Verificar se um item do menu deve ser exibido para o perfil atual
  const shouldShowItem = (item: MenuItem) => {
    return item.roles.includes(userRole);
  };

  // Verificar se um item está ativo
  const isActive = (path: string) => {
    if (path === '/' && location !== '/') return false;
    return location === path || location.startsWith(`${path}/`);
  };

  // Renderizar um item do menu
  const renderMenuItem = (item: MenuItem, level = 0) => {
    if (!shouldShowItem(item)) return null;

    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isItemExpanded = expandedItems[item.id];
    const active = isActive(item.path);

    return (
      <div key={item.id} className={cn("mb-1", level > 0 && "ml-4")}>
        <div 
          className={cn(
            "flex items-center py-2 px-3 rounded-md cursor-pointer",
            "text-gray-700 hover:text-primary hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors",
            active && "bg-primary/10 text-primary font-medium"
          )}
          onClick={() => {
            if (hasSubmenu) {
              toggleSubmenu(item.id);
            } else {
              navigate(item.path);
            }
          }}
        >
          <span className="mr-3 text-xl">{item.icon}</span>
          {isExpanded && (
            <>
              <span className="flex-1">{item.label}</span>
              {hasSubmenu && (
                <ChevronDown 
                  className={cn(
                    "w-5 h-5 transition-transform", 
                    isItemExpanded && "transform rotate-180"
                  )} 
                />
              )}
            </>
          )}
        </div>

        {isExpanded && hasSubmenu && isItemExpanded && (
          <div className="mt-1 ml-2 border-l-2 border-gray-300 dark:border-gray-700 pl-2">
            {item.submenu?.map(subItem => renderMenuItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Definição dos itens do menu
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/',
      icon: <span className="icon">dashboard</span>,
      roles: ['admin', 'accountant', 'client']
    },
    {
      id: 'clients',
      label: 'Clientes',
      path: '/clients',
      icon: <span className="icon">business</span>,
      roles: ['admin', 'accountant']
    },
    {
      id: 'documents',
      label: 'Documentos',
      path: '/documents',
      icon: <span className="icon">description</span>,
      roles: ['admin', 'accountant', 'client']
    },
    {
      id: 'tasks',
      label: 'Tarefas',
      path: '/tasks',
      icon: <span className="icon">task_alt</span>,
      roles: ['admin', 'accountant', 'client']
    },
    {
      id: 'invoices',
      label: 'Notas Fiscais',
      path: '/invoices',
      icon: <span className="icon">receipt_long</span>,
      roles: ['admin', 'accountant', 'client'],
      submenu: [
        {
          id: 'nfe',
          label: 'NFe (Produtos)',
          path: '/invoices/nfe',
          icon: <span className="icon">inventory</span>,
          roles: ['admin', 'accountant', 'client']
        },
        {
          id: 'nfse',
          label: 'NFSe (Serviços)',
          path: '/invoices/nfse',
          icon: <span className="icon">handyman</span>,
          roles: ['admin', 'accountant', 'client']
        },
        {
          id: 'invoice-settings',
          label: 'Configurações',
          path: '/invoices/settings',
          icon: <span className="icon">settings</span>,
          roles: ['admin', 'accountant']
        }
      ]
    },
    {
      id: 'inventory',
      label: 'Estoque',
      path: '/inventory',
      icon: <span className="icon">inventory_2</span>,
      roles: ['admin', 'accountant', 'client'],
      submenu: [
        {
          id: 'products',
          label: 'Produtos',
          path: '/inventory/products',
          icon: <span className="icon">category</span>,
          roles: ['admin', 'accountant', 'client']
        },
        {
          id: 'suppliers',
          label: 'Fornecedores',
          path: '/inventory/suppliers',
          icon: <span className="icon">local_shipping</span>,
          roles: ['admin', 'accountant', 'client']
        },
        {
          id: 'movements',
          label: 'Movimentações',
          path: '/inventory/movements',
          icon: <span className="icon">sync_alt</span>,
          roles: ['admin', 'accountant', 'client']
        }
      ]
    },
    {
      id: 'financial',
      label: 'Financeiro',
      path: '/financial',
      icon: <span className="icon">payments</span>,
      roles: ['admin', 'accountant', 'client']
    },
    {
      id: 'reports',
      label: 'Relatórios',
      path: '/reports',
      icon: <span className="icon">bar_chart</span>,
      roles: ['admin', 'accountant', 'client']
    },
    {
      id: 'integrations',
      label: 'Integrações',
      path: '/integrations',
      icon: <span className="icon">sync</span>,
      roles: ['admin', 'accountant'],
      submenu: [
        {
          id: 'integranotas',
          label: 'Integranotas',
          path: '/integrations/integranotas',
          icon: <span className="icon">receipt</span>,
          roles: ['admin', 'accountant']
        },
        {
          id: 'whatsapp',
          label: 'WhatsApp',
          path: '/integrations/whatsapp',
          icon: <span className="icon">chat</span>,
          roles: ['admin', 'accountant']
        },
        {
          id: 'google',
          label: 'Google (Drive/Sheets)',
          path: '/integrations/google',
          icon: <span className="icon">cloud</span>,
          roles: ['admin', 'accountant']
        },
        {
          id: 'microsoft',
          label: 'Microsoft 365',
          path: '/integrations/microsoft',
          icon: <span className="icon">window</span>,
          roles: ['admin', 'accountant']
        },
        {
          id: 'webhooks',
          label: 'Webhooks',
          path: '/integrations/webhooks',
          icon: <span className="icon">webhook</span>,
          roles: ['admin']
        }
      ]
    },
    {
      id: 'settings',
      label: 'Configurações',
      path: '/settings',
      icon: <span className="icon">settings</span>,
      roles: ['admin', 'accountant', 'client']
    }
  ];

  return (
    <nav className={cn(
      "h-full bg-white dark:bg-gray-900 shadow-md transition-all duration-300 ease-in-out",
      isExpanded ? "w-64" : "w-16"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        {isExpanded && (
          <h1 className="text-xl font-bold text-primary">ContaSmart</h1>
        )}
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>
      
      <div className="p-2 overflow-y-auto max-h-[calc(100vh-64px)]">
        {menuItems.map(item => renderMenuItem(item))}
      </div>
    </nav>
  );
}