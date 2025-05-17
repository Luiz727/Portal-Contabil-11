import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

// Tipos de produtos para a simulação
interface Produto {
  id: number;
  nome: string;
  codigo: string;
  ncm: string;
  unidade: string;
  precoBase: number;
  aliquotaICMS: number;
  aliquotaIPI: number;
  aliquotaPIS: number;
  aliquotaCOFINS: number;
}

// Lista de produtos com alíquotas predefinidas
const produtosDisponiveis: Produto[] = [
  {
    id: 1,
    nome: "Smartphone",
    codigo: "SMRTPHNE001",
    ncm: "8517.12.31",
    unidade: "UN",
    precoBase: 1999.90,
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
    precoBase: 4500.00,
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
    precoBase: 800.00,
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
    precoBase: 300.00,
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
    precoBase: 150.00,
    aliquotaICMS: 18,
    aliquotaIPI: 10,
    aliquotaPIS: 1.65,
    aliquotaCOFINS: 7.6
  },
  {
    id: 6,
    nome: "Impressora Laser",
    codigo: "IMPR006",
    ncm: "8443.32.23",
    unidade: "UN",
    precoBase: 1200.00,
    aliquotaICMS: 18,
    aliquotaIPI: 15,
    aliquotaPIS: 1.65,
    aliquotaCOFINS: 7.6
  },
  {
    id: 7,
    nome: "Caixa de Som Bluetooth",
    codigo: "CXSOM007",
    ncm: "8518.22.00",
    unidade: "UN",
    precoBase: 250.00,
    aliquotaICMS: 18,
    aliquotaIPI: 20,
    aliquotaPIS: 1.65,
    aliquotaCOFINS: 7.6
  },
  {
    id: 8,
    nome: "Carregador USB-C",
    codigo: "CARREG008",
    ncm: "8504.40.10",
    unidade: "UN",
    precoBase: 89.90,
    aliquotaICMS: 18,
    aliquotaIPI: 15,
    aliquotaPIS: 1.65,
    aliquotaCOFINS: 7.6
  }
];

// Estados para simulação
const estados = [
  { sigla: "SP", nome: "São Paulo", aliquotaInterna: 18, aliquotaInterestadual: { sul: 12, outros: 7 } },
  { sigla: "RJ", nome: "Rio de Janeiro", aliquotaInterna: 20, aliquotaInterestadual: { sul: 12, outros: 7 } },
  { sigla: "MG", nome: "Minas Gerais", aliquotaInterna: 18, aliquotaInterestadual: { sul: 12, outros: 7 } },
  { sigla: "RS", nome: "Rio Grande do Sul", aliquotaInterna: 18, aliquotaInterestadual: { sul: 12, outros: 7 } },
  { sigla: "PR", nome: "Paraná", aliquotaInterna: 18, aliquotaInterestadual: { sul: 12, outros: 7 } },
  { sigla: "SC", nome: "Santa Catarina", aliquotaInterna: 17, aliquotaInterestadual: { sul: 12, outros: 7 } },
  { sigla: "ES", nome: "Espírito Santo", aliquotaInterna: 17, aliquotaInterestadual: { sul: 12, outros: 7 } },
  { sigla: "BA", nome: "Bahia", aliquotaInterna: 18, aliquotaInterestadual: { sul: 12, outros: 7 } },
  { sigla: "DF", nome: "Distrito Federal", aliquotaInterna: 18, aliquotaInterestadual: { sul: 12, outros: 7 } }
];

