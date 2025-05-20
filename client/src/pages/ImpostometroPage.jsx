import React, { useState } from 'react';
import { 
  ArrowUp, 
  Info, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  FileText 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ImpostometroPage = () => {
  // Estados para os seletores de período
  const [mes, setMes] = useState('maio');
  const [ano, setAno] = useState('2025');
  
  // Dados simulados para o impostômetro
  const dadosImpostometro = {
    impostoTotal: 'R$ 12791,14',
    previsaoImpostos: 'R$ 20746,88',
    receitaBrutaAcumulada: 'R$ 256955,27',
    aliquotaSimples: '9.40%',
    fechamentoStatus: 'Pendente',
    fechamentoMesAno: 'abril/25'
  };
  
  // Dados simulados para as abas
  const dadosAbas = {
    vendas: [],
    compras: [],
    servicos: [],
    folhaPagto: [],
    fechamento: []
  };
  
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">Impostômetro</h1>
      
      {/* Seletores de período */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6 flex flex-wrap gap-3">
        <div className="flex items-center">
          <label htmlFor="mes" className="mr-2 text-gray-600 font-medium">Período:</label>
          <select 
            id="mes"
            className="border border-gray-200 rounded p-2 bg-white text-gray-700"
            value={mes}
            onChange={(e) => setMes(e.target.value)}
          >
            <option value="janeiro">janeiro</option>
            <option value="fevereiro">fevereiro</option>
            <option value="março">março</option>
            <option value="abril">abril</option>
            <option value="maio">maio</option>
            <option value="junho">junho</option>
            <option value="julho">julho</option>
            <option value="agosto">agosto</option>
            <option value="setembro">setembro</option>
            <option value="outubro">outubro</option>
            <option value="novembro">novembro</option>
            <option value="dezembro">dezembro</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <select 
            id="ano"
            className="border border-gray-200 rounded p-2 bg-white text-gray-700"
            value={ano}
            onChange={(e) => setAno(e.target.value)}
          >
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </div>
      
      {/* Painel principal do Impostômetro */}
      <div className="bg-red-500 text-white p-6 rounded-lg mb-6 relative overflow-hidden">
        <div className="absolute right-6 top-6">
          <DollarSign size={32} className="opacity-70" />
        </div>
        <h2 className="text-xl font-medium mb-2">Impostômetro ({mes}/{ano})</h2>
        <p className="text-sm mb-4 opacity-90">Estimativa de impostos sobre vendas registradas no período.</p>
        
        <div className="mt-2">
          <p className="text-4xl font-bold mb-1">{dadosImpostometro.impostoTotal}</p>
          <p className="text-sm opacity-80">Valores simulados para o período selecionado.</p>
        </div>
      </div>
      
      {/* Cards informativos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card de Previsão de Impostos */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Previsão Impostos<br />({mes}/{ano})</h3>
            <ArrowUp size={18} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{dadosImpostometro.previsaoImpostos}</p>
          <p className="text-xs text-gray-500 mt-1">Estimativa para o período.</p>
        </div>
        
        {/* Card de Receita Bruta Acumulada */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Receita Bruta<br />Acumulada ({ano})</h3>
            <TrendingUp size={18} className="text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{dadosImpostometro.receitaBrutaAcumulada}</p>
          <p className="text-xs text-gray-500 mt-1">Total de receita no ano.</p>
        </div>
        
        {/* Card de Alíquota Simples */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Alíquota Simples<br />({mes}/{ano})</h3>
            <Info size={18} className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{dadosImpostometro.aliquotaSimples}</p>
          <p className="text-xs text-gray-500 mt-1">Alíquota efetiva do Simples.</p>
        </div>
        
        {/* Card de Fechamento */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Fechamento ({dadosImpostometro.fechamentoMesAno})</h3>
            <AlertTriangle size={18} className="text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{dadosImpostometro.fechamentoStatus}</p>
          <p className="text-xs text-gray-500 mt-1">Status do fechamento anterior.</p>
        </div>
      </div>
      
      {/* Abas de dados */}
      <div className="bg-gray-50 rounded-lg border border-gray-200">
        <Tabs defaultValue="vendas">
          <TabsList className="bg-gray-200 p-0 rounded-t-lg border-b border-gray-300">
            <TabsTrigger value="vendas" className="rounded-none rounded-tl-lg py-3 px-4 text-sm font-medium data-[state=active]:bg-[#d9bb42] data-[state=active]:text-white">
              Vendas
            </TabsTrigger>
            <TabsTrigger value="compras" className="rounded-none py-3 px-4 text-sm font-medium data-[state=active]:bg-[#d9bb42] data-[state=active]:text-white">
              Compras
            </TabsTrigger>
            <TabsTrigger value="servicos" className="rounded-none py-3 px-4 text-sm font-medium data-[state=active]:bg-[#d9bb42] data-[state=active]:text-white">
              Serviços
            </TabsTrigger>
            <TabsTrigger value="folha" className="rounded-none py-3 px-4 text-sm font-medium data-[state=active]:bg-[#d9bb42] data-[state=active]:text-white">
              Folha Pagto.
            </TabsTrigger>
            <TabsTrigger value="fechamento" className="rounded-none rounded-tr-lg py-3 px-4 text-sm font-medium data-[state=active]:bg-[#d9bb42] data-[state=active]:text-white">
              Fechamento
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="vendas" className="p-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Resumo De Vendas</h3>
              <p className="text-sm text-gray-600 mb-8">Informações de vendas para {mes}/{ano}.</p>
              
              {dadosAbas.vendas.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Aqui viriam os dados de vendas */}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText size={48} className="text-gray-300 mb-4" />
                  <p className="text-gray-500">Detalhes de vendas para {mes}/{ano} aparecerão aqui.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="compras" className="p-6">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500">Detalhes de compras para {mes}/{ano} aparecerão aqui.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="servicos" className="p-6">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500">Detalhes de serviços para {mes}/{ano} aparecerão aqui.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="folha" className="p-6">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500">Detalhes da folha de pagamento para {mes}/{ano} aparecerão aqui.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="fechamento" className="p-6">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500">Detalhes do fechamento para {mes}/{ano} aparecerão aqui.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ImpostometroPage;