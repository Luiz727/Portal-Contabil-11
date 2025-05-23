import React from 'react';
import { 
  Settings, 
  User, 
  Users, 
  FileText, 
  CreditCard, 
  Lock, 
  Layers,
  LayoutDashboard
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from 'wouter';

/**
 * Painel Administrativo Central
 * 
 * Esta página funciona como um hub central para acessar todos os módulos administrativos,
 * enquanto a página ConfiguracoesAdminPage contém as configurações detalhadas do sistema
 * organizadas em abas.
 */
const PainelAdministrativoPage = () => {
  // Opções de configuração administrativa
  const menuOptions = [
    {
      id: 'planos',
      icon: <CreditCard className="h-5 w-5 text-[#d9bb42]" />,
      label: 'Planos e Assinaturas',
      path: '/admin/planos',
      description: 'Gerenciamento de planos e assinaturas'
    },
    {
      id: 'permissoes',
      icon: <Lock className="h-5 w-5 text-[#d9bb42]" />,
      label: 'Permissões e Acessos',
      path: '/admin/permissoes',
      description: 'Controle de permissões e acessos ao sistema'
    },
    {
      id: 'empresas',
      icon: <FileText className="h-5 w-5 text-[#d9bb42]" />,
      label: 'Empresas Usuárias',
      path: '/admin/empresas-usuarias',
      description: 'Gerenciamento de empresas clientes'
    },
    {
      id: 'usuarios',
      icon: <Users className="h-5 w-5 text-[#d9bb42]" />,
      label: 'Usuários',
      path: '/admin/usuarios',
      description: 'Gerenciamento de usuários do sistema'
    },
    {
      id: 'modulos',
      icon: <Layers className="h-5 w-5 text-[#d9bb42]" />,
      label: 'Módulos',
      path: '/admin/modulos',
      description: 'Configuração de módulos do sistema'
    },
    {
      id: 'configuracoes',
      icon: <Settings className="h-5 w-5 text-[#d9bb42]" />,
      label: 'Configurações Gerais',
      path: '/admin/configuracoes',
      description: 'Configurações gerais do sistema'
    }
  ];

  // Seções de gerenciamento
  const managementSections = [
    {
      id: 'planos',
      title: 'Gerenciamento de Planos e Assinaturas',
      description: 'Crie, edite e gerencie os planos de assinatura disponíveis para suas empresas usuárias.',
      path: '/admin/planos',
      icon: <CreditCard className="h-6 w-6 text-[#d9bb42]" />
    },
    {
      id: 'empresas',
      title: 'Gerenciamento de Empresas Usuárias',
      description: 'Cadastre e gerencie as empresas clientes do seu escritório contábil.',
      path: '/admin/empresas-usuarias',
      icon: <FileText className="h-6 w-6 text-[#d9bb42]" />
    },
    {
      id: 'produtos',
      title: 'Gerenciamento de Produtos Universais',
      description: 'Gerencie o catálogo de produtos compartilhados entre as empresas usuárias.',
      path: '/admin/produtos-universais',
      icon: <Layers className="h-6 w-6 text-[#d9bb42]" />
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 bg-[#d9bb42]/10 flex items-center justify-center rounded-lg">
          <Settings size={24} className="text-[#d9bb42]" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Configurações Administrativas</h1>
          <p className="text-gray-500">Gerencie planos, permissões e configurações do sistema</p>
        </div>
      </div>
      
      <div className="mb-4">
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">
          Acesso Administrador
        </Badge>
      </div>
      
      {/* Menu de opções administrativas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 bg-amber-50 p-4 rounded-lg mb-8">
        {menuOptions.map((option) => (
          <Link key={option.id} href={option.path}>
            <Button 
              variant="ghost" 
              className="w-full h-auto py-3 px-2 flex flex-col items-center justify-center gap-2 hover:bg-amber-100 rounded-md"
            >
              {option.icon}
              <span className="text-xs font-medium text-gray-700">{option.label}</span>
            </Button>
          </Link>
        ))}
      </div>
      
      {/* Seções de gerenciamento */}
      <div className="space-y-6">
        {managementSections.map((section) => (
          <Card key={section.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-gray-800 mb-1">
                      {section.title}
                    </h2>
                    <p className="text-gray-500">
                      {section.description}
                    </p>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <Link href={section.path}>
                    <Button className="bg-[#d9bb42] hover:bg-[#c5aa3a] text-white">
                      Acessar
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PainelAdministrativoPage;