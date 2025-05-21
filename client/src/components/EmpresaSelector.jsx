import React from 'react';
import { useEmpresas } from '../contexts/EmpresasContext';
import { useViewMode } from '../contexts/ViewModeContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Building2 } from 'lucide-react';

const EmpresaSelector = () => {
  const { empresas, empresaAtual, setEmpresaAtual, isLoading } = useEmpresas();
  const { viewMode } = useViewMode();

  // Não exibe o seletor se não estiver no modo empresa
  if (viewMode !== 'empresa') {
    return null;
  }

  if (isLoading) {
    return (
      <div className="h-9 w-[220px] animate-pulse bg-gray-200 rounded"></div>
    );
  }

  // Se não houver empresas ou apenas uma, exibe apenas o nome
  if (!empresas || empresas.length <= 1) {
    return (
      <div className="flex items-center px-2 h-9 text-sm font-medium">
        <Building2 className="h-4 w-4 mr-2" />
        <span>{empresaAtual?.nome || 'Nenhuma empresa disponível'}</span>
      </div>
    );
  }

  return (
    <Select 
      value={empresaAtual?.id?.toString()} 
      onValueChange={(value) => setEmpresaAtual(parseInt(value))}
    >
      <SelectTrigger className="w-[220px] h-9">
        <SelectValue>
          <div className="flex items-center">
            <Building2 className="h-4 w-4 mr-2" />
            <span>{empresaAtual?.nome || 'Selecione uma empresa'}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {empresas.map((empresa) => (
          <SelectItem key={empresa.id} value={empresa.id.toString()}>
            <div className="flex items-center">
              <Building2 className="h-4 w-4 mr-2" />
              <span>{empresa.nome}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default EmpresaSelector;