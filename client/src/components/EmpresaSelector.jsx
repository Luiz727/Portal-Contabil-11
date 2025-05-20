import React, { useState } from 'react';
import { useEmpresas } from '@/contexts/EmpresasContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Building2, User2, LogOut, ArrowLeftRight, ChevronDown, Building, Check, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export default function EmpresaSelector() {
  const { 
    empresas, 
    actingAsEmpresa, 
    actAsEmpresa, 
    userType 
  } = useEmpresas();
  
  const [searchTerm, setSearchTerm] = useState("");
  
  // Apenas usuários do escritório podem usar este seletor
  if (userType !== 'Escritorio') return null;
  
  // Filtrar empresas baseado na busca
  const filteredEmpresas = searchTerm 
    ? empresas.filter(empresa => 
        empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empresa.cnpj?.includes(searchTerm)
      )
    : empresas;
  
  // Obter as iniciais da empresa para o Avatar
  const getInitials = (name) => {
    if (!name) return 'EC';
    const words = name.split(' ');
    if (words.length === 1) return name.substring(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`
            ml-auto text-xs sm:text-sm px-3 transition-all duration-200 
            flex items-center h-9 
            ${actingAsEmpresa ? 'bg-primary/5 border-primary/20 hover:bg-primary/10' : ''}
          `}
        >
          {actingAsEmpresa ? (
            <>
              <Avatar className="h-5 w-5 mr-2 border border-primary/10">
                <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                  {getInitials(actingAsEmpresa.nome)}
                </AvatarFallback>
              </Avatar>
              <span className="max-w-[80px] sm:max-w-[140px] truncate font-medium">
                {actingAsEmpresa.nome}
              </span>
              <Badge variant="secondary" className="ml-1.5 h-5 hidden sm:inline-flex">
                Cliente
              </Badge>
              <ChevronDown className="ml-1.5 h-3.5 w-3.5 opacity-70" />
            </>
          ) : (
            <>
              <User2 className="mr-2 h-4 w-4 text-primary" />
              <span>Escritório</span>
              <ChevronDown className="ml-1.5 h-3.5 w-3.5 opacity-70" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-[280px] p-2">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Avatar className="h-8 w-8 mr-1">
            {actingAsEmpresa ? (
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(actingAsEmpresa.nome)}
              </AvatarFallback>
            ) : (
              <AvatarFallback className="bg-primary text-primary-foreground">
                <User2 className="h-4 w-4" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">
              {actingAsEmpresa ? actingAsEmpresa.nome : "NIXCON Contabilidade"}
            </p>
            <p className="text-xs text-muted-foreground">
              {actingAsEmpresa ? "Visualização do cliente" : "Visão do escritório"}
            </p>
          </div>
        </div>
        
        <DropdownMenuSeparator className="my-1.5" />
        
        {actingAsEmpresa ? (
          <DropdownMenuItem 
            className="flex items-center py-2 cursor-pointer" 
            onClick={() => actAsEmpresa(null)}
          >
            <div className="mr-2 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
              <LogOut className="h-3.5 w-3.5 text-primary" />
            </div>
            <span>Voltar para visão do escritório</span>
          </DropdownMenuItem>
        ) : (
          <>
            <div className="px-2 pb-1.5">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Filtrar empresas..."
                  className="pl-8 h-9 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <DropdownMenuGroup className="max-h-[200px] overflow-y-auto">
              {filteredEmpresas.length > 0 ? (
                filteredEmpresas.map(empresa => (
                  <DropdownMenuItem 
                    key={empresa.id}
                    className="py-2 cursor-pointer"
                    onClick={() => {
                      actAsEmpresa(empresa);
                      setSearchTerm("");
                    }}
                  >
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {getInitials(empresa.nome)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="truncate text-sm">{empresa.nome}</span>
                      {empresa.cnpj && (
                        <span className="text-xs text-muted-foreground">
                          CNPJ: {empresa.cnpj}
                        </span>
                      )}
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="text-center py-2 text-sm text-muted-foreground">
                  Nenhuma empresa encontrada
                </div>
              )}
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}