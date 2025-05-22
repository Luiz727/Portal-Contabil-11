import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import {
  Shield,
  Users,
  Building2,
  Settings,
  Package,
  CreditCard,
  FileText,
  Layers,
  Lock,
  Database,
  ChevronRight
} from 'lucide-react';

interface AdminSidebarProps {
  className?: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ className }) => {
  const [location] = useLocation();

  const menuItems = [
    {
      title: 'Painel Administrativo',
      href: '/admin',
      icon: Shield,
      active: location === '/admin',
    },
    {
      title: 'Usuários e Acessos',
      items: [
        {
          title: 'Empresas Usuárias',
          href: '/admin/empresas-usuarias',
          icon: Building2,
          active: location === '/admin/empresas-usuarias',
        },
        {
          title: 'Usuários',
          href: '/admin/usuarios',
          icon: Users,
          active: location === '/admin/usuarios',
        },
        {
          title: 'Permissões',
          href: '/admin/permissoes',
          icon: Lock,
          active: location === '/admin/permissoes',
        },
      ],
    },
    {
      title: 'Configurações',
      items: [
        {
          title: 'Configurações Gerais',
          href: '/admin/configuracoes',
          icon: Settings,
          active: location === '/admin/configuracoes',
        },
        {
          title: 'Planos e Assinaturas',
          href: '/admin/planos',
          icon: CreditCard,
          active: location === '/admin/planos',
        },
      ],
    },
    {
      title: 'Conteúdo',
      items: [
        {
          title: 'Produtos Universais',
          href: '/admin/produtos-universais',
          icon: Package,
          active: location === '/admin/produtos-universais',
        },
        {
          title: 'Módulos do Sistema',
          href: '/admin/modulos',
          icon: Layers,
          active: location === '/admin/modulos',
        },
        {
          title: 'Gerenciamento de Dados',
          href: '/admin/dados',
          icon: Database,
          active: location === '/admin/dados',
        },
      ],
    },
  ];

  return (
    <nav className={cn("flex flex-col space-y-1 h-full p-4 bg-white border-r", className)}>
      <h3 className="font-medium text-amber-700 flex items-center mb-2 px-3 py-2">
        <Shield className="h-4 w-4 mr-2" />
        Administração
      </h3>

      <div className="space-y-4">
        {menuItems.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-1">
            {group.title && !group.href && (
              <h4 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {group.title}
              </h4>
            )}

            {group.href && (
              <Link href={group.href}>
                <div
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    group.active
                      ? "bg-amber-50 text-amber-700"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {group.icon && (
                    <group.icon className={cn(
                      "mr-3 h-5 w-5",
                      group.active ? "text-amber-500" : "text-gray-500"
                    )} />
                  )}
                  {group.title}
                </div>
              </Link>
            )}

            {group.items && (
              <div className="space-y-1 pl-0">
                {group.items.map((item, itemIndex) => (
                  <Link key={itemIndex} href={item.href}>
                    <div
                      className={cn(
                        "flex items-center pl-7 pr-3 py-2 text-sm font-medium rounded-md",
                        item.active
                          ? "bg-amber-50 text-amber-700"
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      {item.icon && (
                        <item.icon className={cn(
                          "mr-3 h-4 w-4",
                          item.active ? "text-amber-500" : "text-gray-500"
                        )} />
                      )}
                      {item.title}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t">
        <Link href="/">
          <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
            <ChevronRight className="mr-3 h-4 w-4 text-gray-500" />
            Voltar ao Sistema
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default AdminSidebar;