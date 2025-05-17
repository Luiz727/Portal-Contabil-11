import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, BarChart2, Settings, Upload, Download, Printer, Package, Search, 
  FileDigit, ReceiptText, Users, Building, ShieldCheck, Menu, ArrowLeft,
  Banknote, TruckIcon, Database, FileSpreadsheet, BookText, Calculator, 
  ChevronLeft, ChevronRight, ArrowUpDown, PlusCircle, ScrollText,
  Factory, ShoppingCart, Tag, Box, Briefcase, Clipboard
} from 'lucide-react';

type FiscalLayoutProps = {
  children: React.ReactNode;
  activeSection?: 'dashboard' | 'emissor' | 'ajustes' | 'cadastros' | 'relatorios' | 'importacao' | 'comunicacao';
};

interface MenuSection {
  id: string;
  icon: React.ReactNode;
  label: string;
  path: string;
  submenu?: Array<{
    id: string;
    icon: React.ReactNode;
    label: string;
    path: string;
  }>;
}

const FiscalLayout: React.FC<FiscalLayoutProps> = ({ children, activeSection = 'dashboard' }) => {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('fiscalMenuCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [location] = useLocation();
  
  useEffect(() => {
    localStorage.setItem('fiscalMenuCollapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  const menuSections: MenuSection[] = [
    {
      id: 'dashboard',
      icon: <BarChart2 className="h-5 w-5" />,
      label: 'Dashboard',
      path: '/fiscal',
    },
    {
      id: 'cadastros',
      icon: <Database className="h-5 w-5" />,
      label: 'Cadastros',
      path: '/fiscal/cadastros',
      submenu: [
        {
          id: 'produtos',
          icon: <Package className="h-4 w-4" />,
          label: 'Produtos',
          path: '/fiscal/cadastros/produtos'
        },
        {
          id: 'servicos',
          icon: <Briefcase className="h-4 w-4" />,
          label: 'Serviços',
          path: '/fiscal/cadastros/servicos'
        },
        {
          id: 'clientes',
          icon: <Users className="h-4 w-4" />,
          label: 'Clientes',
          path: '/fiscal/cadastros/clientes'
        },
        {
          id: 'fornecedores',
          icon: <Factory className="h-4 w-4" />,
          label: 'Fornecedores',
          path: '/fiscal/cadastros/fornecedores'
        },
        {
          id: 'transportadoras',
          icon: <TruckIcon className="h-4 w-4" />,
          label: 'Transportadoras',
          path: '/fiscal/cadastros/transportadoras'
        },
        {
          id: 'formas-pagamento',
          icon: <Banknote className="h-4 w-4" />,
          label: 'Formas de Pagamento',
          path: '/fiscal/cadastros/formas-pagamento'
        }
      ]
    },
    {
      id: 'emissor',
      icon: <FileText className="h-5 w-5" />,
      label: 'Emissor',
      path: '/fiscal/emissor/nfe',
      submenu: [
        {
          id: 'emitir-nfe',
          icon: <FileText className="h-4 w-4" />,
          label: 'Emissão de NFe',
          path: '/fiscal/emissor/nfe'
        },
        {
          id: 'emitir-nfce',
          icon: <ShoppingCart className="h-4 w-4" />,
          label: 'Emissão de NFCe',
          path: '/fiscal/emissor/nfce'
        },
        {
          id: 'emitir-nfse',
          icon: <ReceiptText className="h-4 w-4" />,
          label: 'Emissão de NFSe',
          path: '/fiscal/emissor/nfse'
        },
        {
          id: 'consultar',
          icon: <Search className="h-4 w-4" />,
          label: 'Consultar Documentos',
          path: '/fiscal/emissor/consultar'
        }
      ]
    },
    {
      id: 'relatorios',
      icon: <FileSpreadsheet className="h-5 w-5" />,
      label: 'Relatórios',
      path: '/fiscal/relatorios',
      submenu: [
        {
          id: 'produtos',
          icon: <Package className="h-4 w-4" />,
          label: 'Produtos',
          path: '/fiscal/relatorios/produtos'
        },
        {
          id: 'vendas',
          icon: <ShoppingCart className="h-4 w-4" />,
          label: 'Vendas',
          path: '/fiscal/relatorios/vendas'
        }
      ]
    },
    {
      id: 'ajustes',
      icon: <Settings className="h-5 w-5" />,
      label: 'Ajustes',
      path: '/fiscal/ajustes/empresa',
      submenu: [
        {
          id: 'empresa',
          icon: <Building className="h-4 w-4" />,
          label: 'Configurações da Empresa',
          path: '/fiscal/ajustes/empresa'
        },
        {
          id: 'certificado',
          icon: <ShieldCheck className="h-4 w-4" />,
          label: 'Certificado Digital',
          path: '/fiscal/ajustes/certificado'
        }
      ]
    }
  ];

  const toggleMenu = () => {
    setCollapsed(!collapsed);
  };

  // Determina qual seção está ativa com base na URL atual
  const getActiveSectionFromPath = (path: string) => {
    for (const section of menuSections) {
      if (path === section.path || path.startsWith(section.path + '/')) return section.id;
      if (section.submenu) {
        for (const submenu of section.submenu) {
          if (path === submenu.path || path.startsWith(submenu.path + '/')) return section.id;
        }
      }
    }
    return 'dashboard';
  };

  const currentActiveSection = activeSection || getActiveSectionFromPath(location);

  // Header do módulo fiscal
  const FiscalHeader = () => (
    <header className="fixed top-0 left-0 right-0 bg-white border-b z-10 flex justify-between items-center px-4 py-2">
      <div className="flex items-center">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Button>
        </Link>
        <div className="font-medium text-lg">Módulo Fiscal</div>
        <div className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">v1.0</div>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-1" />
          Exportar
        </Button>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-1" />
          Importar
        </Button>
        <Button size="sm">
          <PlusCircle className="h-4 w-4 mr-1" />
          Nova Emissão
        </Button>
      </div>
    </header>
  );

  // Sidebar do módulo fiscal
  const FiscalSidebar = () => (
    <div className={`fixed left-0 top-[48px] bottom-0 z-20 flex flex-col bg-white border-r transition-all duration-300 ${collapsed ? 'w-[64px]' : 'w-[240px]'}`}>
      <div className="flex justify-end p-2 border-b">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleMenu} 
          className="w-8 h-8 p-0"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {menuSections.map(section => (
          <div key={section.id} className="mb-2">
            {collapsed ? (
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={section.path}>
                      <Button
                        variant={currentActiveSection === section.id ? "default" : "ghost"}
                        size="sm"
                        className={`w-full justify-center p-2 h-10 ${currentActiveSection === section.id ? 'bg-primary text-primary-foreground' : ''}`}
                      >
                        {section.icon}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {section.label}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Link href={section.path}>
                <Button
                  variant={currentActiveSection === section.id ? "default" : "ghost"}
                  size="sm"
                  className={`w-full justify-start text-left ${currentActiveSection === section.id ? 'bg-primary text-primary-foreground' : ''}`}
                >
                  <span className="flex items-center">
                    {section.icon}
                    <span className="ml-2">{section.label}</span>
                  </span>
                </Button>
              </Link>
            )}

            {/* Submenu */}
            {!collapsed && section.submenu && currentActiveSection === section.id && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 pl-2 border-muted">
                {section.submenu.map(item => {
                  const isActive = location === item.path;
                  return (
                    <Link key={item.id} href={item.path}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        size="sm"
                        className={`w-full justify-start text-left h-8 ${isActive ? 'font-medium' : 'font-normal'}`}
                      >
                        {item.icon}
                        <span className="ml-2 text-sm">{item.label}</span>
                      </Button>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Submenu para o modo colapsado (como tooltips) */}
            {collapsed && section.submenu && currentActiveSection === section.id && (
              <div className="mt-1 space-y-1">
                {section.submenu.map(item => {
                  const isActive = location === item.path;
                  return (
                    <TooltipProvider key={item.id} delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={item.path}>
                            <Button
                              variant={isActive ? "secondary" : "ghost"}
                              size="sm"
                              className={`w-full justify-center h-8 ${isActive ? 'bg-muted' : ''}`}
                            >
                              {item.icon}
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen flex-col">
      <FiscalHeader />
      <div className="flex flex-1 pt-[48px]">
        <FiscalSidebar />
        <main className="flex-1 overflow-auto transition-all duration-300" style={{ marginLeft: collapsed ? '64px' : '240px' }}>
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FiscalLayout;