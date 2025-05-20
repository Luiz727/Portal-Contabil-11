
import React from 'react';
import { Plus } from 'lucide-react';

const FinancialPageResponsivo = () => {
  return (
    <div className="nixcon-container">
      <header className="mb-6">
        <h1 className="nixcon-title">Controle Financeiro</h1>
        <p className="nixcon-text">Gerenciamento de contas a pagar, receber e fluxo de caixa</p>
      </header>

      <button className="nixcon-btn nixcon-btn-primary w-full sm:w-auto mb-8">
        <Plus size={20} />
        Nova Transação
      </button>

      <div className="nixcon-grid nixcon-grid-md-3 gap-4 mb-8">
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

      <h2 className="nixcon-subtitle mb-4">Contas Financeiras</h2>
      
      <div className="nixcon-grid nixcon-grid-md-3 gap-4">
        <div className="nixcon-card nixcon-dashboard-card">
          <div className="nixcon-flex nixcon-items-center gap-3 mb-4">
            <span className="material-icons text-primary">account_balance</span>
            <div>
              <h3 className="font-medium">Conta Bancária Principal</h3>
              <p className="text-sm text-neutral-500">Banco do Brasil</p>
            </div>
          </div>
          <div className="pt-4 border-t border-neutral-100">
            <p className="text-sm text-neutral-500">Conta Corrente</p>
            <p className="text-lg font-medium">Saldo: R$ 25.000,00</p>
          </div>
        </div>

        <div className="nixcon-card nixcon-dashboard-card">
          <div className="nixcon-flex nixcon-items-center gap-3 mb-4">
            <span className="material-icons text-primary">savings</span>
            <div>
              <h3 className="font-medium">Conta Poupança</h3>
              <p className="text-sm text-neutral-500">Caixa Econômica</p>
            </div>
          </div>
          <div className="pt-4 border-t border-neutral-100">
            <p className="text-sm text-neutral-500">Poupança</p>
            <p className="text-lg font-medium">Saldo: R$ 75.000,00</p>
          </div>
        </div>

        <div className="nixcon-card nixcon-dashboard-card">
          <div className="nixcon-flex nixcon-items-center gap-3 mb-4">
            <span className="material-icons text-primary">credit_card</span>
            <div>
              <h3 className="font-medium">Cartão de Crédito</h3>
              <p className="text-sm text-neutral-500">Nubank</p>
            </div>
          </div>
          <div className="pt-4 border-t border-neutral-100">
            <p className="text-sm text-neutral-500">Cartão de Crédito</p>
            <p className="text-lg font-medium">Saldo: R$ 3.500,00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialPageResponsivo;
