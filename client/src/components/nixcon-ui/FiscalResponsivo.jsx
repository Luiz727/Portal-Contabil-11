import React, { useState } from 'react';
import { 
  BarChart2, 
  Plus, 
  Search, 
  FileText, 
  PackageOpen,
  ReceiptText,
  DollarSign
} from 'lucide-react';

const FiscalResponsivo = () => {
  const [periodo, setPeriodo] = useState('maio2025');
  
  // Dados simulados para o dashboard
  const dashboardData = {
    totalEmitido: 'R$ 87.450,25',
    qtdDocumentos: '123',
    ticketMedio: 'R$ 710,98',
    produtosAtivos: '458',
    
    variacaoTotal: '+12,5%',
    variacaoQtd: '+8,3%',
    variacaoTicket: '-2,1%',
    variacaoProdutos: '+5,7%',
  };

  return (
    <div className="nixcon-container nixcon-p-4 nixcon-space-y-6">
      {/* Título da página */}
      <div className="nixcon-flex nixcon-flex-col nixcon-gap-2">
        <h1 className="nixcon-title">Módulo Fiscal</h1>
        <p className="nixcon-text">Gerenciamento completo de documentos e obrigações fiscais</p>
      </div>

      {/* Botões de ação principais */}
      <div className="nixcon-grid nixcon-grid-cols-1 sm:nixcon-grid-cols-2 nixcon-gap-4">
        <button className="nixcon-btn nixcon-btn-primary nixcon-flex nixcon-items-center nixcon-justify-center nixcon-gap-2">
          <Plus size={18} />
          <span>Nova Emissão</span>
        </button>
        <button className="nixcon-btn nixcon-btn-outline nixcon-flex nixcon-items-center nixcon-justify-center nixcon-gap-2">
          <Search size={18} />
          <span>Consultar</span>
        </button>
      </div>

      {/* Navegação de seções */}
      <div className="nixcon-flex nixcon-flex-wrap nixcon-gap-2 nixcon-border-b nixcon-border-gray-200 nixcon-pb-2">
        <button className="nixcon-btn nixcon-btn-link nixcon-text-primary nixcon-font-medium">
          <BarChart2 size={16} className="nixcon-mr-2" />
          Dashboard
        </button>
        <button className="nixcon-btn nixcon-btn-link nixcon-text-[rgb(55,65,81)]">
          <FileText size={16} className="nixcon-mr-2" />
          Emissor
        </button>
        <button className="nixcon-btn nixcon-btn-link nixcon-text-[rgb(55,65,81)]">
          <PackageOpen size={16} className="nixcon-mr-2" />
          Cadastros
        </button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="nixcon-grid nixcon-grid-cols-1 md:nixcon-grid-cols-2 lg:nixcon-grid-cols-3 nixcon-gap-4">
        {/* Card de Total Emitido */}
        <div className="nixcon-card nixcon-p-4">
          <div className="nixcon-flex nixcon-items-start nixcon-justify-between nixcon-mb-4">
            <div>
              <p className="nixcon-text-sm nixcon-text-gray-500">Total Emitido (Mês)</p>
            </div>
            <div className="nixcon-flex nixcon-items-center nixcon-justify-center nixcon-rounded-full nixcon-w-8 nixcon-h-8 nixcon-bg-green-50">
              <DollarSign size={16} className="nixcon-text-primary" />
            </div>
          </div>
          <div>
            <h3 className="nixcon-text-2xl nixcon-font-semibold nixcon-text-gray-800">
              {dashboardData.totalEmitido}
            </h3>
            <div className="nixcon-flex nixcon-items-center nixcon-mt-1">
              <span className="nixcon-text-xs nixcon-text-gray-500 nixcon-mr-1">
                em relação ao período anterior
              </span>
              <span className="nixcon-badge nixcon-badge-primary nixcon-text-xs">
                {dashboardData.variacaoTotal}
              </span>
            </div>
          </div>
        </div>

        {/* Card de Quantidade de Documentos */}
        <div className="nixcon-card nixcon-p-4">
          <div className="nixcon-flex nixcon-items-start nixcon-justify-between nixcon-mb-4">
            <div>
              <p className="nixcon-text-sm nixcon-text-gray-500">Qtd. Documentos (Mês)</p>
            </div>
            <div className="nixcon-flex nixcon-items-center nixcon-justify-center nixcon-rounded-full nixcon-w-8 nixcon-h-8 nixcon-bg-blue-50">
              <ReceiptText size={16} className="nixcon-text-primary" />
            </div>
          </div>
          <div>
            <h3 className="nixcon-text-2xl nixcon-font-semibold nixcon-text-gray-800">
              {dashboardData.qtdDocumentos}
            </h3>
            <div className="nixcon-flex nixcon-items-center nixcon-mt-1">
              <span className="nixcon-text-xs nixcon-text-gray-500 nixcon-mr-1">
                em relação ao período anterior
              </span>
              <span className="nixcon-badge nixcon-badge-primary nixcon-text-xs">
                {dashboardData.variacaoQtd}
              </span>
            </div>
          </div>
        </div>

        {/* Card de Produtos Ativos */}
        <div className="nixcon-card nixcon-p-4 md:nixcon-col-span-2 lg:nixcon-col-span-1">
          <div className="nixcon-flex nixcon-items-start nixcon-justify-between nixcon-mb-4">
            <div>
              <p className="nixcon-text-sm nixcon-text-gray-500">Produtos Ativos</p>
            </div>
            <div className="nixcon-flex nixcon-items-center nixcon-justify-center nixcon-rounded-full nixcon-w-8 nixcon-h-8 nixcon-bg-yellow-50">
              <PackageOpen size={16} className="nixcon-text-primary" />
            </div>
          </div>
          <div>
            <h3 className="nixcon-text-2xl nixcon-font-semibold nixcon-text-gray-800">
              {dashboardData.produtosAtivos}
            </h3>
            <div className="nixcon-flex nixcon-items-center nixcon-mt-1">
              <span className="nixcon-text-xs nixcon-text-gray-500 nixcon-mr-1">
                em relação ao período anterior
              </span>
              <span className="nixcon-badge nixcon-badge-primary nixcon-text-xs">
                {dashboardData.variacaoProdutos}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Documentos Recentes */}
      <div className="nixcon-card nixcon-p-4">
        <div className="nixcon-flex nixcon-justify-between nixcon-items-center nixcon-mb-4">
          <h3 className="nixcon-subtitle">Documentos Recentes</h3>
          <button className="nixcon-btn-link nixcon-text-primary nixcon-text-sm">
            Ver todos
          </button>
        </div>
        <div className="nixcon-overflow-x-auto hide-scrollbar">
          <table className="nixcon-w-full nixcon-text-sm nixcon-text-left">
            <thead className="nixcon-text-xs nixcon-text-gray-500 nixcon-bg-gray-50">
              <tr>
                <th className="nixcon-px-4 nixcon-py-2">Número</th>
                <th className="nixcon-px-4 nixcon-py-2">Tipo</th>
                <th className="nixcon-px-4 nixcon-py-2">Cliente</th>
                <th className="nixcon-px-4 nixcon-py-2">Valor</th>
                <th className="nixcon-px-4 nixcon-py-2">Data</th>
                <th className="nixcon-px-4 nixcon-py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="nixcon-border-b nixcon-border-gray-100">
                <td className="nixcon-px-4 nixcon-py-3">001247</td>
                <td className="nixcon-px-4 nixcon-py-3">NFe</td>
                <td className="nixcon-px-4 nixcon-py-3">Empresa Alpha Ltda.</td>
                <td className="nixcon-px-4 nixcon-py-3">R$ 1.548,50</td>
                <td className="nixcon-px-4 nixcon-py-3">18/05/2025</td>
                <td className="nixcon-px-4 nixcon-py-3">
                  <span className="nixcon-badge nixcon-badge-primary">Autorizada</span>
                </td>
              </tr>
              <tr className="nixcon-border-b nixcon-border-gray-100">
                <td className="nixcon-px-4 nixcon-py-3">000342</td>
                <td className="nixcon-px-4 nixcon-py-3">NFSe</td>
                <td className="nixcon-px-4 nixcon-py-3">Comércio Beta S.A.</td>
                <td className="nixcon-px-4 nixcon-py-3">R$ 3.100,00</td>
                <td className="nixcon-px-4 nixcon-py-3">17/05/2025</td>
                <td className="nixcon-px-4 nixcon-py-3">
                  <span className="nixcon-badge nixcon-badge-primary">Autorizada</span>
                </td>
              </tr>
              <tr>
                <td className="nixcon-px-4 nixcon-py-3">001246</td>
                <td className="nixcon-px-4 nixcon-py-3">NFe</td>
                <td className="nixcon-px-4 nixcon-py-3">Distribuidora Gama</td>
                <td className="nixcon-px-4 nixcon-py-3">R$ 2.873,35</td>
                <td className="nixcon-px-4 nixcon-py-3">16/05/2025</td>
                <td className="nixcon-px-4 nixcon-py-3">
                  <span className="nixcon-badge nixcon-badge-primary">Autorizada</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FiscalResponsivo;