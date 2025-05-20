import { useState, useEffect } from "react";
import { formatCurrency, cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

// Tipos para o sistema
interface Produto {
  id: number;
  nome: string;
  codigo: string;
  ncm: string;
  unidade: string;
  precoCusto: number;
  precoVenda: number;
  aliquotaICMS: number;
  aliquotaIPI: number;
  aliquotaPIS: number;
  aliquotaCOFINS: number;
}

interface Cliente {
  id?: number;
  nome: string;
  apelido?: string;
  documento?: string;
  estadoId?: string;
  cidade?: string;
  contribuinte: boolean;
}

interface ItemSimulacao {
  produtoId: number;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  custoUnitario: number;
  custoTotal: number;
  impostos: {
    icms: { aliquota: number; valor: number };
    ipi: { aliquota: number; valor: number };
    pis: { aliquota: number; valor: number };
    cofins: { aliquota: number; valor: number };
    difal?: { aliquota: number; valor: number };
  };
  totalImpostos: number;
  margemContribuicao: number;
  percentualImpostos: number;
}

interface Simulacao {
  id?: number;
  data: string;
  clienteId?: number;
  cliente?: Cliente;
  estadoOrigem: string;
  estadoDestino: string;
  tipoOperacao: string;
  itens: ItemSimulacao[];
  resumo: {
    valorTotal: number;
    custoTotal: number;
    impostosSobreVendas: number;
    impostosSobreCompras: number;
    difal: number;
    lucroBruto: number;
    margemContribuicao: number;
  };
}

// Estados para simulação
const estados = [
  { id: "SP", nome: "São Paulo", aliquotaInterna: 18, aliquotaInterestadual: { sul: 12, outros: 7 } },
  { id: "RJ", nome: "Rio de Janeiro", aliquotaInterna: 20, aliquotaInterestadual: { sul: 12, outros: 7 } },
  { id: "MG", nome: "Minas Gerais", aliquotaInterna: 18, aliquotaInterestadual: { sul: 12, outros: 7 } },
  { id: "RS", nome: "Rio Grande do Sul", aliquotaInterna: 18, aliquotaInterestadual: { sul: 12, outros: 7 } },
  { id: "PR", nome: "Paraná", aliquotaInterna: 18, aliquotaInterestadual: { sul: 12, outros: 7 } },
  { id: "SC", nome: "Santa Catarina", aliquotaInterna: 17, aliquotaInterestadual: { sul: 12, outros: 7 } },
  { id: "ES", nome: "Espírito Santo", aliquotaInterna: 17, aliquotaInterestadual: { sul: 12, outros: 7 } },
  { id: "BA", nome: "Bahia", aliquotaInterna: 18, aliquotaInterestadual: { sul: 12, outros: 7 } },
  { id: "DF", nome: "Distrito Federal", aliquotaInterna: 18, aliquotaInterestadual: { sul: 12, outros: 7 } }
];

// Tipos de operações fiscais
const tiposOperacao = [
  { id: "venda", nome: "Venda" },
  { id: "transferencia", nome: "Transferência" },
  { id: "devolucao", nome: "Devolução" },
  { id: "bonificacao", nome: "Bonificação" }
];

export default function TaxCalculator() {
  // Estado para controle dos dados da simulação
  const [simulacao, setSimulacao] = useState<Simulacao>({
    data: new Date().toISOString().split('T')[0],
    estadoOrigem: "SP",
    estadoDestino: "SP",
    tipoOperacao: "venda",
    itens: [],
    resumo: {
      valorTotal: 0,
      custoTotal: 0,
      impostosSobreVendas: 0,
      impostosSobreCompras: 0,
      difal: 0,
      lucroBruto: 0,
      margemContribuicao: 0
    }
  });

  // Estados para controle da interface
  const [novoCliente, setNovoCliente] = useState<Cliente>({
    nome: "",
    contribuinte: true,
    estadoId: "SP"
  });
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [quantidade, setQuantidade] = useState<number>(1);
  const [precoVenda, setPrecoVenda] = useState<number>(0);
  const [itemEditando, setItemEditando] = useState<number | null>(null);
  const [simulacoesSalvas, setSimulacoesSalvas] = useState<Simulacao[]>([]);
  const [mostrarClienteForm, setMostrarClienteForm] = useState<boolean>(false);
  const [modoEdicao, setModoEdicao] = useState<boolean>(false);
  const [simulacaoId, setSimulacaoId] = useState<number | null>(null);

  // Fetch de dados do sistema
  const { data: produtos } = useQuery({
    queryKey: ['/api/produtos'],
    queryFn: async () => {
      // Enquanto não temos a API, usamos dados simulados
      return [
        {
          id: 1,
          nome: "Smartphone",
          codigo: "SMRTPHNE001",
          ncm: "8517.12.31",
          unidade: "UN",
          precoCusto: 1200.00,
          precoVenda: 1999.90,
          aliquotaICMS: 18,
          aliquotaIPI: 15,
          aliquotaPIS: 1.65,
          aliquotaCOFINS: 7.6
        },
        {
          id: 2,
          nome: "Notebook",
          codigo: "NOTEBK002",
          ncm: "8471.30.12",
          unidade: "UN",
          precoCusto: 3200.00,
          precoVenda: 4500.00,
          aliquotaICMS: 18,
          aliquotaIPI: 15,
          aliquotaPIS: 1.65,
          aliquotaCOFINS: 7.6
        },
        {
          id: 3,
          nome: "Monitor LED 24''",
          codigo: "MONTR003",
          ncm: "8528.52.20",
          unidade: "UN",
          precoCusto: 500.00,
          precoVenda: 800.00,
          aliquotaICMS: 18,
          aliquotaIPI: 15,
          aliquotaPIS: 1.65,
          aliquotaCOFINS: 7.6
        },
        {
          id: 4,
          nome: "Teclado Mecânico",
          codigo: "TECL004",
          ncm: "8471.60.52",
          unidade: "UN",
          precoCusto: 180.00,
          precoVenda: 300.00,
          aliquotaICMS: 18,
          aliquotaIPI: 10,
          aliquotaPIS: 1.65,
          aliquotaCOFINS: 7.6
        },
        {
          id: 5,
          nome: "Mouse Gamer",
          codigo: "MOUSE005",
          ncm: "8471.60.53",
          unidade: "UN",
          precoCusto: 90.00,
          precoVenda: 150.00,
          aliquotaICMS: 18,
          aliquotaIPI: 10,
          aliquotaPIS: 1.65,
          aliquotaCOFINS: 7.6
        }
      ];
    }
  });

  const { data: clientes } = useQuery({
    queryKey: ['/api/clientes'],
    queryFn: async () => {
      // Enquanto não temos a API, usamos dados simulados
      return [
        { id: 1, nome: "Empresa ABC Ltda", apelido: "ABC", documento: "12.345.678/0001-90", estadoId: "SP", cidade: "São Paulo", contribuinte: true },
        { id: 2, nome: "XYZ Comércio de Eletrônicos", apelido: "XYZ Eletrônicos", documento: "98.765.432/0001-10", estadoId: "RJ", cidade: "Rio de Janeiro", contribuinte: true },
        { id: 3, nome: "Maria da Silva", apelido: "Maria", documento: "123.456.789-00", estadoId: "MG", cidade: "Belo Horizonte", contribuinte: false }
      ];
    }
  });
  
  // Método para adicionar ou atualizar um item na simulação
  const adicionarOuAtualizarItem = () => {
    if (!produtoSelecionado) return;
    
    // Calcular valores do item
    const valorUnitario = precoVenda > 0 ? precoVenda : produtoSelecionado.precoVenda;
    const valorTotal = valorUnitario * quantidade;
    const custoUnitario = produtoSelecionado.precoCusto;
    const custoTotal = custoUnitario * quantidade;
    
    // Calcular impostos
    const aliquotaICMS = obterAliquotaICMS(simulacao.estadoOrigem, simulacao.estadoDestino, novoCliente.contribuinte);
    const valorICMS = (valorTotal * aliquotaICMS) / 100;
    
    const aliquotaIPI = produtoSelecionado.aliquotaIPI;
    const valorIPI = (valorTotal * aliquotaIPI) / 100;
    
    const aliquotaPIS = produtoSelecionado.aliquotaPIS;
    const valorPIS = (valorTotal * aliquotaPIS) / 100;
    
    const aliquotaCOFINS = produtoSelecionado.aliquotaCOFINS;
    const valorCOFINS = (valorTotal * aliquotaCOFINS) / 100;
    
    // Calcular DIFAL se aplicável
    let valorDIFAL = 0;
    let aliquotaDIFAL = 0;
    
    if (simulacao.estadoOrigem !== simulacao.estadoDestino && novoCliente.contribuinte) {
      const estadoDestinoObj = estados.find(e => e.id === simulacao.estadoDestino);
      if (estadoDestinoObj) {
        aliquotaDIFAL = estadoDestinoObj.aliquotaInterna - aliquotaICMS;
        valorDIFAL = (valorTotal * aliquotaDIFAL) / 100;
      }
    }
    
    // Total de impostos
    const impostosSobreVendas = valorICMS + valorIPI + valorPIS + valorCOFINS;
    const totalImpostos = impostosSobreVendas + valorDIFAL;
    const percentualImpostos = (totalImpostos / valorTotal) * 100;
    
    // Margem de contribuição
    const margemContribuicao = ((valorTotal - custoTotal - totalImpostos) / valorTotal) * 100;
    
    // Criar objeto de item
    const novoItem: ItemSimulacao = {
      produtoId: produtoSelecionado.id,
      quantidade,
      valorUnitario,
      valorTotal,
      custoUnitario,
      custoTotal,
      impostos: {
        icms: { aliquota: aliquotaICMS, valor: valorICMS },
        ipi: { aliquota: aliquotaIPI, valor: valorIPI },
        pis: { aliquota: aliquotaPIS, valor: valorPIS },
        cofins: { aliquota: aliquotaCOFINS, valor: valorCOFINS }
      },
      totalImpostos,
      margemContribuicao,
      percentualImpostos
    };
    
    // Adicionar DIFAL se houver
    if (valorDIFAL > 0) {
      novoItem.impostos.difal = { aliquota: aliquotaDIFAL, valor: valorDIFAL };
    }
    
    // Atualizar a simulação
    let novosItens: ItemSimulacao[];
    
    if (itemEditando !== null) {
      // Atualizar item existente
      novosItens = [...simulacao.itens];
      novosItens[itemEditando] = novoItem;
    } else {
      // Adicionar novo item
      novosItens = [...simulacao.itens, novoItem];
    }
    
    // Atualizar o estado com os novos itens
    atualizarSimulacaoComItens(novosItens);
    
    // Limpar campos do formulário
    setProdutoSelecionado(null);
    setQuantidade(1);
    setPrecoVenda(0);
    setItemEditando(null);
  };
  
  // Método para atualizar os totais da simulação com base nos itens
  const atualizarSimulacaoComItens = (itens: ItemSimulacao[]) => {
    // Calcular os totais
    const valorTotal = itens.reduce((total, item) => total + item.valorTotal, 0);
    const custoTotal = itens.reduce((total, item) => total + item.custoTotal, 0);
    
    const impostosSobreVendas = itens.reduce((total, item) => {
      return total + item.impostos.icms.valor + item.impostos.ipi.valor + 
             item.impostos.pis.valor + item.impostos.cofins.valor;
    }, 0);
    
    const difal = itens.reduce((total, item) => {
      return total + (item.impostos.difal?.valor || 0);
    }, 0);
    
    // Assumindo que impostos sobre compras são zero para simplificar
    const impostosSobreCompras = 0;
    
    // Lucro bruto = Valor Total - Custo Total - Impostos
    const lucroBruto = valorTotal - custoTotal - impostosSobreVendas - difal;
    
    // Margem de contribuição percentual
    const margemContribuicao = valorTotal > 0 ? (lucroBruto / valorTotal) * 100 : 0;
    
    // Atualizar o estado da simulação
    setSimulacao(prev => ({
      ...prev,
      itens,
      resumo: {
        valorTotal,
        custoTotal,
        impostosSobreVendas,
        impostosSobreCompras,
        difal,
        lucroBruto,
        margemContribuicao
      }
    }));
  };
  
  // Obter alíquota de ICMS baseada nos estados de origem e destino
  const obterAliquotaICMS = (origem: string, destino: string, isContribuinte: boolean) => {
    // Se for a mesma UF, usa a alíquota interna
    if (origem === destino) {
      const estado = estados.find(e => e.id === origem);
      return estado ? estado.aliquotaInterna : 18; // default para SP
    }
    
    // Se for para não contribuinte, usa a alíquota interna do estado de origem
    if (!isContribuinte) {
      const estado = estados.find(e => e.id === origem);
      return estado ? estado.aliquotaInterna : 18;
    }
    
    // Para operações interestaduais
    const regiaoSul = ["RS", "SC", "PR"];
    const regiaoSudeste = ["SP", "RJ", "MG", "ES"];
    
    if (regiaoSul.includes(destino) || regiaoSudeste.includes(destino)) {
      return 12; // Alíquota para Sul e Sudeste
    } else {
      return 7; // Alíquota para as demais regiões
    }
  };
  
  // Funções para operações de simulação
  const salvarSimulacao = () => {
    const novaSimulacao = { ...simulacao };
    
    if (modoEdicao && simulacaoId !== null) {
      // Atualizar simulação existente
      const atualizadas = simulacoesSalvas.map(sim => 
        sim.id === simulacaoId ? { ...novaSimulacao, id: simulacaoId } : sim
      );
      setSimulacoesSalvas(atualizadas);
    } else {
      // Criar nova simulação
      const novoId = (Math.max(0, ...simulacoesSalvas.map(s => s.id || 0)) + 1);
      setSimulacoesSalvas([...simulacoesSalvas, { ...novaSimulacao, id: novoId }]);
      setSimulacaoId(novoId);
    }
    
    setModoEdicao(true);
    
    // Aqui você chamaria a API para salvar
    console.log("Simulação salva:", novaSimulacao);
  };
  
  const editarSimulacao = (id: number) => {
    const simParaEditar = simulacoesSalvas.find(s => s.id === id);
    if (simParaEditar) {
      setSimulacao(simParaEditar);
      setSimulacaoId(id);
      setModoEdicao(true);
    }
  };
  
  const excluirSimulacao = (id: number) => {
    const atualizadas = simulacoesSalvas.filter(s => s.id !== id);
    setSimulacoesSalvas(atualizadas);
    
    if (simulacaoId === id) {
      // Resetar a simulação atual se estiver excluindo a que estava editando
      novaSimulacao();
    }
  };
  
  const enviarSimulacao = () => {
    // Enviar para o módulo de comunicação
    console.log("Enviando simulação para análise do escritório:", simulacao);
    alert("Simulação enviada para análise do escritório de contabilidade!");
  };
  
  const novaSimulacao = () => {
    setSimulacao({
      data: new Date().toISOString().split('T')[0],
      estadoOrigem: "SP",
      estadoDestino: "SP",
      tipoOperacao: "venda",
      itens: [],
      resumo: {
        valorTotal: 0,
        custoTotal: 0,
        impostosSobreVendas: 0,
        impostosSobreCompras: 0,
        difal: 0,
        lucroBruto: 0,
        margemContribuicao: 0
      }
    });
    setModoEdicao(false);
    setSimulacaoId(null);
    setProdutoSelecionado(null);
    setQuantidade(1);
    setPrecoVenda(0);
    setItemEditando(null);
  };
  
  const removerItem = (index: number) => {
    const novosItens = [...simulacao.itens];
    novosItens.splice(index, 1);
    atualizarSimulacaoComItens(novosItens);
  };
  
  const editarItem = (index: number) => {
    const item = simulacao.itens[index];
    const produto = produtos?.find(p => p.id === item.produtoId);
    
    if (produto) {
      setProdutoSelecionado(produto);
      setQuantidade(item.quantidade);
      setPrecoVenda(item.valorUnitario);
      setItemEditando(index);
    }
  };
  
  const selecionarCliente = (clienteId: number) => {
    const clienteSelecionado = clientes?.find(c => c.id === clienteId);
    if (clienteSelecionado) {
      setNovoCliente(clienteSelecionado);
      setSimulacao(prev => ({
        ...prev, 
        clienteId: clienteSelecionado.id,
        cliente: clienteSelecionado,
        estadoDestino: clienteSelecionado.estadoId || prev.estadoDestino
      }));
      setMostrarClienteForm(false);
    }
  };

  // Formatar número para moeda
  const formatarNumero = (valor: number) => {
    return valor.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Calculadora de Impostos</h1>
          <p className="text-gray-600">Simulação fiscal para análise de viabilidade</p>
        </div>
        <div className="space-x-2">
          <button 
            onClick={novaSimulacao}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Nova Simulação
          </button>
          
          {simulacoesSalvas.length > 0 && (
            <div className="relative inline-block text-left">
              <button 
                type="button"
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                onClick={() => document.getElementById('simulacoesDropdown')?.classList.toggle('hidden')}
              >
                Simulações Salvas ▼
              </button>
              <div 
                id="simulacoesDropdown" 
                className="hidden absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div className="p-2">
                  {simulacoesSalvas.map(sim => (
                    <div key={sim.id} className="p-2 hover:bg-gray-100 rounded-md flex justify-between items-center">
                      <div>
                        <p className="font-medium">{sim.cliente?.nome || "Cliente não definido"}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(sim.data).toLocaleDateString()} - {formatCurrency(sim.resumo.valorTotal)}
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        <button 
                          onClick={() => editarSimulacao(sim.id!)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <span className="material-icons text-sm">edit</span>
                        </button>
                        <button 
                          onClick={() => excluirSimulacao(sim.id!)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <span className="material-icons text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Cabeçalho da Simulação */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
            <input 
              type="date" 
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={simulacao.data}
              onChange={(e) => setSimulacao({...simulacao, data: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
            <div className="flex">
              <select 
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={simulacao.clienteId || ""}
                onChange={(e) => selecionarCliente(parseInt(e.target.value))}
              >
                <option value="">Selecione um cliente</option>
                {clientes?.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </option>
                ))}
              </select>
              <button 
                type="button"
                className="ml-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                onClick={() => setMostrarClienteForm(!mostrarClienteForm)}
              >
                <span className="material-icons text-sm">add</span>
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado de Origem</label>
            <select 
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={simulacao.estadoOrigem}
              onChange={(e) => setSimulacao({...simulacao, estadoOrigem: e.target.value})}
            >
              {estados.map(estado => (
                <option key={estado.id} value={estado.id}>
                  {estado.id} - {estado.nome}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado de Destino</label>
            <select 
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={simulacao.estadoDestino}
              onChange={(e) => setSimulacao({...simulacao, estadoDestino: e.target.value})}
            >
              {estados.map(estado => (
                <option key={estado.id} value={estado.id}>
                  {estado.id} - {estado.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Operação</label>
          <select 
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={simulacao.tipoOperacao}
            onChange={(e) => setSimulacao({...simulacao, tipoOperacao: e.target.value})}
          >
            {tiposOperacao.map(tipo => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nome}
              </option>
            ))}
          </select>
        </div>
        
        {/* Formulário de cadastro de cliente (condicional) */}
        {mostrarClienteForm && (
          <div className="mt-4 p-4 border border-gray-200 rounded-md">
            <h3 className="font-medium text-lg mb-3">Cadastrar Novo Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input 
                  type="text" 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={novoCliente.nome}
                  onChange={(e) => setNovoCliente({...novoCliente, nome: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apelido/Nome Fantasia</label>
                <input 
                  type="text" 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={novoCliente.apelido || ''}
                  onChange={(e) => setNovoCliente({...novoCliente, apelido: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Documento (CNPJ/CPF)</label>
                <input 
                  type="text" 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={novoCliente.documento || ''}
                  onChange={(e) => setNovoCliente({...novoCliente, documento: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={novoCliente.estadoId || ''}
                  onChange={(e) => setNovoCliente({...novoCliente, estadoId: e.target.value})}
                >
                  {estados.map(estado => (
                    <option key={estado.id} value={estado.id}>
                      {estado.id} - {estado.nome}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                <input 
                  type="text" 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={novoCliente.cidade || ''}
                  onChange={(e) => setNovoCliente({...novoCliente, cidade: e.target.value})}
                />
              </div>
              
              <div className="flex items-center">
                <label className="inline-flex items-center mt-6">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    checked={novoCliente.contribuinte}
                    onChange={(e) => setNovoCliente({...novoCliente, contribuinte: e.target.checked})}
                  />
                  <span className="ml-2 text-gray-700">Contribuinte ICMS</span>
                </label>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-2">
              <button 
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                onClick={() => setMostrarClienteForm(false)}
              >
                Cancelar
              </button>
              <button 
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => {
                  // Salvaria o cliente na API e depois:
                  const novoId = Date.now(); // simulando um ID
                  const clienteCompleto = { ...novoCliente, id: novoId };
                  
                  // Simular adição ao banco
                  // Na implementação real, isso viria da resposta da API
                  setSimulacao(prev => ({
                    ...prev, 
                    clienteId: novoId,
                    cliente: clienteCompleto,
                    estadoDestino: clienteCompleto.estadoId || prev.estadoDestino
                  }));
                  
                  setMostrarClienteForm(false);
                }}
              >
                Salvar Cliente
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Formulário de Produtos */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-medium text-lg mb-3">Adicionar Produto</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
            <select 
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={produtoSelecionado?.id || ""}
              onChange={(e) => {
                const produto = produtos?.find(p => p.id === parseInt(e.target.value));
                setProdutoSelecionado(produto || null);
                if (produto) setPrecoVenda(produto.precoVenda);
              }}
            >
              <option value="">Selecione um produto</option>
              {produtos?.map(produto => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome} - {produto.codigo}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
            <input 
              type="number" 
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={quantidade}
              onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
              min="1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Venda (R$)</label>
            <input 
              type="number" 
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={precoVenda}
              onChange={(e) => setPrecoVenda(parseFloat(e.target.value) || 0)}
              step="0.01"
              min="0"
            />
          </div>
        </div>
        
        <div className="mt-4 text-right">
          <button 
            type="button"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            onClick={adicionarOuAtualizarItem}
            disabled={!produtoSelecionado}
          >
            {itemEditando !== null ? 'Atualizar Produto' : 'Adicionar Produto'}
          </button>
        </div>
      </div>
      
      {/* Lista de Produtos */}
      <div className="overflow-x-auto rounded-lg shadow mb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qtd</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">$ Unit.</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">$ Total</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Impostos</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Margem</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {simulacao.itens.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  Nenhum produto adicionado à simulação
                </td>
              </tr>
            ) : (
              simulacao.itens.map((item, index) => {
                const produto = produtos?.find(p => p.id === item.produtoId);
                return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {produto?.nome || `Produto #${item.produtoId}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantidade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {formatCurrency(item.valorUnitario)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium text-right">
                      {formatCurrency(item.valorTotal)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {formatCurrency(item.totalImpostos)} 
                      <span className="text-xs text-gray-400 ml-1">
                        ({item.percentualImpostos.toFixed(1)}%)
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={cn(
                        "px-2 py-1 text-xs rounded-full",
                        item.margemContribuicao < 0 ? "bg-red-100 text-red-800" :
                        item.margemContribuicao < 10 ? "bg-yellow-100 text-yellow-800" :
                        "bg-green-100 text-green-800"
                      )}>
                        {item.margemContribuicao.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => editarItem(index)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <span className="material-icons text-sm">edit</span>
                      </button>
                      <button 
                        onClick={() => removerItem(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <span className="material-icons text-sm">delete</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Resumo da Simulação */}
      {simulacao.itens.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-lg mb-3">Resumo da Simulação</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="text-lg font-medium text-gray-800 mb-3">Valores</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Faturamento:</span>
                  <span className="font-medium">{formatCurrency(simulacao.resumo.valorTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Custo Total:</span>
                  <span className="font-medium">{formatCurrency(simulacao.resumo.custoTotal)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Lucro Bruto:</span>
                  <span className="font-medium">{formatCurrency(simulacao.resumo.lucroBruto)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Margem de Contribuição:</span>
                  <span className={cn(
                    "font-medium",
                    simulacao.resumo.margemContribuicao < 0 ? "text-red-600" : 
                    simulacao.resumo.margemContribuicao < 10 ? "text-yellow-600" : 
                    "text-green-600"
                  )}>
                    {simulacao.resumo.margemContribuicao.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="text-lg font-medium text-gray-800 mb-3">Impostos</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Impostos sobre Vendas:</span>
                  <span className="font-medium">{formatCurrency(simulacao.resumo.impostosSobreVendas)}</span>
                </div>
                {simulacao.resumo.difal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">DIFAL:</span>
                    <span className="font-medium">{formatCurrency(simulacao.resumo.difal)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Impostos sobre Compras:</span>
                  <span className="font-medium">{formatCurrency(simulacao.resumo.impostosSobreCompras)}</span>
                </div>
                <div className="flex justify-between text-red-600 border-t pt-2">
                  <span>Total de Impostos:</span>
                  <span className="font-medium">
                    {formatCurrency(simulacao.resumo.impostosSobreVendas + simulacao.resumo.impostosSobreCompras + simulacao.resumo.difal)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="text-lg font-medium text-gray-800 mb-3">Resumo por Produto</h4>
              <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                {simulacao.itens.map((item, index) => {
                  const produto = produtos?.find(p => p.id === item.produtoId);
                  return (
                    <div key={index} className="text-sm">
                      <div className="font-medium">{produto?.nome || `Produto #${item.produtoId}`}</div>
                      <div className="flex justify-between text-gray-600">
                        <span>Valor: {formatCurrency(item.valorTotal)}</span>
                        <span>Impostos: {formatarNumero(item.percentualImpostos)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Barra de progresso de impostos */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-1">
              <span>Carga Tributária</span>
              <span>
                {formatarNumero((simulacao.resumo.impostosSobreVendas + simulacao.resumo.difal) / simulacao.resumo.valorTotal * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-red-600 h-2.5 rounded-full" 
                style={{ width: `${(simulacao.resumo.impostosSobreVendas + simulacao.resumo.difal) / simulacao.resumo.valorTotal * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Botões de Ação */}
      {simulacao.itens.length > 0 && (
        <div className="flex justify-end space-x-3">
          <button 
            type="button"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            onClick={novaSimulacao}
          >
            Nova Simulação
          </button>
          <button 
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={salvarSimulacao}
          >
            {modoEdicao ? 'Atualizar Simulação' : 'Salvar Simulação'}
          </button>
          <button 
            type="button"
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            onClick={enviarSimulacao}
          >
            Enviar para Análise
          </button>
        </div>
      )}
    </div>
  );
}
