
import React from 'react';
import { Plus, Building2, Wallet, CreditCard } from 'lucide-react';

const FinancialPageResponsivo = () => {
  return (
    <div className="nixcon-container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Controle Financeiro</h1>
        <p className="text-gray-500">Gerenciamento de contas a pagar, receber e fluxo de caixa</p>
      </div>

      <button className="nixcon-btn nixcon-btn-primary mb-8">
        <Plus size={20} />
        Nova Transação
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="nixcon-card">
          <h3 className="text-lg font-medium mb-2">Receitas</h3>
          <p className="text-2xl font-bold text-green-600">R$ 0,00</p>
        </div>
        
        <div className="nixcon-card">
          <h3 className="text-lg font-medium mb-2">Despesas</h3>
          <p className="text-2xl font-bold text-red-600">R$ 0,00</p>
        </div>
        
        <div className="nixcon-card">
          <h3 className="text-lg font-medium mb-2">Saldo</h3>
          <p className="text-2xl font-bold text-blue-600">R$ 0,00</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Contas Financeiras</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="nixcon-card">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="text-primary" size={24} />
            <div>
              <h3 className="font-medium">Conta Bancária Principal</h3>
              <p className="text-sm text-gray-500">Banco do Brasil</p>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">Conta Corrente</p>
            <p className="text-lg font-medium">Saldo: R$ 25.000,00</p>
          </div>
        </div>

        <div className="nixcon-card">
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="text-primary" size={24} />
            <div>
              <h3 className="font-medium">Conta Poupança</h3>
              <p className="text-sm text-gray-500">Caixa Econômica</p>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">Poupança</p>
            <p className="text-lg font-medium">Saldo: R$ 75.000,00</p>
          </div>
        </div>

        <div className="nixcon-card">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="text-primary" size={24} />
            <div>
              <h3 className="font-medium">Cartão de Crédito</h3>
              <p className="text-sm text-gray-500">Nubank</p>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">Cartão de Crédito</p>
            <p className="text-lg font-medium">Saldo: R$ 3.500,00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialPageResponsivo;
