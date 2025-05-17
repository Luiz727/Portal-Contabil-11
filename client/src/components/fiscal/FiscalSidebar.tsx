import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, BarChart2, Settings, Upload, Download, Printer, Package, Search, 
  FileDigit, ReceiptText, Users, Building, ShieldCheck, BookOpen, ClipboardList,
  Banknote, TruckIcon, Database, FileSpreadsheet, BookText, Calculator, 
  ChevronLeft, ChevronRight, Menu, ArrowUpDown, PlusCircle, ScrollText,
  Factory, ShoppingCart, Tag, Box, Briefcase, Clipboard
} from 'lucide-react';

type FiscalSidebarProps = {
  activeSection?: 'dashboard' | 'emissor' | 'ajustes' | 'cadastros' | 'relatorios' | 'importacao';
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

const FiscalSidebar: React.FC<FiscalSidebarProps> = ({ activeSection = 'dashboard' }) => {
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
          id: 'marcas',
          icon: <Tag className="h-4 w-4" />,
          label: 'Marcas',
          path: '/fiscal/cadastros/marcas'
        },
        {
          id: 'categorias',
          icon: <Clipboard className="h-4 w-4" />,
          label: 'Categorias',
          path: '/fiscal/cadastros/categorias'
        },
        {
          id: 'unidades',
          icon: <Box className="h-4 w-4" />,
          label: 'Unidades de Medida',
          path: '/fiscal/cadastros/unidades'
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
          id: 'kits',
          icon: <Box className="h-4 w-4" />,
          label: 'Kits',
          path: '/fiscal/cadastros/kits'
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
          path: '/fiscal/emissor/nfs'
        },
        {
          id: 'emitir-cte',
          icon: <TruckIcon className="h-4 w-4" />,
          label: 'Emissão de CTe',
          path: '/fiscal/emissor/cte'
        },
        {
          id: 'nfe-ajuste',
          icon: <FileText className="h-4 w-4" />,
          label: 'NFe Ajuste',
          path: '/fiscal/emissor/nfe-ajuste'
        },
        {
          id: 'nfe-complementar',
          icon: <FileText className="h-4 w-4" />,
          label: 'NFe Complementar',
          path: '/fiscal/emissor/nfe-complementar'
        },
        {
          id: 'consultar',
          icon: <Search className="h-4 w-4" />,
          label: 'Consultar Documentos',
          path: '/fiscal/emissor/consultar'
        },
        {
          id: 'notas-recebidas',
          icon: <FileDigit className="h-4 w-4" />,
          label: 'Notas Recebidas',
          path: '/fiscal/emissor/notas-recebidas'
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
          id: 'clientes',
          icon: <Users className="h-4 w-4" />,
          label: 'Clientes',
          path: '/fiscal/relatorios/clientes'
        },
        {
          id: 'estoque',
          icon: <Box className="h-4 w-4" />,
          label: 'Estoque',
          path: '/fiscal/relatorios/estoque'
        },
        {
          id: 'vendas',
          icon: <ShoppingCart className="h-4 w-4" />,
          label: 'Vendas',
          path: '/fiscal/relatorios/vendas'
        },
        {
          id: 'compras',
          icon: <ScrollText className="h-4 w-4" />,
          label: 'Compras',
          path: '/fiscal/relatorios/compras'
        }
      ]
    },
    {
      id: 'importacao',
      icon: <ArrowUpDown className="h-5 w-5" />,
      label: 'Importação/Exportação',
      path: '/fiscal/importacao',
      submenu: [
        {
          id: 'importar',
          icon: <Upload className="h-4 w-4" />,
          label: 'Importar',
          path: '/fiscal/importacao/importar'
        },
        {
          id: 'exportar',
          icon: <Download className="h-4 w-4" />,
          label: 'Exportar',
          path: '/fiscal/importacao/exportar'
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
        },
        {
          id: 'fiscais',
          icon: <FileDigit className="h-4 w-4" />,
          label: 'Configurações Fiscais',
          path: '/fiscal/ajustes/fiscais'
        },
        {
          id: 'nfe',
          icon: <FileText className="h-4 w-4" />,
          label: 'NF-e',
          path: '/fiscal/ajustes/nfe'
        },
        {
          id: 'nfce',
          icon: <ShoppingCart className="h-4 w-4" />,
          label: 'NFC-e',
          path: '/fiscal/ajustes/nfce'
        },
        {
          id: 'nfse',
          icon: <FileText className="h-4 w-4" />,
          label: 'NFS-e',
          path: '/fiscal/ajustes/nfse'
        },
        {
          id: 'matriz',
          icon: <Calculator className="h-4 w-4" />,
          label: 'Matriz Fiscal',
          path: '/fiscal/ajustes/matriz-fiscal'
        },
        {
          id: 'natureza',
          icon: <BookText className="h-4 w-4" />,
          label: 'Natureza de Operação',
          path: '/fiscal/ajustes/natureza-operacao'
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
      if (path === section.path) return section.id;
      if (section.submenu) {
        for (const submenu of section.submenu) {
          if (path === submenu.path) return section.id;
        }
      }
    }
    return 'dashboard';
  };

  const currentActiveSection = activeSection || getActiveSectionFromPath(location);

  // Renderiza o menu lateral
  return (
    <div className={`fixed left-0 top-[64px] bottom-0 z-20 flex flex-col bg-background border-r transform transition-all ${collapsed ? 'w-[64px]' : 'w-[250px]'}`}>
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
      
      {!collapsed && (
        <div className="p-2 border-t mt-auto">
          <div className="text-xs text-muted-foreground flex items-center justify-center">
            Módulo Fiscal v1.0
          </div>
        </div>
      )}
    </div>
  );
};

export default FiscalSidebar;