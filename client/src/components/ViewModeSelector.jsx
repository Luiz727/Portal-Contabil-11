import React, { useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Building, 
  Calculator, 
  Store, 
  ChevronsUpDown, 
  Check, 
  Eye 
} from "lucide-react";
import { useViewMode, VIEW_MODES, VIEW_MODE_NAMES } from '@/contexts/ViewModeContext';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/useAuth';

const ViewModeSelector = () => {
  const { viewMode, changeViewMode, viewModeName } = useViewMode();
  const { isAdmin, isSuperAdmin } = useAuth();
  const [open, setOpen] = useState(false);

  // Verifique se o usuário é administrador ou superadmin
  const canChangeViewMode = isAdmin || isSuperAdmin;
  
  // Ícones para cada modo de visualização
  const viewModeIcons = {
    [VIEW_MODES.ACCOUNTING_OFFICE]: <Building size={16} className="text-[#d9bb42] mr-2" />,
    [VIEW_MODES.CLIENT_COMPANY]: <Store size={16} className="text-[#d9bb42] mr-2" />,
    [VIEW_MODES.EXTERNAL_ACCOUNTANT]: <Calculator size={16} className="text-[#d9bb42] mr-2" />,
    [VIEW_MODES.EXTERNAL_USER]: <User size={16} className="text-[#d9bb42] mr-2" />
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
      <DropdownMenuContent align="end" className="w-56">
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
        
        {/* Empresa Cliente */}
        <DropdownMenuItem 
          onClick={() => changeViewMode(VIEW_MODES.CLIENT_COMPANY)}
          className="cursor-pointer"
        >
          <Store size={16} className="text-[#d9bb42] mr-2" />
          <span>Visão da Empresa Cliente</span>
          {viewMode === VIEW_MODES.CLIENT_COMPANY && (
            <Check className="ml-auto h-4 w-4" />
          )}
        </DropdownMenuItem>
        
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ViewModeSelector;