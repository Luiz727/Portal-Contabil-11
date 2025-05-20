import React, { useState } from 'react';
import { useEmpresas } from '@/contexts/EmpresasContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Building2, User2, LogOut, ArrowLeftRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function EmpresaSelector() {
  const { 
    empresas, 
    actingAsEmpresa, 
    actAsEmpresa, 
    userType 
  } = useEmpresas();
  
  // Apenas usuários do escritório podem usar este seletor
  if (userType !== 'Escritorio') return null;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto text-xs sm:text-sm">
          {actingAsEmpresa ? (
            <>
              <Building2 className="mr-2 h-4 w-4" />
              <span className="max-w-[100px] sm:max-w-[200px] truncate">
                {actingAsEmpresa.nome}
              </span>
              <Badge variant="outline" className="ml-2 hidden sm:inline-flex">
                Cliente
              </Badge>
            </>
          ) : (
            <>
              <User2 className="mr-2 h-4 w-4" />
              <span>Escritório</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-[220px]">
        <DropdownMenuLabel>
          {actingAsEmpresa ? "Visualizando como cliente" : "Seu escritório"}
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {actingAsEmpresa ? (
          <DropdownMenuItem onClick={() => actAsEmpresa(null)}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Voltar para visão do escritório</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuLabel>Empresas Clientes</DropdownMenuLabel>
        )}
        
        {!actingAsEmpresa && (
          <>
            {empresas.map(empresa => (
              <DropdownMenuItem 
                key={empresa.id}
                onClick={() => actAsEmpresa(empresa)}
              >
                <ArrowLeftRight className="mr-2 h-4 w-4" />
                <span className="truncate">{empresa.nome}</span>
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}