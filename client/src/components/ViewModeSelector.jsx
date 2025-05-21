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
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
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
  Settings,
  Shield,
  Users
} from "lucide-react";
import { useViewMode, VIEW_MODES, VIEW_MODE_NAMES } from '@/contexts/ViewModeContext';
import { useEmpresas } from '@/contexts/EmpresasContext';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/useAuth';

const ViewModeSelector = () => {
  const { 
    viewMode, 
    changeViewMode, 
    viewModeName, 
    currentCompany, 
    activeProfile, 
    profiles,
    setActiveProfile
  } = useViewMode();
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
    [VIEW_MODES.ESCRITORIO]: <Building size={16} className="text-[#d9bb42] mr-2" />,
    [VIEW_MODES.EMPRESA]: <Store size={16} className="text-[#d9bb42] mr-2" />,
    [VIEW_MODES.CONTADOR]: <Calculator size={16} className="text-[#d9bb42] mr-2" />,
    [VIEW_MODES.EXTERNO]: <User size={16} className="text-[#d9bb42] mr-2" />
  };
  
  // Função para mudar a empresa e o modo de visualização
  const changeEmpresaAndMode = (empresa, mode = VIEW_MODES.EMPRESA) => {
    if (changeEmpresa) {
      changeEmpresa(empresa.id);
    }
    
    // Passa a empresa selecionada para o changeViewMode
    changeViewMode(mode, empresa);
    setOpen(false);
  };
  
  // Função para alterar apenas o perfil ativo
  const changeActiveProfile = (profileId) => {
    if (profiles[profileId]) {
      setActiveProfile(profiles[profileId]);
      localStorage.setItem('nixcon_active_profile', JSON.stringify(profiles[profileId]));
    }
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
                {activeProfile && (
                  <Badge variant="outline" className="ml-2 bg-amber-50 text-xs">
                    {activeProfile.nome}
                  </Badge>
                )}
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
          {activeProfile && (
            <Badge variant="outline" className="ml-2 bg-amber-50 text-xs">
              {activeProfile.nome}
            </Badge>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Mudar Modo de Visualização</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Escritório Contábil */}
        <DropdownMenuItem 
          onClick={() => changeViewMode(VIEW_MODES.ESCRITORIO)}
          className="cursor-pointer"
        >
          <Building size={16} className="text-[#d9bb42] mr-2" />
          <span>Visão do Escritório</span>
          {viewMode === VIEW_MODES.ESCRITORIO && (
            <Check className="ml-auto h-4 w-4" />
          )}
        </DropdownMenuItem>
        
        {/* Submenu para empresas clientes */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <Store size={16} className="text-[#d9bb42] mr-2" />
            <span>Visão da Empresa</span>
            {viewMode === VIEW_MODES.EMPRESA && (
              <Check className="ml-auto h-4 w-4 mr-2" />
            )}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-72">
            <DropdownMenuLabel>Selecione a Empresa</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {empresasList.map((empresa) => (
              <DropdownMenuItem 
                key={empresa.id}
                className="cursor-pointer"
                onClick={() => changeEmpresaAndMode(empresa, VIEW_MODES.EMPRESA)}
              >
                <Store size={16} className="text-[#d9bb42] mr-2" />
                <div className="flex flex-col">
                  <span className="text-sm">{empresa.nome}</span>
                  <span className="text-xs text-muted-foreground">{empresa.cnpj}</span>
                </div>
                {empresaAtual && empresaAtual.id === empresa.id && viewMode === VIEW_MODES.EMPRESA && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/admin/configuracoes-empresa" className="cursor-pointer">
                <Settings size={16} className="text-[#d9bb42] mr-2" />
                <span>Configurar Empresas</span>
              </a>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        {/* Contador - Com submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <Calculator size={16} className="text-[#d9bb42] mr-2" />
            <span>Visão de Contador</span>
            {viewMode === VIEW_MODES.CONTADOR && (
              <Check className="ml-auto h-4 w-4 mr-2" />
            )}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-64">
            <DropdownMenuLabel>Selecione o Perfil</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {Object.values(profiles).filter(profile => 
              profile.id.includes('contador_')
            ).map((profile) => (
              <DropdownMenuItem 
                key={profile.id}
                className="cursor-pointer"
                onClick={() => {
                  changeViewMode(VIEW_MODES.CONTADOR);
                  changeActiveProfile(profile.id);
                }}
              >
                <Users size={16} className="text-[#d9bb42] mr-2" />
                <div className="flex flex-col">
                  <span className="text-sm">{profile.nome || 'Contador'}</span>
                  <span className="text-xs text-muted-foreground">
                    {profile.permissoes?.length || 0} permissões
                  </span>
                </div>
                {activeProfile && activeProfile.id === profile.id && viewMode === VIEW_MODES.CONTADOR && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}
            
            {/* Se não houver perfis específicos, mostrar a opção padrão */}
            {!Object.values(profiles).filter(profile => profile.id.includes('contador_')).length && (
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => changeViewMode(VIEW_MODES.CONTADOR)}
              >
                <Users size={16} className="text-[#d9bb42] mr-2" />
                <span>Contador Padrão</span>
                {viewMode === VIEW_MODES.CONTADOR && !activeProfile?.id.includes('contador_') && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
            )}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        {/* Usuário Externo - Com submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <User size={16} className="text-[#d9bb42] mr-2" />
            <span>Visão Externa</span>
            {viewMode === VIEW_MODES.EXTERNO && (
              <Check className="ml-auto h-4 w-4 mr-2" />
            )}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-64">
            <DropdownMenuLabel>Selecione o Perfil</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {Object.values(profiles).filter(profile => 
              profile.id.includes('externo_')
            ).map((profile) => (
              <DropdownMenuItem 
                key={profile.id}
                className="cursor-pointer"
                onClick={() => {
                  changeViewMode(VIEW_MODES.EXTERNO);
                  changeActiveProfile(profile.id);
                }}
              >
                <Users size={16} className="text-[#d9bb42] mr-2" />
                <div className="flex flex-col">
                  <span className="text-sm">{profile.nome || 'Usuário Externo'}</span>
                  <span className="text-xs text-muted-foreground">
                    {profile.permissoes?.length || 0} permissões
                  </span>
                </div>
                {activeProfile && activeProfile.id === profile.id && viewMode === VIEW_MODES.EXTERNO && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}
            
            {/* Se não houver perfis específicos, mostrar a opção padrão */}
            {!Object.values(profiles).filter(profile => profile.id.includes('externo_')).length && (
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => changeViewMode(VIEW_MODES.EXTERNO)}
              >
                <Users size={16} className="text-[#d9bb42] mr-2" />
                <span>Usuário Externo Padrão</span>
                {viewMode === VIEW_MODES.EXTERNO && !activeProfile?.id.includes('externo_') && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
            )}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        <DropdownMenuSeparator />
        
        {/* Submenu para perfis de visualização */}
        {viewMode === VIEW_MODES.EMPRESA && currentCompany && (
          <>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer">
                <Shield size={16} className="text-[#d9bb42] mr-2" />
                <span>Perfil de Visualização</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-64">
                <DropdownMenuLabel>Selecione o Perfil</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {Object.values(profiles).filter(profile => 
                  profile.id.includes('empresa_')
                ).map((profile) => (
                  <DropdownMenuItem 
                    key={profile.id}
                    className="cursor-pointer"
                    onClick={() => changeActiveProfile(profile.id)}
                  >
                    <Users size={16} className="text-[#d9bb42] mr-2" />
                    <div className="flex flex-col">
                      <span className="text-sm">{profile.nome}</span>
                      <span className="text-xs text-muted-foreground">
                        {profile.permissoes.length} permissões
                      </span>
                    </div>
                    {activeProfile && activeProfile.id === profile.id && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
          </>
        )}
        
        {/* Link para configurações de perfil e visualização */}
        <DropdownMenuItem asChild>
          <a href="/admin/configuracoes?tab=visualizacoes" className="cursor-pointer">
            <Settings size={16} className="text-[#d9bb42] mr-2" />
            <span>Configurar Perfis de Visualização</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ViewModeSelector;