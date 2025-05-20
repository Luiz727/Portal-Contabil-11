import React from 'react';
import IntegratedFiscalModule from '@/components/fiscal/IntegratedFiscalModule';

/**
 * Página principal do módulo fiscal integrado
 * Esta página usa o componente IntegratedFiscalModule para exibir todas 
 * as funcionalidades fiscais em um sistema de tabs
 */
const FiscalPage = () => {
  return (
    <div className="w-full h-full">
      <IntegratedFiscalModule />
    </div>
  );
};

export default FiscalPage;