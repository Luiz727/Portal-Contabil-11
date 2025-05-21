import React from 'react';
import { useEmpresas } from '../contexts/EmpresasContext';
import { useViewMode } from '../contexts/ViewModeContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Building2 } from 'lucide-react';

const EmpresaSelector = () => {
  const { viewMode } = useViewMode();
  const { empresas, empresaAtual, setEmpresaAtual, isLoading } = useEmpresas();

  // Só exibe o seletor se estiver no modo de visualização empresa
  if (viewMode !== 'empresa') {
    return null;
  }

  if (isLoading) {
    return (
      <div className="h-9 w-[230px] animate-pulse bg-gray-200 rounded"></div>
    );
  }

  // Se não houver empresas disponíveis
  if (empresas.length === 0) {
    return (
      <div className="flex items-center px-2 h-9 text-sm font-medium text-gray-500">
        <Building2 className="h-4 w-4 mr-2" />
        <span>Nenhuma empresa disponível</span>
      </div>
    );
  }

  // Se houver apenas uma empresa, exibir sem seletor
  if (empresas.length === 1) {
    return (
      <div className="flex items-center px-2 h-9 text-sm font-medium">
        <Building2 className="h-4 w-4 mr-2" />
        <span>{empresas[0].nome}</span>
      </div>
    );
  }

  return (
    <Select 
      value={empresaAtual?.id?.toString() || ""} 
      onValueChange={(value) => setEmpresaAtual(parseInt(value))}
    >
      <SelectTrigger className="w-[230px] h-9">
        <SelectValue>
          <div className="flex items-center">
            <Building2 className="h-4 w-4 mr-2" />
            <span>{empresaAtual?.nome || "Selecione uma empresa"}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {empresas.map((empresa) => (
          <SelectItem key={empresa.id} value={empresa.id.toString()}>
            <div className="flex items-center">
              <Building2 className="h-4 w-4 mr-2" />
              <div className="flex flex-col">
                <span className="font-medium">{empresa.nome}</span>
                <span className="text-xs text-gray-500">{empresa.cnpj}</span>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default EmpresaSelector;