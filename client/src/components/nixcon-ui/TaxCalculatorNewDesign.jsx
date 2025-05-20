import React, { useState } from 'react';
import { Calculator, FileText, Plus, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import { NIXCONHeader, CompanyContext, InfoBanner } from './NIXCONHeader';
import NIXCONSidebar from './NIXCONSidebar';

// Componente para input padrão NIXCON
const NIXCONInput = ({ label, placeholder, type = 'text', icon, value, onChange, className = '' }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="block text-sm font-medium text-secondary mb-1">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={`block w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm`}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

// Componente para botão NIXCON
const NIXCONButton = ({ children, primary, icon: Icon, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        primary 
          ? 'bg-primary text-secondary shadow-sm hover:bg-primary-dark focus:ring-primary' 
          : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
      } ${className}`}
    >
      {Icon && <Icon size={18} className="mr-2" />}
      {children}
    </button>
  );
};

// Componente para o Card NIXCON
const NIXCONCard = ({ children, title, className = '' }) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden ${className}`}>
      {title && (
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-secondary">{title}</h3>
        </div>
      )}
      <div className="p-5">
        {children}
      </div>
    </div>
  );
};

// Componente para o cartão do Impostrômetro
const ImpostometroCard = ({ value, period }) => {
  return (
    <div className="bg-red-600 text-white rounded-md shadow-md overflow-hidden mb-6">
      <div className="px-5 py-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Impostômetro ({period})</h3>
          <DollarSign size={20} />
        </div>
        <div className="text-sm opacity-75">Estimativa de impostos sobre vendas registradas no período.</div>
      </div>
      <div className="px-5 pb-5">
        <div className="text-4xl font-bold">{value}</div>
        <div className="text-sm opacity-80">Valores simulados para o período selecionado.</div>
      </div>
    </div>
  );
};

