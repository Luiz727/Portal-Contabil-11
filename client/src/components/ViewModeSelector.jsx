import React, { useState, useEffect } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Building, 
  Calculator, 
  Store, 
  ChevronsUpDown, 
  Check, 
  Eye,
  ChevronRight,
  Settings
} from "lucide-react";
import { useViewMode, VIEW_MODES, VIEW_MODE_NAMES } from '@/contexts/ViewModeContext';
import { useEmpresas } from '@/contexts/EmpresasContext';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/useAuth';

const ViewModeSelector = () => {
  const { viewMode, changeViewMode, viewModeName } = useViewMode();
  const { isAdmin, isSuperAdmin } = useAuth();
  const { empresas, empresaAtual, changeEmpresa } = useEmpresas();
  const [open, setOpen] = useState(false);

  // Verifique se o usuário é administrador ou superadmin
  const canChangeViewMode = isAdmin || isSuperAdmin;
  
  // Lista de empresas para seleção
  const [empresasList, setEmpresasList] = useState([
    { id: 'emp1', nome: 'Comércio ABC', cnpj: '12.345.678/0001-90' },
    { id: 'emp2', nome: 'Grupo Aurora', cnpj: '09.876.543/0001-21' },
    { id: 'emp3', nome: 'Holding XYZ', cnpj: '65.432.109/0001-87' }
  ]);
  
  useEffect(() => {
    // Se existir empresas no contexto, usa elas
    if (empresas && empresas.length > 0) {
      setEmpresasList(empresas);
    }
  }, [empresas]);
  
  // Ícones para cada modo de visualização
  const viewModeIcons = {
    [VIEW_MODES.ACCOUNTING_OFFICE]: <Building size={16} className="text-[#d9bb42] mr-2" />,
    [VIEW_MODES.CLIENT_COMPANY]: <Store size={16} className="text-[#d9bb42] mr-2" />,
    [VIEW_MODES.EXTERNAL_ACCOUNTANT]: <Calculator size={16} className="text-[#d9bb42] mr-2" />,
    [VIEW_MODES.EXTERNAL_USER]: <User size={16} className="text-[#d9bb42] mr-2" />
  };
  
  // Função para mudar a empresa e o modo de visualização
  const changeEmpresaAndMode = (empresaId, mode = VIEW_MODES.CLIENT_COMPANY) => {
    if (changeEmpresa) {
      changeEmpresa(empresaId);
    }
    changeViewMode(mode);
    setOpen(false);
  };

  // Se não é admin, mostrar apenas o modo atual
  if (!canChangeViewMode) {
    return (
      <div className="flex items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center px-3 py-2 rounded-md bg-gray-100 text-sm">
                {viewModeIcons[viewMode]}
                <span className="mr-1">{viewModeName}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Seu modo de visualização atual</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-dashed border-muted-foreground">
          <Eye className="mr-2 h-4 w-4 text-[#d9bb42]" />
          <span className="mr-1">{viewModeName}</span>
          <Badge variant="outline" className="ml-2 bg-amber-50 text-xs">Admin</Badge>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Mudar Modo de Visualização</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Escritório Contábil */}
        <DropdownMenuItem 
          onClick={() => changeViewMode(VIEW_MODES.ACCOUNTING_OFFICE)}
          className="cursor-pointer"
        >
          <Building size={16} className="text-[#d9bb42] mr-2" />
          <span>Visão do Escritório</span>
          {viewMode === VIEW_MODES.ACCOUNTING_OFFICE && (
            <Check className="ml-auto h-4 w-4" />
          )}
        </DropdownMenuItem>
        
        {/* Submenu para empresas clientes */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <Store size={16} className="text-[#d9bb42] mr-2" />
            <span>Visão da Empresa Cliente</span>
            {viewMode === VIEW_MODES.CLIENT_COMPANY && (
              <Check className="ml-auto h-4 w-4 mr-2" />
            )}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-64">
            <DropdownMenuLabel>Selecione a Empresa</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {empresasList.map((empresa) => (
              <DropdownMenuItem 
                key={empresa.id}
                className="cursor-pointer"
                onClick={() => changeEmpresaAndMode(empresa.id, VIEW_MODES.CLIENT_COMPANY)}
              >
                <Store size={16} className="text-[#d9bb42] mr-2" />
                <div className="flex flex-col">
                  <span className="text-sm">{empresa.nome}</span>
                  <span className="text-xs text-muted-foreground">{empresa.cnpj}</span>
                </div>
                {empresaAtual && empresaAtual.id === empresa.id && viewMode === VIEW_MODES.CLIENT_COMPANY && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/admin/configuracoes-empresa" className="cursor-pointer">
                <Eye size={16} className="text-[#d9bb42] mr-2" />
                <span>Configurar Empresa</span>
              </a>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        {/* Contador Externo */}
        <DropdownMenuItem 
          onClick={() => changeViewMode(VIEW_MODES.EXTERNAL_ACCOUNTANT)}
          className="cursor-pointer"
        >
          <Calculator size={16} className="text-[#d9bb42] mr-2" />
          <span>Visão de Contador Externo</span>
          {viewMode === VIEW_MODES.EXTERNAL_ACCOUNTANT && (
            <Check className="ml-auto h-4 w-4" />
          )}
        </DropdownMenuItem>
        
        {/* Usuário Externo */}
        <DropdownMenuItem 
          onClick={() => changeViewMode(VIEW_MODES.EXTERNAL_USER)}
          className="cursor-pointer"
        >
          <User size={16} className="text-[#d9bb42] mr-2" />
          <span>Visão de Usuário Externo</span>
          {viewMode === VIEW_MODES.EXTERNAL_USER && (
            <Check className="ml-auto h-4 w-4" />
          )}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Link para configurações de perfil e visualização */}
        <DropdownMenuItem asChild>
          <a href="/admin/configuracoes?tab=visualizacoes" className="cursor-pointer">
            <Eye size={16} className="text-[#d9bb42] mr-2" />
            <span>Configurar Perfis de Visualização</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ViewModeSelector;