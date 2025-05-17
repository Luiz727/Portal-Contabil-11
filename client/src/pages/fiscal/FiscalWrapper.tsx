import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  FileText, BarChart2, Settings, Upload, Download, Printer, Package, Search, 
  FileDigit, ReceiptText, Users, Building, ShieldCheck, BookOpen, ClipboardList,
  Banknote, TruckIcon, Database, FileSpreadsheet, BookText, Calculator, 
  ChevronLeft, ChevronRight, Menu, ArrowUpDown, PlusCircle, ScrollText,
  Factory, ShoppingCart, Tag, Box, Briefcase, Clipboard
} from 'lucide-react';

type FiscalWrapperProps = {
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

const FiscalWrapper: React.FC<FiscalWrapperProps> = ({ children, activeSection = 'dashboard' }) => {
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
      path: '/fiscal/emissor',
      submenu: [
        {
          id: 'emitir-nfe',
          icon: <FileText className="h-4 w-4" />,
          label: 'Emissão de NFe',
          path: '/fiscal/emissor/nfe'
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
      id: 'ajustes',
      icon: <Settings className="h-5 w-5" />,
      label: 'Ajustes',
      path: '/fiscal/ajustes',
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

  return (
    <div className="flex h-screen overflow-hidden">
      <div className={`fixed left-0 top-16 bottom-0 bg-white border-r z-10 transition-all ${collapsed ? 'w-16' : 'w-60'}`}>
        <div className="flex justify-between items-center p-2 border-b">
          <div className={`flex items-center ${collapsed ? 'hidden' : 'visible'}`}>
            <span className="text-sm font-medium">Módulo Fiscal</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={toggleMenu} 
            className="h-8 w-8 p-0"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="overflow-y-auto h-full py-2">
          {menuSections.map((section) => (
            <div key={section.id} className="mb-1">
              {collapsed ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={section.path}>
                        <Button
                          variant={currentActiveSection === section.id ? "secondary" : "ghost"}
                          size="sm"
                          className="w-full flex justify-center py-2"
                        >
                          {section.icon}
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {section.label}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Link href={section.path}>
                  <Button
                    variant={currentActiveSection === section.id ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full flex justify-start py-2"
                  >
                    <div className="flex items-center">
                      {section.icon}
                      <span className="ml-2">{section.label}</span>
                    </div>
                  </Button>
                </Link>
              )}

              {!collapsed && section.submenu && currentActiveSection === section.id && (
                <div className="ml-6 mt-1 border-l-2 pl-2 space-y-1">
                  {section.submenu.map(item => (
                    <Link key={item.id} href={item.path}>
                      <Button
                        variant={location === item.path ? "default" : "ghost"}
                        size="sm"
                        className="w-full flex justify-start py-1 h-8"
                      >
                        <div className="flex items-center">
                          {item.icon}
                          <span className="ml-2 text-sm">{item.label}</span>
                        </div>
                      </Button>
                    </Link>
                  ))}
                </div>
              )}

              {collapsed && section.submenu && currentActiveSection === section.id && (
                <div className="space-y-1 mt-1">
                  {section.submenu.map(item => (
                    <TooltipProvider key={item.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href={item.path}>
                            <Button
                              variant={location === item.path ? "default" : "ghost"}
                              size="sm"
                              className="w-full flex justify-center py-1 h-8"
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
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto pt-16" style={{ marginLeft: collapsed ? '4rem' : '15rem' }}>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FiscalWrapper;