export default function TaxCalculator() {
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [quantidade, setQuantidade] = useState<number>(1);
  const [estadoOrigem, setEstadoOrigem] = useState<string>("SP");
  const [estadoDestino, setEstadoDestino] = useState<string>("RJ");
  const [tipoOperacao, setTipoOperacao] = useState<string>("venda");
  const [tipoContribuinte, setTipoContribuinte] = useState<string>("contribuinte");
  const [resultados, setResultados] = useState<any>(null);
  const [precoVenda, setPrecoVenda] = useState<number>(0);

  // Calcular todos os impostos quando o usuário clicar em Calcular
  const calcularImpostos = () => {
    if (!produtoSelecionado) return;

    // Preço base para cálculos
    const valorUnitario = precoVenda > 0 ? precoVenda : produtoSelecionado.precoBase;
    const valorTotal = valorUnitario * quantidade;

    // Alíquotas
    const aliquotaICMS = obterAliquotaICMS(estadoOrigem, estadoDestino, tipoContribuinte);
    const valorICMS = (valorTotal * aliquotaICMS) / 100;

    const aliquotaIPI = produtoSelecionado.aliquotaIPI;
    const valorIPI = (valorTotal * aliquotaIPI) / 100;

    const aliquotaPIS = produtoSelecionado.aliquotaPIS;
    const valorPIS = (valorTotal * aliquotaPIS) / 100;

    const aliquotaCOFINS = produtoSelecionado.aliquotaCOFINS;
    const valorCOFINS = (valorTotal * aliquotaCOFINS) / 100;

    // Calcula DIFAL para operações interestaduais
    let valorDIFAL = 0;
    if (estadoOrigem !== estadoDestino && tipoContribuinte === "contribuinte") {
      const estadoOrigemObj = estados.find(e => e.sigla === estadoOrigem);
      const estadoDestinoObj = estados.find(e => e.sigla === estadoDestino);
      
      if (estadoOrigemObj && estadoDestinoObj) {
        const aliquotaInterna = estadoDestinoObj.aliquotaInterna;
        const aliquotaInterestadual = obterAliquotaICMS(estadoOrigem, estadoDestino, tipoContribuinte);
        valorDIFAL = (valorTotal * (aliquotaInterna - aliquotaInterestadual)) / 100;
      }
    }

    // Total de impostos
    const totalImpostos = valorICMS + valorIPI + valorPIS + valorCOFINS + valorDIFAL;
    const percentualImpostos = (totalImpostos / valorTotal) * 100;

    // Valor com impostos
    const valorComImpostos = valorTotal + valorIPI; // IPI é "por fora"

    setResultados({
      valorUnitario,
      valorTotal,
      impostos: {
        icms: { aliquota: aliquotaICMS, valor: valorICMS },
        ipi: { aliquota: aliquotaIPI, valor: valorIPI },
        pis: { aliquota: aliquotaPIS, valor: valorPIS },
        cofins: { aliquota: aliquotaCOFINS, valor: valorCOFINS },
        difal: { valor: valorDIFAL }
      },
      totalImpostos,
      percentualImpostos,
      valorComImpostos
    });
  };

  // Obter alíquota de ICMS baseada nos estados de origem e destino
  const obterAliquotaICMS = (origem: string, destino: string, tipoContribuinte: string) => {
    // Se for a mesma UF, usa a alíquota interna
    if (origem === destino) {
      const estado = estados.find(e => e.sigla === origem);
      return estado ? estado.aliquotaInterna : 18; // default para SP
    }
    
    // Se for para não contribuinte, usa a alíquota interna do estado de origem
    if (tipoContribuinte === "nao-contribuinte") {
      const estado = estados.find(e => e.sigla === origem);
      return estado ? estado.aliquotaInterna : 18;
    }
    
    // Para operações interestaduais
    const estadoOrigem = estados.find(e => e.sigla === origem);
    const regiaoSul = ["RS", "SC", "PR"];
    const regiaoSudeste = ["SP", "RJ", "MG", "ES"];
    
    if (regiaoSul.includes(destino) || regiaoSudeste.includes(destino)) {
      return 12; // Alíquota para Sul e Sudeste
    } else {
      return 7; // Alíquota para as demais regiões
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0 fs-4">Calculadora de Impostos</h2>
              <p className="mb-0 small">Simule os impostos para operações fiscais</p>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-8">
                  <div className="form-group mb-3">
                    <label htmlFor="produto" className="form-label">Selecione o Produto</label>
                    <select 
                      id="produto" 
                      className="form-select" 
                      onChange={(e) => {
                        const produto = produtosDisponiveis.find(p => p.id === parseInt(e.target.value));
                        setProdutoSelecionado(produto || null);
                        if (produto) setPrecoVenda(produto.precoBase);
                      }}
                      value={produtoSelecionado?.id || ""}
                    >
                      <option value="">Selecione um produto</option>
                      {produtosDisponiveis.map(produto => (
                        <option key={produto.id} value={produto.id}>
                          {produto.nome} - {produto.codigo} - NCM: {produto.ncm}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <label htmlFor="quantidade" className="form-label">Quantidade</label>
                    <input 
                      type="number" 
                      id="quantidade" 
                      className="form-control" 
                      value={quantidade} 
                      onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
                      min="1"
                    />
                  </div>
                </div>
              </div>

              {produtoSelecionado && (
                <>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label htmlFor="precoVenda" className="form-label">Preço de Venda (R$)</label>
                        <input 
                          type="number" 
                          id="precoVenda" 
                          className="form-control" 
                          value={precoVenda} 
                          onChange={(e) => setPrecoVenda(parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label htmlFor="tipoOperacao" className="form-label">Tipo de Operação</label>
                        <select 
                          id="tipoOperacao" 
                          className="form-select" 
                          value={tipoOperacao} 
                          onChange={(e) => setTipoOperacao(e.target.value)}
                        >
                          <option value="venda">Venda</option>
                          <option value="transferencia">Transferência</option>
                          <option value="devolucao">Devolução</option>
                          <option value="bonificacao">Bonificação</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-4">
                      <div className="form-group mb-3">
                        <label htmlFor="estadoOrigem" className="form-label">Estado de Origem</label>
                        <select 
                          id="estadoOrigem" 
                          className="form-select" 
                          value={estadoOrigem} 
                          onChange={(e) => setEstadoOrigem(e.target.value)}
                        >
                          {estados.map(estado => (
                            <option key={estado.sigla} value={estado.sigla}>
                              {estado.sigla} - {estado.nome}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group mb-3">
                        <label htmlFor="estadoDestino" className="form-label">Estado de Destino</label>
                        <select 
                          id="estadoDestino" 
                          className="form-select" 
                          value={estadoDestino} 
                          onChange={(e) => setEstadoDestino(e.target.value)}
                        >
                          {estados.map(estado => (
                            <option key={estado.sigla} value={estado.sigla}>
                              {estado.sigla} - {estado.nome}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group mb-3">
                        <label htmlFor="tipoContribuinte" className="form-label">Destinatário</label>
                        <select 
                          id="tipoContribuinte" 
                          className="form-select" 
                          value={tipoContribuinte} 
                          onChange={(e) => setTipoContribuinte(e.target.value)}
                        >
                          <option value="contribuinte">Contribuinte ICMS</option>
                          <option value="nao-contribuinte">Não Contribuinte</option>
                          <option value="isento">Contribuinte Isento</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-grid mt-3">
                    <button 
                      className="btn btn-primary btn-lg" 
                      onClick={calcularImpostos}
                      disabled={!produtoSelecionado}
                    >
                      Calcular Impostos
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {resultados && (
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-success text-white">
                <h3 className="mb-0 fs-4">Resultado da Simulação</h3>
              </div>
              <div className="card-body">
                <div className="row mb-4">
                  <div className="col-md-4">
                    <div className="card h-100 border-primary">
                      <div className="card-header bg-primary text-white">Valores</div>
                      <div className="card-body">
                        <p><strong>Valor Unitário:</strong> {formatCurrency(resultados.valorUnitario)}</p>
                        <p><strong>Quantidade:</strong> {quantidade}</p>
                        <p><strong>Valor Total:</strong> {formatCurrency(resultados.valorTotal)}</p>
                        <p><strong>Valor com Impostos:</strong> {formatCurrency(resultados.valorComImpostos)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="card h-100 border-danger">
                      <div className="card-header bg-danger text-white">Impostos</div>
                      <div className="card-body">
                        <p><strong>ICMS ({resultados.impostos.icms.aliquota}%):</strong> {formatCurrency(resultados.impostos.icms.valor)}</p>
                        <p><strong>IPI ({resultados.impostos.ipi.aliquota}%):</strong> {formatCurrency(resultados.impostos.ipi.valor)}</p>
                        <p><strong>PIS ({resultados.impostos.pis.aliquota}%):</strong> {formatCurrency(resultados.impostos.pis.valor)}</p>
                        <p><strong>COFINS ({resultados.impostos.cofins.aliquota}%):</strong> {formatCurrency(resultados.impostos.cofins.valor)}</p>
                        {resultados.impostos.difal.valor > 0 && (
                          <p><strong>DIFAL:</strong> {formatCurrency(resultados.impostos.difal.valor)}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="card h-100 border-info">
                      <div className="card-header bg-info text-white">Resumo</div>
                      <div className="card-body">
                        <p><strong>Total de Impostos:</strong> {formatCurrency(resultados.totalImpostos)}</p>
                        <p><strong>Percentual sobre Valor:</strong> {resultados.percentualImpostos.toFixed(2)}%</p>
                        <hr />
                        <p className="alert alert-warning">
                          <strong>Nota:</strong> Esta é apenas uma simulação. Consulte seu contador para valores exatos.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <div className="progress" style={{ height: '30px' }}>
                      <div 
                        className="progress-bar bg-danger" 
                        role="progressbar" 
                        style={{ width: `${resultados.percentualImpostos}%` }} 
                        aria-valuenow={resultados.percentualImpostos} 
                        aria-valuemin={0} 
                        aria-valuemax={100}
                      >
                        {resultados.percentualImpostos.toFixed(2)}% em Impostos
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