// Componente para o cartão de estatísticas
const StatCard = ({ title, value, description, icon, color = 'blue', trend }) => {
  const bgColors = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    red: 'bg-red-50',
    yellow: 'bg-yellow-50',
  };
  
  const textColors = {
    blue: 'text-blue-700',
    green: 'text-green-700',
    red: 'text-red-700',
    yellow: 'text-yellow-700',
  };
  
  const borderColors = {
    blue: 'border-blue-100',
    green: 'border-green-100',
    red: 'border-red-100',
    yellow: 'border-yellow-100',
  };
  
  const iconBgColors = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    red: 'bg-red-100',
    yellow: 'bg-yellow-100',
  };
  
  return (
    <div className={`${bgColors[color]} ${borderColors[color]} border rounded-md p-4`}>
      <div className="flex justify-between items-start mb-2">
        <div className="text-sm font-medium text-gray-500">{title}</div>
        {icon && <div className={`p-1.5 rounded-full ${iconBgColors[color]}`}>{icon}</div>}
      </div>
      <div className={`text-xl font-bold ${textColors[color]}`}>{value}</div>
      {description && <div className="text-xs text-gray-500 mt-1">{description}</div>}
      {trend && (
        <div className="mt-2 text-xs flex items-center">
          <ArrowRight size={14} className="mr-1" />
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
};

// Componente para a lista de produtos
const ProductList = ({ products, onRemove }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <FileText className="mx-auto h-10 w-10 mb-2 text-gray-400" />
        <p>Nenhum produto adicionado na simulação</p>
      </div>
    );
  }
  
  return (
    <div className="mt-4 border rounded-md overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qtd</th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Unit.</th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product, index) => (
            <tr key={index}>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{product.nome}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">{product.quantidade}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.valorUnitario)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.valorTotal)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  onClick={() => onRemove(index)} 
                  className="text-red-600 hover:text-red-900"
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function TaxCalculatorNewDesign() {
  // Estados para o formulário da simulação
  const [simulationDate, setSimulationDate] = useState(new Date().toISOString().split('T')[0]);
  const [clientName, setClientName] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [products, setProducts] = useState([]);
  
  // Estado para mostrar resultados da simulação
  const [simulationResults, setSimulationResults] = useState(null);
  
  // Função para adicionar um produto de exemplo
  const addSampleProduct = () => {
    const newProduct = {
      id: Date.now(),
      nome: 'Produto de Exemplo',
      quantidade: 1,
      valorUnitario: 100,
      valorTotal: 100
    };
    
    setProducts([...products, newProduct]);
  };
  
  // Função para remover um produto
  const removeProduct = (index) => {
    const newProducts = [...products];
    newProducts.splice(index, 1);
    setProducts(newProducts);
  };
  
  // Função para calcular os impostos
  const calculateTaxes = () => {
    // Simulação de cálculo
    const totalProdutos = products.reduce((sum, product) => sum + product.valorTotal, 0);
    const finalValue = totalValue ? parseFloat(totalValue) : totalProdutos;
    
    const impostosVendas = finalValue * 0.13; // 13% de impostos (exemplo)
    const impostosCompras = finalValue * 0.05; // 5% de créditos (exemplo)
    const difal = finalValue * 0.02; // 2% de DIFAL (exemplo)
    const lucroBruto = finalValue - (impostosVendas + impostosCompras + difal);
    
    setSimulationResults({
      faturamentoTotal: finalValue,
      impostosVendas,
      impostosCompras,
      difal,
      lucroBruto,
      totalImpostos: impostosVendas + impostosCompras + difal,
      aliquotaEfetiva: ((impostosVendas + impostosCompras + difal) / finalValue * 100).toFixed(2)
    });
  };
  
  // Layout para desktop com sidebar
  const DesktopLayout = () => (
    <div className="flex h-screen bg-gray-50">
      <NIXCONSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <NIXCONHeader />
        
        <main className="flex-1 overflow-y-auto">
          <CompanyContext companyName="Comércio Varejista Alfa Ltda" />
          
          <div className="py-6 px-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
                  <Calculator className="mr-3 text-primary" />
                  Calculadora de Impostos e Custos
                </h1>
                <p className="text-gray-500 mt-1">Simule o impacto fiscal e o lucro de suas vendas.</p>
              </div>
            </div>
            
            <InfoBanner type="info">
              As alíquotas de impostos para Comércio Varejista Alfa Ltda são gerenciadas pelo escritório ou configuradas e aplicadas automaticamente.
            </InfoBanner>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <NIXCONCard title="Nova Simulação de Venda">
                  <p className="text-gray-500 mb-4">Preencha os dados para calcular os impostos e o lucro.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <NIXCONInput 
                      label="Data da Simulação"
                      type="date"
                      value={simulationDate}
                      onChange={(e) => setSimulationDate(e.target.value)}
                      icon={<Calendar size={16} className="text-gray-400" />}
                    />
                    
                    <NIXCONInput 
                      label="Cliente (Apelido ou Nome)"
                      placeholder="Ex: João Silva ou Cliente XYZ"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                    />
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-secondary mb-1">Produtos/Serviços</label>
                    <NIXCONButton 
                      onClick={addSampleProduct}
                      className="mb-2"
                      icon={Plus}
                    >
                      Adicionar Produto da Base Universal
                    </NIXCONButton>
                    
                    <ProductList products={products} onRemove={removeProduct} />
                  </div>
                  
                  <div className="mt-6">
                    <NIXCONInput 
                      label="Valor de Venda Total Global (Opcional)"
                      placeholder="Deixe em branco para usar soma dos itens"
                      type="number"
                      value={totalValue}
                      onChange={(e) => setTotalValue(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Se preenchido, o valor dos itens será rateado proporcionalmente.
                    </p>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <NIXCONButton primary onClick={calculateTaxes} icon={Calculator}>
                      Calcular Impostos
                    </NIXCONButton>
                  </div>
                </NIXCONCard>
              </div>
              
              <div className="lg:col-span-1">
                {simulationResults ? (
                  <div className="space-y-5">
                    <ImpostometroCard 
                      value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(simulationResults.totalImpostos)}
                      period="maio/2025"
                    />
                    
                    <StatCard 
                      title="Previsão Impostos (maio/2025)"
                      value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(simulationResults.impostosVendas)}
                      description="Estimativa para o período."
                      color="blue"
                      icon={<ArrowRight size={16} />}
                    />
                    
                    <StatCard 
                      title="Receita Bruta Acumulada (2025)"
                      value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(simulationResults.faturamentoTotal)}
                      description="Total de receita no ano."
                      color="blue"
                      icon={<DollarSign size={16} />}
                    />
                    
                    <StatCard 
                      title="Alíquota Simples (maio/2025)"
                      value={`${simulationResults.aliquotaEfetiva}%`}
                      description="Alíquota efetiva do Simples."
                      color="green"
                      icon={<Calculator size={16} />}
                    />
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
                    <Calculator className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Resumo da Simulação</h3>
                    <p className="text-gray-500">
                      Preencha os dados e clique em "Calcular Impostos" para ver os resultados.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
  
  // Layout para mobile sem sidebar
  const MobileLayout = () => (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NIXCONHeader />
      
      <CompanyContext companyName="Comércio Varejista Alfa Ltda" />
      
      <main className="flex-1">
        <div className="py-4 px-4">
          <h1 className="text-xl font-semibold text-gray-900 flex items-center mb-2">
            <Calculator className="mr-2 text-primary" size={20} />
            Calculadora de Impostos
          </h1>
          
          <InfoBanner type="info">
            As alíquotas de impostos são gerenciadas pelo escritório ou configuradas automaticamente.
          </InfoBanner>
          
          <NIXCONCard title="Nova Simulação de Venda" className="mb-6">
            <p className="text-gray-500 mb-4">Preencha os dados para calcular os impostos e o lucro.</p>
            
            <NIXCONInput 
              label="Data da Simulação"
              type="date"
              value={simulationDate}
              onChange={(e) => setSimulationDate(e.target.value)}
              icon={<Calendar size={16} className="text-gray-400" />}
            />
            
            <NIXCONInput 
              label="Cliente (Apelido ou Nome)"
              placeholder="Ex: João Silva ou Cliente XYZ"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-secondary mb-1">Produtos/Serviços</label>
              <NIXCONButton 
                onClick={addSampleProduct}
                className="mb-2 w-full justify-center"
                icon={Plus}
              >
                Adicionar Produto da Base Universal
              </NIXCONButton>
              
              <ProductList products={products} onRemove={removeProduct} />
            </div>
            
            <div className="mt-4">
              <NIXCONInput 
                label="Valor de Venda Total Global (Opcional)"
                placeholder="Deixe em branco para usar soma dos itens"
                type="number"
                value={totalValue}
                onChange={(e) => setTotalValue(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Se preenchido, o valor dos itens será rateado proporcionalmente.
              </p>
            </div>
            
            <div className="mt-6">
              <NIXCONButton 
                primary 
                onClick={calculateTaxes} 
                icon={Calculator}
                className="w-full justify-center"
              >
                Calcular Impostos
              </NIXCONButton>
            </div>
          </NIXCONCard>
          
          {simulationResults && (
            <div className="space-y-4">
              <ImpostometroCard 
                value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(simulationResults.totalImpostos)}
                period="maio/2025"
              />
              
              <StatCard 
                title="Previsão Impostos (maio/2025)"
                value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(simulationResults.impostosVendas)}
                description="Estimativa para o período."
                color="blue"
              />
              
              <StatCard 
                title="Alíquota Simples (maio/2025)"
                value={`${simulationResults.aliquotaEfetiva}%`}
                description="Alíquota efetiva do Simples."
                color="green"
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
  
  // Renderização responsiva
  return (
    <div>
      {/* Layout para desktop (visível apenas em telas md e maiores) */}
      <div className="hidden md:block">
        <DesktopLayout />
      </div>
      
      {/* Layout para mobile (visível apenas em telas menores que md) */}
      <div className="block md:hidden">
        <MobileLayout />
      </div>
    </div>
  );
}