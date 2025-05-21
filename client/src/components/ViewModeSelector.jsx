import React from 'react';
import { useViewMode } from '../contexts/ViewModeContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Briefcase, Building2, User, Users } from 'lucide-react';

// Componente que mostra o ícone apropriado para cada modo de visualização
const ViewModeIcon = ({ mode }) => {
  switch (mode) {
    case 'escritorio':
      return <Briefcase className="h-4 w-4 mr-2" />;
    case 'empresa':
      return <Building2 className="h-4 w-4 mr-2" />;
    case 'contador':
      return <User className="h-4 w-4 mr-2" />;
    case 'externo':
      return <Users className="h-4 w-4 mr-2" />;
    default:
      return <Briefcase className="h-4 w-4 mr-2" />;
  }
};

const ViewModeSelector = () => {
  const { viewMode, viewModeName, setViewMode, availableViewModes, isLoading } = useViewMode();

  if (isLoading) {
    return (
      <div className="h-9 w-[180px] animate-pulse bg-gray-200 rounded"></div>
    );
  }

  // Se o usuário tiver apenas um modo disponível, exibir apenas o nome (sem seletor)
  if (availableViewModes.length <= 1) {
    return (
      <div className="flex items-center px-2 h-9 text-sm font-medium">
        <ViewModeIcon mode={viewMode} />
        <span>{viewModeName}</span>
      </div>
    );
  }

  return (
    <Select 
      value={viewMode} 
      onValueChange={setViewMode}
    >
      <SelectTrigger className="w-[180px] h-9">
        <SelectValue>
          <div className="flex items-center">
            <ViewModeIcon mode={viewMode} />
            <span>{viewModeName}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {availableViewModes.map((vm) => (
          <SelectItem key={vm.id} value={vm.id}>
            <div className="flex items-center">
              <ViewModeIcon mode={vm.id} />
              <span>{vm.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ViewModeSelector;